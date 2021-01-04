
import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';

const app: express.Express = express();
app.use(express.static(process.cwd() + '/public'))
const server: http.Server = http.createServer(app);
const io: socketio.Server = require('socket.io')(server);

interface customSocket extends socketio.Socket {
    info: {
        roomId: string, role: string, name: string
    }
}

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/public/index.html');
});

let rooms: Map<string, {
    player1: {id: string, name: string, turn: 0 | 1},
    player2: {id: string, name: string, turn: 0 | 1},
    state: string,
    ready: number
}> = new Map();
let order1: Map<string, 'R' | 'B'>;     // 先手の初期配置
let order2: Map<string, 'R' | 'B'>;     // 後手の初期配置
let board1: [string, {color: 'R' | 'B', turn: 0 | 1}][];      // 先手から見た盤面
let board2: [string, {color: 'R' | 'B', turn: 0 | 1}][];      // 後手から見た盤面

const initBoard = (
        order1: Map<string, 'R' | 'B'>, order2: Map<string, 'R' | 'B'>,
        turn: 0 | 1
        ): [string, {color: 'R' | 'B', turn: 0 | 1}][] => {
    let m: Map<string, {color: 'R' | 'B', turn: 0 | 1}> = new Map();
    for (let [k, v] of order1) {
        const [x, y] = k.split(',').map((e: string) => +e);
        if (turn === 0) {
            m.set(`${x},${y+2}`, {color: v, turn: 0});
        } else {
            m.set(`${5-x},${3-y}`, {color: v, turn: 0});
        }
    }
    for (let [k, v] of order2) {
        const [x, y] = k.split(',').map((e: string) => +e);
        if (turn === 0) {
            m.set(`${5-x},${3-y}`, {color: v, turn: 1});
        } else {
            m.set(`${x},${y+2}`, {color: v, turn: 1});
        }
    }
    return [...m];
}

io.on('connection', (socket: customSocket) => {
    socket.on('enter room', (info: {
        roomId: string, role: string, name: string
    }) => {
        socket.info = info;
        const room = rooms.get(info.roomId);
        if (info.role === 'play') {
            // 対戦者として参加
            if (room) {
                // 指定のルームに対戦者がいたとき
                if (room.state === 'waiting opponent') {
                    // 対戦者が1人待機している
                    room.player2 = {
                        id: socket.id,
                        name: info.name,
                        turn: 0
                    };
                    room.state = 'waiting placing';
                    socket.join(info.roomId);
                    io.to(info.roomId).emit('wait placing');
                    io.to(room.player1.id).emit('place pieces');
                    io.to(room.player2.id).emit('place pieces');
                } else {
                    // 対戦者がすでに2人いる
                    socket.emit('room full', info.roomId);
                }
            } else {
                // 新たにルームを作成する
                rooms.set(info.roomId, {
                    player1: {
                        id: socket.id,
                        name: info.name,
                        turn: 0
                    },
                    player2: {
                        id: '',
                        name: '',
                        turn: 0
                    },
                    state: 'waiting opponent',
                    ready: 0
                });
                socket.join(info.roomId);
                socket.emit('wait opponent');
            }
            // デバッグ
            console.log(rooms);
        } else {
            // 観戦者として参加
            if (room) {
                // 指定のルームが存在するとき
                socket.join(info.roomId);
                if (room.state === 'waiting opponent') {
                    // 対戦者が1人待機している
                    socket.emit('wait opponent');
                } else if (room.state === 'waiting placing') {
                    // 対戦者が駒の配置を決めている
                    socket.emit('wait placing');
                } else {
                    // 対戦者がすでに2人いて対戦中
                    socket.emit('watch', board1);
                }
            } else {
                // 指定したルームがないとき
                socket.emit('no room', info.roomId);
            }
        }
    });

    socket.on('decided place',
            (roomId: string, name: string, poslist: [string, 'R' | 'B'][]) => {
        const posmap = new Map(poslist);
        const room = rooms.get(roomId);
        room.ready = room.ready + 1;
        if (room.ready === 1) {
            // 先手
            order1 = posmap;
            if (room.player1.name === name) {
                io.to(room.player1.id).emit('wait placing');
            } else {
                io.to(room.player2.id).emit('wait placing');
            }
        } else if (room.ready === 2) {
            // 後手
            order2 = posmap;
            if (room.player1.name === name) {
                room.player1.turn = 1;
            } else {
                room.player2.turn = 1;
            }
            room.state = 'playing';
            board1 = initBoard(order1, order2, 0);
            board2 = initBoard(order1, order2, 1);
            io.to(roomId).emit('watch', board1);
            io.to(room.player1.turn === 0 ? room.player1.id : room.player2.id)
                .emit('game', board1, 0, true);
            io.to(room.player1.turn === 1 ? room.player1.id : room.player2.id)
                .emit('game', board2, 1, false);
        }
    })

    socket.on('disconnect', () => {
        const info = socket.info;
        // 接続が切れたとき
        if (info) {
            // ルームに入っていたとき
            if (info.role === 'play') {
                // 対戦者としてルームにいたとき
                rooms.delete(info.roomId);
                // 観戦者ともう一方の対戦者も退出させる
                socket.to(info.roomId).leave(info.roomId);
                socket.to(info.roomId).emit('player discon', info.name);
            }
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`listening on ${port}`);
});