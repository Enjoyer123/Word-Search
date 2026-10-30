import { createEmptyGrid, placeWordRandomly, fillEmptyCells } from "./grid";
import type { PlacedWord, GameResult } from "./types";


export const generateGame = (words: string[], rows: number, cols: number, maxAttempts = 100): GameResult => {

    let grid = createEmptyGrid(rows, cols);
    const placed: PlacedWord[] = [];
    const failed: string[] = [];

    const sortedWords = [...words]
        .map(word => word.toUpperCase())
        .sort((a, b) => b.length - a.length)

    for (const word of sortedWords) {
        const result = placeWordRandomly(grid, word, maxAttempts);

        if (result) {
            grid = result.grid;
            placed.push(result.placed);
        } else {
            failed.push(word)
        }
    }

    grid = fillEmptyCells(grid);

    return { grid, placed, failed };

}