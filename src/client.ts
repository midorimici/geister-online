import Draw from './draw';
import Mouse from './mouse';
import Piece from './piece';

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

let myroom: string;
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
    myroom = info.roomId;
    myrole = info.role;
    myname = info.name;
    socket.emit('enter room', info);
}, false);

socket.on('room full', (id: string) => {
    const p: HTMLElement = document.getElementById('message');
    p.innerText = `ルーム${id}はいっぱいです。対戦者として参加することはできません。`;
});

socket.on('no room', (id: string)=> {
    const p: HTMLElement = document.getElementById('message');
    p.innerText = `ルーム${id}では対戦が行われていません。`;
});

socket.on('wait opponent', () => {
    if (!doneInitCanvas) {initCanvas()};
    draw.waitingPlayer();
});

// 駒配置

let posmap: Map<string, 'R' | 'B'> = new Map();
for (let i = 1; i <= 4; i++) {
    for (let j = 2; j <= 3; j++) {
        posmap.set(`${i},${j}`, 'R');
    }
}

let mouse: Mouse;

socket.on('place pieces', () => {
    if (!doneInitCanvas) {initCanvas()};
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const csize = canvas.width;
    let satisfied: boolean = false;

    const checkColor = (colors: ('R' | 'B')[]): boolean => {
        return (colors.filter((color: 'R' | 'B') => color === 'R')).length
            === (colors.filter((color: 'R' | 'B') => color === 'B')).length;
    }

    const drawDisp = () => {
        draw.decidePiecePlace(posmap, !satisfied);
    }

    drawDisp();

    // マウスイベント
    mouse = new Mouse(canvas);
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
                socket.emit('decided place',
                    myroom, myname, [...posmap.entries()]);
            } else {
                console.log('ng');
            }
        }
        drawDisp();
    }
});

socket.on('wait placing', () => {
    if (!doneInitCanvas) {initCanvas()};
    draw.waitingPlacing();
});

socket.on('game', (board: [string, Piece][]) => {
    const boardmap: Map<string, Piece> = new Map(board);
    console.log(boardmap);
});

socket.on('player discon', (name: string) => {
    alert(`${name}さんの接続が切れました。`);
    location.reload();
});