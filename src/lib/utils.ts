/**
 * Generates initial board from initial piece positions.
 * @param orders Initial piece positions of the players.
 * @param turn For which player is the board should be generated.
 * @returns Board object.
 */
export const initBoard = (orders: InitialPositions, turn: PlayerId): Board => {
  let m: Board = {};
  for (const [k, v] of Object.entries(orders[0])) {
    const [x, y] = k.split(',').map((e: string) => +e);
    if (turn === 0) {
      m[`${x},${y + 2}`] = { color: v, turn: 0 };
    } else {
      m[`${5 - x},${3 - y}`] = { color: v, turn: 0 };
    }
  }
  for (const [k, v] of Object.entries(orders[1])) {
    const [x, y] = k.split(',').map((e: string) => +e);
    if (turn === 0) {
      m[`${5 - x},${3 - y}`] = { color: v, turn: 1 };
    } else {
      m[`${x},${y + 2}`] = { color: v, turn: 1 };
    }
  }
  return m;
};

/**
 * Check if `side` satisfies winning conditions.
 * @param taken Piece colors and numbers that each player has taken.
 * @param posOnBoard The position list of the pieces on the board.
 * @param side Whether the player played firstly or secondly.
 * @param moved Whether `side` has just moved a piece.
 */
export const winReq = (
  taken: TakenPieces,
  posOnBoard: string[],
  side: PlayerId,
  moved: boolean
): boolean => {
  if (moved) {
    // The player has taken 4 blue pieces
    // or A blue piece has gone out from the board.
    return (
      taken[side]['B'] === 4 ||
      posOnBoard.indexOf('0,-1') !== -1 ||
      posOnBoard.indexOf('5,-1') !== -1
    );
  } else {
    // 4 red pieces have been taken.
    return taken[(side + 1) % 2]['R'] === 4;
  }
};
