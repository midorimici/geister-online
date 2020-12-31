import Draw from './draw';
import Mouse from './mouse';

// 対戦するを選択したときはユーザー名入力欄を表示
const radios: NodeListOf<HTMLElement> = document.getElementsByName('role');
for (let i: number = 0; i <= 1; i++) {
    let state: string = '';
    if (i === 0) {
        state = 'visible';
    } else {
        state = 'hidden';
    }
    radios[i].addEventListener('click', () => {
        document.getElementById('username-div').style.visibility = state;
    });
}

// 入室～対戦相手待機

let myrole: 'play' | 'watch';
let myname: string;
let draw: Draw;
let doneInitCanvas: boolean = false;

const initCanvas = () => {
    document.getElementById('settings').style.display = 'none';
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    draw = new Draw(canvas);
    doneInitCanvas = true;
}

const socket: SocketIOClient.Socket = io();
const form = document.getElementById('form') as HTMLFormElement;
form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const data = new FormData(form);
    const info = {
        roomId: data.get('room') as string,
        role: data.get('role') as ('play' | 'watch'),
        name: data.get('username') as string,
    };
    myrole = info.role;
    myname = info.name;
    socket.emit('enterRoom', info);
}, false);

socket.on('roomFull', (id: string) => {
    const p: HTMLElement = document.getElementById('message');
    p.innerText = `ルーム${id}はいっぱいです。対戦者として参加することはできません。`;
});

socket.on('noRoom', (id: string)=> {
    const p: HTMLElement = document.getElementById('message');
    p.innerText = `ルーム${id}では対戦が行われていません。`;
});

socket.on('wait', () => {
    if (!doneInitCanvas) {initCanvas()};
    draw.waitingPlayer();
});

// 駒配置

let posmap: Map<string, string> = new Map();
for (let i = 1; i <= 4; i++) {
    for (let j = 2; j <= 3; j++) {
        posmap.set(`${i},${j}`, 'R');
    }
}

let mouse: Mouse;

socket.on('startGame', (room: {player1: string, player2: string}) => {
    if (!doneInitCanvas) {initCanvas()};
    if (myrole === 'play') {
        const checkColor = (colors: string[]): boolean => {
            return (colors.filter((color: string) => color === 'R')).length
                === (colors.filter((color: string) => color === 'B')).length;
        }

        const drawDisp = (disabled: boolean) => {
            if (room.player1 === myname) {
                // 先手
                draw.decidePiecePlace(0, posmap, disabled);
            } else {
                // 後手
                draw.decidePiecePlace(1, posmap, disabled);
            }
        }
        drawDisp(true);

        // マウスイベント
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const csize = canvas.width;
        mouse = new Mouse(canvas);
        let satisfied: boolean;
        canvas.onclick = (e: MouseEvent) => {
            for (let i = 1; i <= 4; i++) {
                for (let j = 2; j <= 3; j++) {
                    if (String(mouse.getCoord(e)) === String([i, j])) {
                        posmap.set(`${i},${j}`,
                            posmap.get(`${i},${j}`) === 'R'
                                ? 'B' : 'R');
                        satisfied = checkColor(Array.from(posmap.values()));
                    }
                }
            }
            if (mouse.onArea(...mouse.getWindowPos(e),
                    csize*5/6, csize*5/6, csize/8, csize/12)) {
                if (satisfied) {
                    console.log('ok');
                } else {
                    console.log('ng');
                }
            }
            drawDisp(!satisfied);
        }
    } else {
        draw.waitingPlacing();
    }
})

socket.on('player_discon', (name: string) => {
    alert(`${name}さんの接続が切れました。`);
    location.reload();
});