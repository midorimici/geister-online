import {
  child,
  DatabaseReference,
  DataSnapshot,
  get,
  onDisconnect,
  onValue,
  ref,
  set,
} from 'firebase/database';
import { db } from './firebase';
import { isEN } from './config';
import { initBoard } from './utils';
import { showRoomEmptyMessage, showRoomFullMessage } from './messageHandlers';
import {
  handleGameScreen,
  handlePlacePiecesScreen,
  showWaitingPlacingScreen,
  showWaitingPlayerScreen,
} from './canvasHandlers';
import { usePlayerId, usePlayerNames, useRoomId } from './states';

const getRoomRef = () => {
  const { roomId } = useRoomId();
  return ref(db, `rooms/${roomId}`);
};

/**
 * Handle process when the user enters a room.
 * @param role Whether the user joins as a player or an audience.
 * @param uname The name of the user.
 */
export const handleEnterRoom = (role: Role, uname: string) => {
  const name = uname === '' ? (isEN ? 'anonymous' : '名無し') : uname;
  const isJoiningAsPlayer = role === 'play';
  const { setPlayerId } = usePlayerId();

  const roomRef = getRoomRef();
  get(roomRef)
    .then((snapshot: DataSnapshot) => {
      // When the room with the id already exists
      if (snapshot.exists()) {
        const room: RoomInfo = snapshot.val();
        const isWaitingOpponent = room.state === 'waiting opponent';
        // Join as a player
        if (isJoiningAsPlayer) {
          // When a player is waiting
          if (isWaitingOpponent) {
            // Add new player's data
            set(child(roomRef, 'players/1'), name).catch((err) => console.error(err));
            setPlayerId(1);
            // Update state of the room
            const newState: RoomState = 'placing pieces';
            set(child(roomRef, 'state'), newState).catch((err) => console.error(err));
            // Setup disconnection event listener
            listenDisconnection();
            // Setup room state change event listener
            listenRoomDataChange(isJoiningAsPlayer);
          }
          // When two players are already in the room
          else {
            showRoomFullMessage();
          }
        }
        // Join as an audience
        else {
          listenRoomDataChange(isJoiningAsPlayer);
        }
      }
      // When the room does not exist
      else {
        // Join as a player
        if (isJoiningAsPlayer) {
          // Create a new room
          const roomInfo: Partial<RoomInfo> = {
            players: [name, ''],
            state: 'waiting opponent',
            curTurn: 0,
            takenPieces: [
              { R: 0, B: 0 },
              { R: 0, B: 0 },
            ],
          };
          set(roomRef, roomInfo).catch((err) => console.error(err));
          setPlayerId(0);
          // Setup disconnection event listener
          listenDisconnection();
          // Setup room state change event listener
          listenRoomDataChange(isJoiningAsPlayer);
        }
        // Join as an audience
        else {
          showRoomEmptyMessage();
        }
      }
    })
    .catch((err) => console.error(err));
};

/**
 * Handle process when the user clicked decide button of decide piece places screen.
 * @param posmap Map object to represent initial position of pieces and their colors.
 */
export const handlePiecePositionDecision = (posmap: InitialPositionMap) => {
  const { playerId } = usePlayerId();
  const roomRef = getRoomRef();
  set(child(roomRef, `initialPositions/${playerId}`), posmap)
    .then(() => get(child(roomRef, 'initialPositions')))
    .then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const initPositions: InitialPositions = snapshot.val();
        if (initPositions.filter(Boolean).length === 2) {
          // If both players are ready, set the initial game board.
          const boards: Boards = [initBoard(initPositions, 0), initBoard(initPositions, 1)];
          return set(child(roomRef, 'boards'), boards).then(() => {
            const newState: RoomState = 'playing game';
            set(child(roomRef, 'state'), newState);
          });
        }
      }
    })
    .catch((err) => console.error(err));
};

/**
 * Handles process when the room data is changed, such as a new player joins, leaves and so on.
 * @param isPlayer Whether the user is joining as a player.
 */
const listenRoomDataChange = (isPlayer: boolean) => {
  const { roomId } = useRoomId();
  const roomRef = ref(db, `rooms/${roomId}`);

  handleRoomValueChange(
    roomRef,
    'state',
    (val) => {
      const state: RoomState = val;
      handleRoomStateChange(state, isPlayer);
    },
    true
  );

  handleRoomValueChange(roomRef, 'initialPositions', (val) => {
    const initPositions: InitialPositions = val;
    handleRoomInitPositionsChange(initPositions);
  });

  handleRoomValueChange(roomRef, 'boards', (val) => {
    const boards: Boards = val;
    let curTurn: PlayerId;
    let takenPieces: TakenPieces;
    get(roomRef)
      .then((snapshot: DataSnapshot) => {
        const info: RoomInfo = snapshot.val();
        curTurn = info.curTurn;
        takenPieces = info.takenPieces;
      })
      .then(() => handleRoomBoardsChange(boards, isPlayer, curTurn, takenPieces));
  });
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
  onValue(child(ref, path), (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else if (reloadWhenEmpty) {
      // Reload the page when one of the player is disconnected.
      alert(isEN ? `One player's connection is closed.` : '対戦者の接続が切れました。');
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
  else {
    // TODO: Move to game screen
  }
};

/**
 * Handles process when the initial positions are changed.
 * @param initPositions Initial piece positions of the players.
 */
const handleRoomInitPositionsChange = (initPositions: InitialPositions) => {
  const { playerId } = usePlayerId();
  const readyPlayerCount = initPositions.filter(Boolean).length;
  const isReady = playerId !== null && Boolean(initPositions[playerId]);
  // When one player has finished placing pieces.
  if (readyPlayerCount < 2 && isReady) {
    showWaitingPlacingScreen();
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
  }
};

/** Removes data of the room when disconnected. */
const listenDisconnection = () => {
  const { roomId } = useRoomId();
  onDisconnect(ref(db, `rooms/${roomId}`)).remove();
};
