import { isEN } from './config';
import Draw from './draw';
import { handlePiecePositionDecision } from './lib';
import Mouse from './mouse';
import { useIsMuted } from './states';

let draw: Draw;
let mouse: Mouse;
/** Whether `initCanvas` has executed. */
let doneInitCanvas: boolean = false;
/** `canvas` element */
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

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

/** Hide input forms and show game container including canvas. */
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

/** Display place pieces screen on the canvas and handle mouse events. */
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
    drawDisp();
  };
};
