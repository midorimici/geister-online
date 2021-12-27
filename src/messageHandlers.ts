import { isEN } from './config';
import { useRoomId } from './states';

const p: HTMLElement = document.getElementById('message');

/** Show message that tells the user the room is full and does not receive new players. */
export const showRoomFullMessage = () => {
  const { roomId } = useRoomId();
  p.innerText = isEN
    ? `The room ${roomId} is full. You cannot join in as a player.`
    : `ルーム ${roomId} はいっぱいです。対戦者として参加することはできません。`;
};

/** Show message that tells the user the room is empty. */
export const showRoomEmptyMessage = () => {
  const { roomId } = useRoomId();
  p.innerText = isEN
    ? `No player is present in the room ${roomId}.`
    : `ルーム ${roomId} では対戦が行われていません。`;
};
