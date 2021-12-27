import {
  addChatFormEventListener,
  addFormEventListener,
  addInfoButtonClickEventListener,
  addMuteButtonClickEventListener,
} from './events';
import Piece from './piece';

// 入室～対戦相手待機

/** canvas 横のメッセージ */
const gameMessage = document.getElementById('game-message');

// フォーム取得
// production: https://geister-online.herokuapp.com
// const socket: SocketIOClient.Socket = io('https://geister-online.herokuapp.com');

addInfoButtonClickEventListener();
addFormEventListener();
addMuteButtonClickEventListener();
addChatFormEventListener();

// 駒配置

// // ゲーム進行

// // 対戦者の処理
// socket.on(
//   'game',
//   /**
//    * 対戦者側のゲーム処理
//    * @param board 盤面データ
//    * @param turn 自分が先手か後手か
//    * @param myturn 現在自分のターンか
//    * @param first 先手のプレイヤー名
//    * @param second 後手のプレイヤー名
//    * @param takenPieces それぞれが取った駒の色と数
//    */
//   (
//     board: [string, { color: 'R' | 'B'; turn: 0 | 1 }][],
//     turn: 0 | 1,
//     myturn: boolean,
//     first: string,
//     second: string,
//     takenPieces: [{ R: number; B: number }, { R: number; B: number }]
//   ) => {
//     const boardmap: Map<string, { color: 'R' | 'B'; turn: 0 | 1 }> = new Map(board);
//     /** 選択中の駒の位置 */
//     let selectingPos: [number, number];
//     draw.board(boardmap, turn, first, second);
//     draw.takenPieces(takenPieces, turn);
//     // 手番の表示
//     // マウスイベント
//     if (myturn) {
//       gameMessage.innerText = isEN ? "It's your turn." : 'あなたの番です。';
//       if (!muted) snd('move');

//       mouse = new Mouse(canvas);
//       canvas.onclick = (e: MouseEvent) => {
//         const sqPos = mouse.getCoord(e);
//         if (boardmap.has(String(sqPos)) && boardmap.get(String(sqPos)).turn === turn) {
//           // 自分の駒を選択したとき
//           selectingPos = sqPos;
//           const pieceData = Object.values(boardmap.get(String(sqPos))) as ['R' | 'B', 0 | 1];
//           const piece = new Piece(...pieceData);
//           // 行先を描画
//           draw.board(boardmap, turn, first, second);
//           draw.dest(piece, selectingPos, boardmap);
//           draw.takenPieces(takenPieces, turn);
//         } else {
//           if (boardmap.has(String(selectingPos))) {
//             const pieceData = Object.values(boardmap.get(String(selectingPos))) as [
//               'R' | 'B',
//               0 | 1
//             ];
//             const piece = new Piece(...pieceData);
//             if (piece.coveringSquares(selectingPos).some((e) => String(e) === String(sqPos))) {
//               // 行先を選択したとき
//               // 駒の移動
//               boardmap.set(String(sqPos), boardmap.get(String(selectingPos)));
//               boardmap.delete(String(selectingPos));
//               if (!muted) snd('move');
//               // サーバへ移動データを渡す
//               socket.emit('move piece', turn, selectingPos, sqPos);
//             }
//           }
//           // 盤面描画更新
//           draw.board(boardmap, turn, first, second);
//           draw.takenPieces(takenPieces, turn);
//           selectingPos = null;
//         }
//       };
//     } else {
//       gameMessage.innerText = isEN ? "It's your opponent's turn." : '相手の番です。';

//       canvas.onclick = () => {};
//     }
//   }
// );

// // 観戦者の処理
// socket.on(
//   'watch',
//   /**
//    * 観戦者側のゲーム処理
//    * @param board 盤面データ
//    * @param first 先手のプレイヤー名
//    * @param second 後手のプレイヤー名
//    * @param turn 現在のターン
//    * @param takenPieces それぞれが取った駒の色と数
//    */
//   (
//     board: [string, { color: 'R' | 'B'; turn: 0 | 1 }][],
//     first: string,
//     second: string,
//     turn: 0 | 1,
//     takenPieces: [{ R: number; B: number }, { R: number; B: number }]
//   ) => {
//     if (myrole === 'watch') {
//       if (!doneInitCanvas) {
//         initCanvas();
//       }
//       const boardmap: Map<string, { color: 'R' | 'B'; turn: 0 | 1 }> = new Map(board);
//       draw.board(boardmap, 0, first, second, true);
//       draw.takenPieces(takenPieces, 0);
//       const curPlayer: string = turn === 0 ? first : second;
//       gameMessage.innerText = isEN ? `It's ${curPlayer}'s turn.` : `${curPlayer} さんの番です。`;
//       if (!muted) snd('move');
//     }
//   }
// );

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
