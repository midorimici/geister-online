import { t } from './i18n/translation';
import { handleChatSend, handleEnterRoom } from './lib/actions';
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
    muteButton.title = t(isMuted ? 'mute' : 'unmute');
    setIsMuted(!isMuted);
  };
};

export const addChatFormEventListener = () => {
  const chatForm = document.getElementById('chat-form') as HTMLFormElement;
  const chatSendButton = document.getElementById('chat-send-icon');
  chatForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    sendMessage();
  });

  chatSendButton.onclick = () => {
    sendMessage();
  };
};

const sendMessage = () => {
  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  const message = chatInput.value;
  if (message) {
    handleChatSend(message);
    chatInput.value = '';
  }
};

export const addLanguageButtonClickEventListener = () => {
  const jaBtn = document.getElementById('ja-btn');
  const enBtn = document.getElementById('en-btn');
  jaBtn.onclick = () => overrideLanguageAndReload('ja');
  enBtn.onclick = () => overrideLanguageAndReload('en');
};

const overrideLanguageAndReload = (language: 'ja' | 'en') => {
  document.cookie = `firebase-language-override=${language}`;
  location.reload();
};
