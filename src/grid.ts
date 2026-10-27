import type { Cell, Grid } from "./types";

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



