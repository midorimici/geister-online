import { isEN } from './config';
import { handleEnterRoom } from './lib/actions';
import { useIsMuted, useRoomId, useUserRole } from './lib/states';

export const addInfoButtonClickEventListener = () => {
  const infoBtn = document.getElementById('info-icon');
  infoBtn.onclick = () => {
    document.getElementById('info-overlay').style.display = 'flex';
  };

  const infoCloseBtn = document.getElementById('close-icon');
  infoCloseBtn.onclick = () => {
    document.getElementById('info-overlay').style.display = 'none';
  };
};

export const addFormEventListener = () => {
  const { setRoomId } = useRoomId();
  const { setUserRole } = useUserRole();
  const form = document.getElementById('form') as HTMLFormElement;
  form.addEventListener(
    'submit',
    (e: Event) => {
      e.preventDefault();
      const data = new FormData(form);
      const role = data.get('role') as Role;
      setRoomId(data.get('room') as string);
      setUserRole(role);
      handleEnterRoom(role, data.get('username') as string);
    },
    false
  );
};

export const addMuteButtonClickEventListener = () => {
  const muteButton = document.getElementById('mute-icon') as HTMLImageElement;
  muteButton.onclick = () => {
    const { isMuted, setIsMuted } = useIsMuted();
    muteButton.src = isMuted
      ? '../static/svg/volume-up-solid.svg'
      : '../static/svg/volume-mute-solid.svg';
    muteButton.title = isMuted ? (isEN ? 'Mute' : 'ミュート') : isEN ? 'Unmute' : 'ミュート解除';
    setIsMuted(!isMuted);
  };
};

export const addChatFormEventListener = () => {
  const chatForm = document.getElementById('chat-form') as HTMLFormElement;
  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  const chatSendButton = document.getElementById('chat-send-icon');
  chatForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    if (chatInput.value) {
      // socket.emit('chat message', chatInput.value);
      chatInput.value = '';
    }
  });

  chatSendButton.onclick = () => {
    if (chatInput.value) {
      // socket.emit('chat message', chatInput.value);
      chatInput.value = '';
    }
  };
};
