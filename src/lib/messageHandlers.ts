import { t } from '~/i18n/translation';
import { useRoomId } from './states';

const p: HTMLElement = document.getElementById('message');

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
