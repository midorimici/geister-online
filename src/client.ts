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
