import { t } from '~/i18n/translation';
import { useRoomId } from './states';

const p: HTMLElement = document.getElementById('message');
const ul = document.getElementById('chat-messages');

/** Show message that tells the user the room is full and does not receive new players. */
export const showRoomFullMessage = () => {
  const { roomId } = useRoomId();
  p.innerText = t('roomIsFull', roomId);
};

/** Show message that tells the user the room is empty. */
export const showRoomEmptyMessage = () => {
  const { roomId } = useRoomId();
  p.innerText = t('roomIsEmpty', roomId);
};

/**
 * Add a new message to the chat list.
 * @param chatMessage A chat message data that will be added to the chat list.
 */
export const addChatMessage = (chatMessage: ChatMessage) => {
  const item = document.createElement('li');

  const nameSpan = document.createElement('span');
  nameSpan.className = 'chat-name';
  nameSpan.innerText = chatMessage.name;

  if (chatMessage.isPlayer) {
    const icon = document.createElement('img');
    icon.className = 'chat-player-icon';
    icon.src = '../static/svg/ghost-solid.svg';
    icon.alt = 'player-icon';
    icon.title = t('player');
    nameSpan.appendChild(icon);
  }

  item.appendChild(nameSpan);

  const msgSpan = document.createElement('span');
  msgSpan.innerText = chatMessage.message;
  item.appendChild(msgSpan);

  ul.appendChild(item);
  ul.scrollTop = ul.scrollHeight;
};
