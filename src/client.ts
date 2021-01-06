import Draw from './draw';
import Mouse from './mouse';
import Piece from './piece';

// 入室～対戦相手待機

let draw: Draw;
/** initCanvas を実行済か */
let doneInitCanvas: boolean = false;

/** 入力フォームを非表示にし、canvas を表示する */
const initCanvas = () => {
    document.getElementById('settings').style.display = 'none';
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    draw = new Draw(canvas);
    doneInitCanvas = true;
}

/** 対戦者か観戦者か */
let myrole: 'play' | 'watch';

// フォーム取得
const socket: SocketIOClient.Socket = io();
const form = document.getElementById('form') as HTMLFormElement;
form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const data = new FormData(form);
    const info = {
        roomId: data.get('room') as string,
        role: data.get('role') as ('play' | 'watch'),
        name: data.get('username') === ''
            ? '名無し' : data.get('username') as string,
    };
    myrole = info.role;
    socket.emit('enter room', info);
}, false);

socket.on('room full', /** @param id 部屋番号 */ (id: string) => {
    const p: HTMLElement = document.getElementById('message');
    p.innerText = `ルーム ${id} はいっぱいです。対戦者として参加することはできません。`;
});

socket.on('no room', /** @param id 部屋番号 */ (id: string)=> {
    const p: HTMLElement = document.getElementById('message');
    p.innerText = `ルーム ${id} では対戦が行われていません。`;
});

socket.on('wait opponent', () => {
    if (!doneInitCanvas) {initCanvas()};
    draw.waitingPlayer();
});

// 駒配置
/** 位置と色の Map */
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
    /** 赤と青が同数ずつあるか */
    let satisfied: boolean = false;

    /**
     * 赤と青が同数ずつあるかチェックする
     * @param colors 色のリスト
     */
    const checkColor = (colors: ('R' | 'B')[]): boolean => {
        return (colors.filter((color: 'R' | 'B') => color === 'R')).length
            === (colors.filter((color: 'R' | 'B') => color === 'B')).length;
    }

    /** 画面を描画する */
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
                canvas.onclick = () => {};
                socket.emit('decided place', [...posmap.entries()]);
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

socket.on('game', 
        /**
         * 対戦者側のゲーム処理
         * @param board 盤面データ
         * @param turn 自分が先手か後手か
         * @param myturn 現在自分のターンか
         * @param first 先手のプレイヤー名
         * @param second 後手のプレイヤー名
         */
        (board: [string, {color: 'R' | 'B', turn: 0 | 1}][],
        turn: 0 | 1, myturn: boolean,
        first: string, second: string) => {
    const boardmap: Map<string, {color: 'R' | 'B', turn: 0 | 1}> = new Map(board);
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    /** 選択中の駒の位置 */
    let selectingPos: [number, number];
    draw.board(boardmap, turn, first, second);
    // マウスイベント
    if (myturn) {
        mouse = new Mouse(canvas);
        canvas.onclick = (e: MouseEvent) => {
            const sqPos = mouse.getCoord(e);
            if (boardmap.has(String(sqPos))
                    && boardmap.get(String(sqPos)).turn === turn) {
                // 自分の駒を選択したとき
                selectingPos = sqPos;
                const pieceData = Object.values(
                    boardmap.get(String(sqPos))) as ['R' | 'B', 0 | 1];
                const piece = new Piece(...pieceData);
                // 行先を描画
                draw.board(boardmap, turn, first, second);
                draw.dest(piece, selectingPos, boardmap);
            } else {
                if (boardmap.has(String(selectingPos))) {
                    const pieceData = Object.values(
                        boardmap.get(String(selectingPos))) as ['R' | 'B', 0 | 1];
                    const piece = new Piece(...pieceData);
                    if (piece.coveringSquares(selectingPos).some(e =>
                            String(e) === String(sqPos))) {
                        // 行先を選択したとき
                        // 駒の移動
                        boardmap.set(String(sqPos), boardmap.get(String(selectingPos)));
                        boardmap.delete(String(selectingPos));
                        // サーバへ移動データを渡す
                        socket.emit('move piece', turn, selectingPos, sqPos);
                    }
                }
                // 盤面描画更新
                draw.board(boardmap, turn, first, second);
                selectingPos = null;
            }
        }
    } else {
        canvas.onclick = () => {};
    }
});

socket.on('watch',
        /**
         * 観戦者側のゲーム処理
         * @param board 盤面データ
         * @param first 先手のプレイヤー名
         * @param second 後手のプレイヤー名
         */
        (board: [string, {color: 'R' | 'B', turn: 0 | 1}][],
        first: string, second: string) => {
    if (myrole === 'watch') {
        if (!doneInitCanvas) {initCanvas()};
        const boardmap: Map<string, {color: 'R' | 'B', turn: 0 | 1}> = new Map(board);
        draw.board(boardmap, 2, first, second);
    }
})

socket.on('player discon', (name: string) => {
    alert(`${name}さんの接続が切れました。`);
    location.reload();
});