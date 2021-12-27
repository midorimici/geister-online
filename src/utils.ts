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
