import type { Cell, Grid, Position, Direction, PlaceResult } from "./types";
import { STEPS } from "./types";
import { randomInt, randomDirection, randomLetter } from "./random";
export const EMPTY_CELL: Cell = ".";

export const createEmptyGrid = (rows: number, cols: number): Grid => {
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) {
        throw new RangeError(`rows and cols must be positive integers (got ${rows}, ${cols})`);
    }

    return {
        rows,
        cols,
        data: Array.from({ length: rows }, () => Array.from({ length: cols }, () => ".")),
    };
};

export const printGrid = (grid: Grid): void => {

    grid.data.forEach(row => {
        console.log(row.join(" "));
    })

    // console.log(grid.data);
}

export const canPlace = (grid: Grid, word: string, start: Position, direction: Direction): boolean => {

    const { dr, dc } = STEPS[direction];

    for (let i = 0; i < word.length; i++) {

        const row = start.row + dr * i;
        const col = start.col + dc * i;

        if (row < 0 || col < 0 || row >= grid.rows || col >= grid.cols) {
            return false;
        }

        const cell = grid.data[row][col];

        if (cell !== EMPTY_CELL && cell !== word[i]) {
            return false;
        }

    }

    return true
}

export const placeWord = (grid: Grid, word: string, start: Position, direction: Direction): PlaceResult | null => {

    if (!canPlace(grid, word, start, direction)) {
        return null;
    }

    const newData = grid.data.map(row => [...row]);

    const { dr, dc } = STEPS[direction];

    for (let i = 0; i < word.length; i++) {

        const row = start.row + dr * i;
        const col = start.col + dc * i;

        newData[row][col] = word[i];
    }

    return {
        grid: { ...grid, data: newData },
        placed: { word, position: start, direction }
    };

}

export const placeWordRandomly = (grid: Grid, word: string, maxAttempts: number): PlaceResult | null => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const direction = randomDirection();
        const start: Position = {
            row: randomInt(grid.rows),
            col: randomInt(grid.cols),
        };

        const result = placeWord(grid, word, start, direction);
        if (result) {
            return result;
        }
    }

    return null;
}

export const fillEmptyCells = (grid: Grid): Grid => {
    const newData = grid.data.map(row => [...row]);

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            if (newData[row][col] === EMPTY_CELL) {
                newData[row][col] = randomLetter();
            }
        }
    }

    return { ...grid, data: newData };
}