import {
  child,
  DatabaseReference,
  DataSnapshot,
  get,
  off,
  onDisconnect,
  onValue,
  ref,
  set,
} from 'firebase/database';
import { db } from './firebase';
import { isEN } from './config';
import { initBoard, winReq } from './utils';
import { showRoomEmptyMessage, showRoomFullMessage } from './messageHandlers';
import {
  handleGameScreen,
  handlePlacePiecesScreen,
  showGameScreenForAudience,
  showWaitingPlacingScreen,
  showWaitingPlayerScreen,
} from './canvasHandlers';
import { usePlayerId, usePlayerNames, useRoomId } from './states';

const getRoomRef = () => {
  const { roomId } = useRoomId();
  return ref(db, `rooms/${roomId}`);
};

/**
 * Handles process when the user enters a room.
 * @param role Whether the user joins as a player or an audience.
 * @param uname The name of the user.
 */
export const handleEnterRoom = (role: Role, uname: string) => {
  const name = uname === '' ? (isEN ? 'anonymous' : '名無し') : uname;
  const isJoiningAsPlayer = role === 'play';
  const { setPlayerId } = usePlayerId();

  const roomRef = getRoomRef();
  get(child(roomRef, 'state'))
    .then((snapshot: DataSnapshot) => {
      // When the room with the id already exists
      if (snapshot.exists()) {
        const state: RoomState = snapshot.val();
        const isWaitingOpponent = state === 'waiting opponent';
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
            listenRoomDataChange('state', isJoiningAsPlayer);
          }
          // When two players are already in the room
          else {
            showRoomFullMessage();
          }
        }
        // Join as an audience
        else {
          listenRoomDataChange('state', isJoiningAsPlayer);
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
          listenRoomDataChange('state', isJoiningAsPlayer);
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
 * Handles process when the user clicked decide button of decide piece places screen.
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
        // When both players are ready.
        if (initPositions.filter(Boolean).length === 2) {
          // Set the initial game board.
          const boards: Boards = [initBoard(initPositions, 0), initBoard(initPositions, 1)];
          return set(child(roomRef, 'boards'), boards).then(() => {
            const newState: RoomState = 'playing game';
            set(child(roomRef, 'state'), newState);
          });
        }
        // When one player has finished placing pieces.
        else {
          showWaitingPlacingScreen();
        }
      }
    })
    .then(() => listenRoomDataChange('boards', true))
    .catch((err) => console.error(err));
};

/**
 * Handles process when a user moves a piece.
 * @param turn Whether the user moving the piece played firstly or secondly.
 * @param origin Original position of the piece.
 * @param dest Destination position of the piece.
 */
export const handlePieceMove = (
  turn: PlayerId,
  origin: [number, number],
  dest: [number, number]
) => {
  const roomRef = getRoomRef();
  onValue(
    roomRef,
    (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const info: RoomInfo = snapshot.val();
      const myBoard: Board = info.boards[turn];
      const anotherBoard: Board = info.boards[1 - turn];
      let takenPieces: TakenPieces = info.takenPieces;
      // When the user has taken the opponent's piece.
      if (Object.keys(myBoard).includes(String(dest)) && myBoard[String(dest)].turn !== turn) {
        // Record taken piece.
        takenPieces[turn][myBoard[String(dest)].color]++;
        set(child(roomRef, 'takenPieces'), takenPieces).catch((err) => console.error(err));
      }

      // Update game board seen from the current user.
      myBoard[String(dest)] = myBoard[String(origin)];
      delete myBoard[String(origin)];
      // Transform coordinates.
      origin = origin.map((x: number) => 5 - x) as [number, number];
      dest = dest.map((x: number) => 5 - x) as [number, number];
      // Update game board seen from the opponent.
      anotherBoard[String(dest)] = anotherBoard[String(origin)];
      delete anotherBoard[String(origin)];
      // Set new boards
      const newBoards: Boards = [null, null];
      newBoards[turn] = myBoard;
      newBoards[1 - turn] = anotherBoard;
      set(child(roomRef, 'boards'), newBoards).catch((err) => console.error(err));

      // Switch the turn.
      set(child(roomRef, 'curTurn'), 1 - info.curTurn).catch((err) => console.error(err));

      // Judge the winner.
      let winner: PlayerId | null = null;
      if (winReq(takenPieces, Object.keys(myBoard), turn, true)) {
        winner = turn;
      } else if (winReq(takenPieces, Object.keys(myBoard), (1 - turn) as PlayerId, false)) {
        winner = (1 - turn) as PlayerId;
      }
      if (winner !== null) {
        set(child(roomRef, 'winner'), winner).catch((err) => console.error(err));
      }
    },
    { onlyOnce: true }
  );
};

/**
 * Handles process when the room data is changed, such as a new player joins, leaves and so on.
 * @param target The field of data to listen.
 * @param isPlayer Whether the user is joining as a player.
 */
const listenRoomDataChange = (target: keyof RoomInfo, isPlayer: boolean) => {
  const { roomId } = useRoomId();
  const roomRef = ref(db, `rooms/${roomId}`);

  if (target === 'state') {
    handleRoomValueChange(
      roomRef,
      'state',
      (val) => {
        const state: RoomState = val;
        handleRoomStateChange(state, isPlayer);
      },
      true
    );
  } else if (target === 'boards') {
    handleRoomValueChange(roomRef, 'boards', (val) => {
      const boards: Boards = val;
      let curTurn: PlayerId;
      let takenPieces: TakenPieces;
      onValue(
        roomRef,
        (snapshot: DataSnapshot) => {
          const info: RoomInfo = snapshot.val();
          curTurn = info.curTurn;
          takenPieces = info.takenPieces;
          handleRoomBoardsChange(boards, isPlayer, curTurn, takenPieces);
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
  else if (!isPlayer) {
    get(getRoomRef()).then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const { setPlayerNames } = usePlayerNames();
        const info: RoomInfo = snapshot.val();
        setPlayerNames(info.players);
        showGameScreenForAudience(info.boards[0], info.curTurn, info.players, info.takenPieces);
        listenRoomDataChange('boards', false);
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

/** Removes data of the room when disconnected. */
const listenDisconnection = () => {
  const { roomId } = useRoomId();
  onDisconnect(ref(db, `rooms/${roomId}`)).remove();
};
