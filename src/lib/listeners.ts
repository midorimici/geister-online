import {
  child,
  DatabaseReference,
  DataSnapshot,
  get,
  off,
  onDisconnect,
  onValue,
  ref,
} from 'firebase/database';
import { db } from '~/firebase';
import { t } from '~/i18n/translation';
import {
  handleGameScreen,
  handlePlacePiecesScreen,
  handleResultScreen,
  showGameScreenForAudience,
  showWaitingPlacingScreen,
  showWaitingPlayerScreen,
} from './canvasHandlers';
import { usePlayerId, usePlayerNames, useRoomId } from './states';

export const getRoomRef = () => {
  const { roomId } = useRoomId();
  return ref(db, `rooms/${roomId}`);
};

/**
 * Handles process when the room data is changed, such as a new player joins, leaves and so on.
 * @param phase If this arg is `preparing`, it listens to the `state` field of the data. If this arg is `playing`, it listens to the `boards` and check for the winner.
 * @param isPlayer Whether the user is joining as a player.
 */
export const listenRoomDataChange = (phase: 'preparing' | 'playing', isPlayer: boolean) => {
  const roomRef = getRoomRef();

  if (phase === 'preparing') {
    handleRoomValueChange(
      roomRef,
      'state',
      (val) => {
        const state: RoomState = val;
        handleRoomStateChange(state, isPlayer);
      },
      true
    );
  } else if (phase === 'playing') {
    handleRoomValueChange(roomRef, 'boards', (val) => {
      const boards: Boards = val;
      onValue(
        roomRef,
        (snapshot: DataSnapshot) => {
          const info: RoomInfo = snapshot.val();
          handleRoomBoardsChange(boards, isPlayer, info.curTurn, info.takenPieces);
          const winner: PlayerId = info.winner;
          if (winner !== undefined) {
            handleRoomWinnerChange(winner, info.boards, info.takenPieces);
          }
        },
        { onlyOnce: true }
      );
    });
  }
};

/**
 * Listens for data changes at the specified path and trigger a callback.
 * @param ref Database reference to the room.
 * @param path Path to the data from the reference.
 * @param callback A callback that fires when the data in the specified path exists. Receives snapshot value as a parameter.
 * @param reloadWhenEmpty Whether the page should be reloaded when the snapshot does not exist.
 */
const handleRoomValueChange = (
  ref: DatabaseReference,
  path: keyof RoomInfo,
  callback: (val: any) => void,
  reloadWhenEmpty: boolean = false
) => {
  off(ref);
  onValue(child(ref, path), (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else if (reloadWhenEmpty) {
      // Reload the page when one of the player is disconnected.
      alert(t('disconnected'));
      location.reload();
    }
  });
};

/**
 * Handles process when the room state is changed.
 * @param state The current state of the room.
 * @param isPlayer Whether the user is joining as a player.
 */
const handleRoomStateChange = (state: RoomState, isPlayer: boolean) => {
  // When a player is waiting for the opponent
  if (state === 'waiting opponent') {
    // Move to wait opponent screen
    showWaitingPlayerScreen();
  }
  // When players is deciding places of pieces
  else if (state === 'placing pieces') {
    const { setPlayerNames } = usePlayerNames();
    get(child(getRoomRef(), 'players')).then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const names: [string, string] = snapshot.val();
        setPlayerNames(names);
      }
    });
    if (isPlayer) {
      handlePlacePiecesScreen();
    } else {
      // Move to wait placing screen
      showWaitingPlacingScreen();
    }
  }
  // When two players are in the room and the game is ongoing
  else if (!isPlayer) {
    get(getRoomRef()).then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const { setPlayerNames } = usePlayerNames();
        const info: RoomInfo = snapshot.val();
        setPlayerNames(info.players);
        listenRoomDataChange('playing', false);
      }
    });
  }
};

/**
 * Handles process when the game boards are changed.
 * @param boards The game boards.
 * @param isPlayer Whether the user is joining as a player.
 * @param curTurn The current turn.
 * @param takenPieces Piece colors and numbers that each player has taken.
 */
const handleRoomBoardsChange = (
  boards: Boards,
  isPlayer: boolean,
  curTurn: PlayerId,
  takenPieces: TakenPieces
) => {
  const { playerId } = usePlayerId();
  const { playerNames } = usePlayerNames();
  if (isPlayer) {
    handleGameScreen(boards[playerId], playerId, curTurn === playerId, playerNames, takenPieces);
  } else {
    showGameScreenForAudience(boards[0], curTurn, playerNames, takenPieces);
  }
};

/**
 * Handles process when the winner is changed.
 * @param winnerId The player id of the winner.
 * @param boards The game boards.
 * @param takenPieces Piece colors and numbers that each player has taken.
 */
const handleRoomWinnerChange = (winnerId: PlayerId, boards: Boards, takenPieces: TakenPieces) => {
  const { playerId } = usePlayerId();
  const { playerNames } = usePlayerNames();
  handleResultScreen(playerNames[winnerId], playerId, boards[playerId], playerNames, takenPieces);
  off(getRoomRef());
};

/** Removes data of the room when disconnected. */
export const listenDisconnection = () => {
  onDisconnect(getRoomRef()).remove();
};
