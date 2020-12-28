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

let rooms: {[key: number]: {[key: string]: string}} = {};

io.on('connection', (socket: customSocket) => {
    socket.on('enterRoom', (info: {
        roomId: string, role: string, name: string
    }) => {
        socket.info = info;
        const roomId: number = Number(info.roomId);
        if (info.role === 'play') {
            // 対戦者として参加
            if (rooms[roomId]) {
                // 指定のルームに対戦者がいたとき
                if (Object.keys(rooms[roomId]).length === 1) {
                    // 対戦者が1人待機している
                    rooms[roomId].player2 = info.name;
                    socket.join(info.roomId);
                    io.to(info.roomId).emit('startGame', rooms[roomId]);
                } else {
                    // 対戦者がすでに2人いる
                    socket.emit('roomFull', info.roomId);
                }
            } else {
                // 新たにルームを作成する
                rooms[roomId] = {
                    player1: info.name
                }
                socket.join(info.roomId);
                socket.emit('wait');
            }
            // デバッグ
            console.log(rooms);
        } else {
            // 観戦者として参加
            if (rooms[roomId]) {
                // 指定のルームが存在するとき
                socket.join(info.roomId);
                if (Object.keys(rooms[roomId]).length === 1) {
                    // 対戦者が1人待機している
                    socket.emit('wait');
                } else {
                    // 対戦者がすでに2人いる
                    socket.emit('watch');
                }
            } else {
                // 指定したルームがないとき
                socket.emit('noRoom', info.roomId);
            }
        }
    });

    socket.on('disconnect', () => {
        const info = socket.info;
        // 接続が切れたとき
        if (info) {
            // ルームに入っていたとき
            if (info.role === 'play') {
                // 対戦者としてルームにいたとき
                delete rooms[Number(info.roomId)];
                // 観戦者ともう一方の対戦者も退出させる
                socket.to(info.roomId).leave(info.roomId);
                socket.to(info.roomId).emit('player_discon', info.name);
            }
        }
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`listening on ${port}`);
});