declare type Role = 'play' | 'watch';

declare type RoomState = 'waiting opponent' | 'placing pieces' | 'playing game';

declare type Color = 'R' | 'B';

declare type InitialPositionMap = Record<string, Color>;

declare type InitialPositions = [InitialPositionMap, InitialPositionMap];

declare type PlayerId = 0 | 1;

declare type Board = Record<string, { color: Color; turn: PlayerId }>;

declare type Boards = [Board, Board];

declare type TakenPieces = [{ R: number; B: number }, { R: number; B: number }];

declare type RoomInfo = {
  players: [string, string];
  state: RoomState;
  initialPositions: InitialPositions;
  boards: Boards;
  curTurn: PlayerId;
  takenPieces: TakenPieces;
  winner: PlayerId;
};
