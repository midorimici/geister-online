/** Whether it is muted. */
let isMuted: boolean = true;

const setIsMuted = (newIsMuted: boolean) => {
  isMuted = newIsMuted;
};

export const useIsMuted = () => {
  return { isMuted, setIsMuted };
};

/** Room id. */
let roomId: string = null;

const setRoomId = (newRoomId: string) => {
  roomId = newRoomId;
};

export const useRoomId = () => {
  return { roomId, setRoomId };
};

/** Whether the user is player or audience. */
let userRole: Role;

const setUserRole = (newUserRole: Role) => {
  userRole = newUserRole;
};

export const useUserRole = () => {
  return { userRole, setUserRole };
};

/** Id of the current user. If the user is not a player, it should be null. */
let playerId: 0 | 1 | null = null;

const setPlayerId = (newPlayerId: 0 | 1 | null) => {
  playerId = newPlayerId;
};

export const usePlayerId = () => {
  return { playerId, setPlayerId };
};
