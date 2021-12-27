import Draw from './game/draw';
import Mouse from './game/mouse';
import Piece from './game/piece';
import { handlePieceMove, handlePiecePositionDecision } from './actions';
import { isEN, useIsMuted } from './states';

let draw: Draw;
let mouse: Mouse;
/** Whether `initCanvas` has executed. */
let doneInitCanvas: boolean = false;
/** `canvas` element */
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
/** A message element beside `canvas` */
const gameMessage = document.getElementById('game-message');

/**
 * Play audio.
 * @param file File name without extension.
 */
const snd = (file: string) => {
  const { isMuted } = useIsMuted();
  if (isMuted) {
    return;
  }

  new Audio(`../static/sounds/${file}.wav`).play();
};

/** Hides input forms and shows game container including canvas. */
const initCanvas = () => {
  document.getElementById('settings').style.display = 'none';

  const cw: number = document.documentElement.clientWidth;
  const ch: number = document.documentElement.clientHeight;

  if (cw < ch || ch < 720) {
    document.getElementById('logo').style.display = 'none';
    document.getElementById('info-icon').style.display = 'none';
    document.getElementsByTagName('footer')[0].style.display = 'none';
  }

  const min: number = cw < ch ? cw : ch;
  const cvsize: string = (0.9 * min).toString();
  canvas.setAttribute('width', cvsize);
  canvas.setAttribute('height', cvsize);

  draw = new Draw(canvas, isEN);
  doneInitCanvas = true;
  document.getElementById('game-container').style.display = 'flex';
};

export const showWaitingPlayerScreen = () => {
  if (!doneInitCanvas) {
    initCanvas();
  }
  draw.waitingPlayer();
};

export const showWaitingPlacingScreen = () => {
  if (!doneInitCanvas) {
    initCanvas();
  }
  draw.waitingPlacing();
};

/** Displays place pieces screen on the canvas and handles mouse events. */
export const handlePlacePiecesScreen = () => {
  if (!doneInitCanvas) {
    initCanvas();
  }
  /** Canvas size. */
  const csize = canvas.width;
  /** Whether the numbers of red pieces and blue pieces are same. */
  let satisfied: boolean = false;
  /** Map of positions and colors. */
  let posmap: InitialPositionMap = {};
  for (let i = 1; i <= 4; i++) {
    for (let j = 2; j <= 3; j++) {
      posmap[`${i},${j}`] = 'R';
    }
  }

  const anotherColor = (color: Color) => (color === 'R' ? 'B' : 'R');

  /**
   * Check if the numbers of red pieces and blue pieces are same.
   * @param colors List of colors.
   */
  const checkColor = (colors: Color[]): boolean => {
    return (
      colors.filter((color: Color) => color === 'R').length ===
      colors.filter((color: Color) => color === 'B').length
    );
  };

  /** Draw the screen. */
  const drawDisp = () => {
    draw.decidePiecePlace(new Map(Object.entries(posmap)), !satisfied);
  };

  drawDisp();

  // Mouse event
  mouse = new Mouse(canvas);
  canvas.onclick = (e: MouseEvent) => {
    // Place pieces.
    for (let i = 1; i <= 4; i++) {
      for (let j = 2; j <= 3; j++) {
        if (String(mouse.getCoord(e)) === String([i, j])) {
          posmap[`${i},${j}`] = anotherColor(posmap[`${i},${j}`]);
          satisfied = checkColor(Array.from(Object.values(posmap)));
          snd('select');
        }
      }
    }
    // Update screen.
    drawDisp();
    // Decide button
    if (
      mouse.onArea(
        ...mouse.getWindowPos(e),
        (csize * 5) / 6,
        (csize * 5) / 6,
        csize / 8,
        csize / 12
      )
    ) {
      if (satisfied) {
        canvas.onclick = () => {};
        handlePiecePositionDecision(posmap);
        snd('decide');
      } else {
        snd('forbid');
      }
    }
  };
};

/** Handles screen events of the player during the game.
 * @param board Board data.
 * @param turn Whether the current user plays firstly or secondly.
 * @param isMyTurn Whether the current turn is the current user's.
 * @param players The names of the players.
 * @param takenPieces Piece colors and numbers that each player has taken.
 */
export const handleGameScreen = (
  board: Board,
  turn: PlayerId,
  isMyTurn: boolean,
  players: [string, string],
  takenPieces: TakenPieces
) => {
  const boardMap: Map<string, { color: Color; turn: PlayerId }> = new Map(Object.entries(board));
  /** The position of the piece that is selected. */
  let selectingPos: [number, number];
  draw.board(boardMap, turn, ...players);
  draw.takenPieces(takenPieces, turn);
  // Show player's turn.
  // Mouse event
  if (isMyTurn) {
    gameMessage.innerText = isEN ? "It's your turn." : 'あなたの番です。';
    snd('move');

    mouse = new Mouse(canvas);
    canvas.onclick = (e: MouseEvent) => {
      const sqPos = mouse.getCoord(e);
      // When the user selected their own piece.
      if (boardMap.has(String(sqPos)) && boardMap.get(String(sqPos)).turn === turn) {
        selectingPos = sqPos;
        const pieceData = Object.values(boardMap.get(String(sqPos))) as [Color, PlayerId];
        const piece = new Piece(...pieceData);
        // Draw destinations.
        draw.board(boardMap, turn, ...players);
        draw.dest(piece, selectingPos, boardMap);
        draw.takenPieces(takenPieces, turn);
      } else {
        if (boardMap.has(String(selectingPos))) {
          const pieceData = Object.values(boardMap.get(String(selectingPos))) as [Color, PlayerId];
          const piece = new Piece(...pieceData);
          // When the user selected a destination position.
          if (piece.coveringSquares(selectingPos).some((e) => String(e) === String(sqPos))) {
            // Move the piece.
            boardMap.set(String(sqPos), boardMap.get(String(selectingPos)));
            boardMap.delete(String(selectingPos));
            snd('move');
            handlePieceMove(turn, selectingPos, sqPos);
          }
        }
        // Update drawing board.
        draw.board(boardMap, turn, ...players);
        draw.takenPieces(takenPieces, turn);
        selectingPos = null;
      }
    };
  } else {
    gameMessage.innerText = isEN ? "It's your opponent's turn." : '相手の番です。';

    canvas.onclick = () => {};
  }
};

/**
 * Displays the game screen for audience.
 * @param board Board data.
 * @param curTurn Current turn.
 * @param players The names of the players.
 * @param takenPieces Piece colors and numbers that each player has taken.
 */
export const showGameScreenForAudience = (
  board: Board,
  curTurn: PlayerId,
  players: [string, string],
  takenPieces: TakenPieces
) => {
  if (!doneInitCanvas) {
    initCanvas();
  }
  const boardMap: Map<string, { color: Color; turn: PlayerId }> = new Map(Object.entries(board));
  draw.board(boardMap, 0, ...players, true);
  draw.takenPieces(takenPieces, 0);
  const curPlayer: string = players[curTurn];
  gameMessage.innerText = isEN ? `It's ${curPlayer}'s turn.` : `${curPlayer} さんの番です。`;
  snd('move');
};
