import {
  addChatFormEventListener,
  addFormEventListener,
  addInfoButtonClickEventListener,
  addMuteButtonClickEventListener,
} from './events';

// 入室～対戦相手待機

// フォーム取得
// production: https://geister-online.herokuapp.com
// const socket: SocketIOClient.Socket = io('https://geister-online.herokuapp.com');

addInfoButtonClickEventListener();
addFormEventListener();
addMuteButtonClickEventListener();
addChatFormEventListener();

// 駒配置

// // ゲーム進行

// // 勝者が決まったとき（観戦者と先手）
// socket.on(
//   'tell winner to audience and first',
//   /** 勝者が決まったときの処理
//    * @param winner 勝者のプレイヤー名
//    * @param board 盤面データ
//    * @param first 先手のプレイヤー名
//    * @param second 後手のプレイヤー名
//    * @param takenPieces それぞれが取った駒の色と数
//    */
//   (
//     winner: string,
//     board: [string, { color: 'R' | 'B'; turn: 0 | 1 }][],
//     first: string,
//     second: string,
//     takenPieces: [{ R: number; B: number }, { R: number; B: number }]
//   ) => {
//     gameMessage.innerText = isEN ? `${winner} won!` : `${winner} の勝ち！`;
//     if (!muted) snd('win');
//     if (myrole === 'play') {
//       canvas.onclick = () => {
//         draw.board(new Map(board), 0, first, second, true);
//         draw.takenPieces(takenPieces, 0);
//         canvas.onclick = () => {};
//       };
//     }
//   }
// );

// // 勝者が決まったとき（後手）
// socket.on(
//   'tell winner to second',
//   /** 勝者が決まったときの処理
//    * @param winner 勝者のプレイヤー名
//    * @param board 盤面データ
//    * @param first 先手のプレイヤー名
//    * @param second 後手のプレイヤー名
//    * @param takenPieces それぞれが取った駒の色と数
//    */
//   (
//     winner: string,
//     board: [string, { color: 'R' | 'B'; turn: 0 | 1 }][],
//     first: string,
//     second: string,
//     takenPieces: [{ R: number; B: number }, { R: number; B: number }]
//   ) => {
//     gameMessage.innerText = isEN ? `${winner} won!` : `${winner} の勝ち！`;
//     if (!muted) snd('win');
//     canvas.onclick = () => {
//       draw.board(new Map(board), 1, first, second, true);
//       draw.takenPieces(takenPieces, 1);
//       canvas.onclick = () => {};
//     };
//   }
// );

// const ul = document.getElementById('chat-messages');
// socket.on(
//   'chat message',
//   /**
//    * チャット受信の処理
//    * @param msg 入力されたメッセージ
//    * @param isPlayer 入力した人が対戦者か
//    * @param name 入力した人の名前
//    */
//   (msg: string, isPlayer: boolean, name: string) => {
//     const item = document.createElement('li');

//     const nameSpan = document.createElement('span');
//     nameSpan.className = 'chat-name';
//     nameSpan.innerText = name;

//     if (isPlayer) {
//       const icon = document.createElement('img');
//       icon.className = 'chat-player-icon';
//       icon.src = '../static/svg/ghost-solid.svg';
//       icon.alt = 'player-icon';
//       icon.title = isEN ? 'Player' : '対戦者';
//       nameSpan.appendChild(icon);
//     }

//     item.appendChild(nameSpan);

//     const msgSpan = document.createElement('span');
//     msgSpan.innerText = msg;
//     item.appendChild(msgSpan);

//     ul.appendChild(item);
//     ul.scrollTop = ul.scrollHeight;
//   }
// );
