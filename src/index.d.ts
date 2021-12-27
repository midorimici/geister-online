declare type Role = 'play' | 'watch';

declare type RoomState = 'waiting opponent' | 'placing pieces' | 'playing game';

declare type Color = 'R' | 'B';

declare type InitialPositionMap = Record<string, Color>;

declare type InitialPositions = [InitialPositionMap, InitialPositionMap];

declare type RoomInfo = {
  players: [string, string];
  state: RoomState;
  initialPositions: InitialPositions;
  boards: [
    Record<string, { color: Color; turn: 0 | 1 }>,
    Record<string, { color: Color; turn: 0 | 1 }>
  ];
  curTurn: 0 | 1;
  takenPieces: [{ R: number; B: number }, { R: number; B: number }];
  winner: 0 | 1;
};
