import { child, DataSnapshot, get, onValue, set } from 'firebase/database';
import { t } from '~/i18n/translation';
import { initBoard, winReq } from './utils';
import { showRoomEmptyMessage, showRoomFullMessage } from './messageHandlers';
import { showWaitingPlacingScreen } from './canvasHandlers';
import { usePlayerId } from './states';
import { getRoomRef, listenDisconnection, listenRoomDataChange } from './listeners';

/**
 * Handles process when the user enters a room.
 * @param role Whether the user joins as a player or an audience.
 * @param uname The name of the user.
 */
export const handleEnterRoom = (role: Role, uname: string) => {
  const name = uname === '' ? t('anonymous') : uname;
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
            listenRoomDataChange('preparing', isJoiningAsPlayer);
          }
          // When two players are already in the room
          else {
            showRoomFullMessage();
          }
        }
        // Join as an audience
        else {
          listenRoomDataChange('preparing', isJoiningAsPlayer);
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
          listenRoomDataChange('preparing', isJoiningAsPlayer);
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
    .then(() => listenRoomDataChange('playing', true))
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
    async (snapshot: DataSnapshot) => {
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
        await set(child(roomRef, 'takenPieces'), takenPieces).catch((err) => console.error(err));
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

      // Switch the turn.
      await set(child(roomRef, 'curTurn'), 1 - info.curTurn).catch((err) => console.error(err));

      // Judge the winner.
      let winner: PlayerId | null = null;
      if (winReq(takenPieces, Object.keys(myBoard), turn, true)) {
        winner = turn;
      } else if (winReq(takenPieces, Object.keys(myBoard), (1 - turn) as PlayerId, false)) {
        winner = (1 - turn) as PlayerId;
      }

      // Set the winner.
      if (winner !== null) {
        await set(child(roomRef, 'winner'), winner).catch((err) => console.error(err));
      }

      // Set new boards.
      const newBoards: Boards = [null, null];
      newBoards[turn] = myBoard;
      newBoards[1 - turn] = anotherBoard;
      set(child(roomRef, 'boards'), newBoards).catch((err) => console.error(err));
    },
    { onlyOnce: true }
  );
};
