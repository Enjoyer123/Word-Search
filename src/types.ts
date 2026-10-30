export type Direction = "E" | "W" | "N" | "S" | "NE" | "NW" | "SE" | "SW";

export type Step = {
    readonly dr: number;
    readonly dc: number;
};

export const STEPS: Readonly<Record<Direction, Step>> = {
    E: { dr: 0, dc: 1 },
    W: { dr: 0, dc: -1 },
    N: { dr: -1, dc: 0 },
    S: { dr: 1, dc: 0 },
    NE: { dr: -1, dc: 1 },
    NW: { dr: -1, dc: -1 },
    SE: { dr: 1, dc: 1 },
    SW: { dr: 1, dc: -1 }
};

export type Position = {
    row: number;
    col: number;
};

export type Cell = string;

export type Grid = {
    rows: number;
    cols: number;
    data: Cell[][];
};

export type PlacedWord = {
    word: string;
    position: Position;
    direction: Direction;
};

export type PlaceResult = {
    grid: Grid;
    placed: PlacedWord;
};

export type GameResult = {
    grid: Grid;
    placed: PlacedWord[];
    failed: string[];
};