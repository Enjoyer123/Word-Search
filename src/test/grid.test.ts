import { describe, it, expect } from "vitest";
import { createEmptyGrid, canPlace, placeWord, placeWordRandomly, fillEmptyCells } from "../grid";
import type { Direction, Position } from "../types";
import { readWord } from "./helper/helpers";

describe("createEmptyGrid", () => {
    it("creates the requested size", () => {
        const grid = createEmptyGrid(3, 4);
        expect(grid.rows).toBe(3);
        expect(grid.cols).toBe(4);
        expect(grid.data).toHaveLength(3);
        expect(grid.data.every(row => row.length === 4)).toBe(true);
    });

    it("gives every row its own array", () => {
        const grid = createEmptyGrid(3, 3);
        grid.data[0][0] = "A";
        expect(grid.data[1][0]).not.toBe("A");
        expect(grid.data[0]).not.toBe(grid.data[1]);
    });

    it.each([[-3, 5], [0, 5], [5, 0], [2.5, 5], [5, NaN]])(
        "throws RangeError for invalid size (%s, %s)",
        (rows, cols) => {
            expect(() => createEmptyGrid(rows, cols)).toThrow(RangeError);
        }
    );
});

describe("canPlace", () => {
    it("allows placing in an empty grid", () => {
        expect(canPlace(createEmptyGrid(5, 5), "HELLO", { row: 0, col: 0 }, "E")).toBe(true);
    });

    it("Conflict with another letter", () => {
        const grid = createEmptyGrid(5, 5);
        grid.data[0][2] = "X";
        expect(canPlace(grid, "HELLO", { row: 0, col: 0 }, "E")).toBe(false);
    });

    it("Cross with the same letter", () => {
        const grid = createEmptyGrid(5, 5);
        grid.data[0][2] = "L";
        expect(canPlace(grid, "HELLO", { row: 0, col: 0 }, "E")).toBe(true);
    });

    it("rejects a conflicting letter", () => {
        const grid = createEmptyGrid(5, 5);
        grid.data[0][4] = "X";
        expect(canPlace(grid, "HELLO", { row: 0, col: 0 }, "E")).toBe(false);
    });

    const cases: [Direction, Position, boolean][] = [
        ["E", { row: 0, col: 0 }, true],
        ["E", { row: 0, col: 3 }, false],
        ["W", { row: 0, col: 4 }, true],
        ["W", { row: 0, col: 3 }, false],
        ["N", { row: 4, col: 0 }, true],
        ["N", { row: 3, col: 0 }, false],
        ["S", { row: 0, col: 0 }, true],
        ["S", { row: 1, col: 0 }, false],
        ["SE", { row: 0, col: 0 }, true],
        ["SE", { row: 0, col: 1 }, false],
        ["NE", { row: 4, col: 0 }, true],
        ["NE", { row: 4, col: 4 }, false],
        ["NW", { row: 4, col: 4 }, true],
        ["NW", { row: 4, col: 0 }, false],
        ["SW", { row: 0, col: 4 }, true],
        ["SW", { row: 0, col: 0 }, false],
    ];

    it.each(cases)("direction %s from %j → %s", (direction, start, expected) => {
        expect(canPlace(createEmptyGrid(5, 5), "HELLO", start, direction)).toBe(expected);
    });

    it("rejects a word longer than the grid", () => {
        expect(canPlace(createEmptyGrid(5, 4), "HELLO", { row: 0, col: 0 }, "E")).toBe(false);
    });

    it("rejects a start position outside the grid", () => {
        expect(canPlace(createEmptyGrid(5, 5), "H", { row: -1, col: 0 }, "E")).toBe(false);
        expect(canPlace(createEmptyGrid(5, 5), "H", { row: 5, col: 0 }, "E")).toBe(false);
    });

    it("does not modify the grid", () => {
        const grid = createEmptyGrid(5, 5);
        grid.data[0][0] = "H";
        const before = structuredClone(grid.data);
        canPlace(grid, "HELLO", { row: 0, col: 0 }, "E");
        expect(grid.data).toEqual(before);
    });

});

describe("placeWord", () => {
    it("writes the word into a new grid and leaves the original untouched", () => {
        const grid = createEmptyGrid(5, 5);
        const before = structuredClone(grid.data);
        const result = placeWord(grid, "HELLO", { row: 0, col: 0 }, "E");

        expect(result).not.toBeNull();
        expect(result!.grid.data[0].join("")).toBe("HELLO");
        expect(result!.grid.data).not.toBe(grid.data);
        expect(grid.data).toEqual(before);
        expect(result!.grid.rows).toBe(5);
        expect(result!.grid.cols).toBe(5);
    });

    it("returns the placed info", () => {
        const result = placeWord(createEmptyGrid(5, 5), "HELLO", { row: 0, col: 0 }, "E");
        expect(result!.placed).toEqual({ word: "HELLO", position: { row: 0, col: 0 }, direction: "E" });
    });

    it("writes diagonally", () => {
        const result = placeWord(createEmptyGrid(5, 5), "CAT", { row: 0, col: 0 }, "SE");
        expect(result!.grid.data[0][0]).toBe("C");
        expect(result!.grid.data[1][1]).toBe("A");
        expect(result!.grid.data[2][2]).toBe("T");
    });

    it("allows a second word to cross the first on the same letter", () => {
        const first = placeWord(createEmptyGrid(5, 5), "HELLO", { row: 0, col: 0 }, "E");
        const second = placeWord(first!.grid, "LAP", { row: 0, col: 2 }, "S");

        expect(second).not.toBeNull();
        expect(second!.grid.data[0].join("")).toBe("HELLO");
        expect(second!.grid.data[1][2]).toBe("A");
        expect(second!.grid.data[2][2]).toBe("P");
    });

    it("returns null and leaves the grid unchanged on conflict", () => {
        const first = placeWord(createEmptyGrid(5, 5), "HELLO", { row: 0, col: 0 }, "E");
        const before = structuredClone(first!.grid.data);

        expect(placeWord(first!.grid, "XYZ", { row: 0, col: 2 }, "S")).toBeNull();
        expect(first!.grid.data).toEqual(before);
    });

    it("returns null when out of bounds", () => {
        expect(placeWord(createEmptyGrid(5, 5), "HELLO", { row: 0, col: 3 }, "E")).toBeNull();
    });
});

describe("placeWordRandomly", () => {
    it("places a word and leaves the original untouched", () => {
        const grid = createEmptyGrid(5, 5);
        const before = structuredClone(grid.data);
        const result = placeWordRandomly(grid, "HELLO", 100);

        expect(result).not.toBeNull();
        expect(result!.placed.word).toBe("HELLO");
        expect(readWord(result!.grid, result!.placed)).toBe("HELLO");
        expect(grid.data).toEqual(before);
    });

    it("returns null when the word cannot fit", () => {
        expect(placeWordRandomly(createEmptyGrid(3, 3), "HELLO", 100)).toBeNull();
    });

    it("always finds a spot in an empty 6x6 and writes exactly the word's letters", () => {
        for (let i = 0; i < 300; i++) {
            const result = placeWordRandomly(createEmptyGrid(6, 6), "WORD", 100);
            expect(result).not.toBeNull();
            expect(readWord(result!.grid, result!.placed)).toBe("WORD");
            expect(result!.grid.data.flat().filter(c => c !== createEmptyGrid(1, 1).data[0][0])).toHaveLength(4);
        }
    });
});

describe("fillEmptyCells", () => {
    it("fills every empty cell with a letter and keeps placed words", () => {
        const placed = placeWord(createEmptyGrid(5, 5), "HELLO", { row: 0, col: 0 }, "E");
        const before = structuredClone(placed!.grid.data);
        const filled = fillEmptyCells(placed!.grid);

        expect(filled.data.flat().every(c => /^[A-Z]$/.test(c))).toBe(true);
        expect(filled.data[0].join("")).toBe("HELLO");
        expect(placed!.grid.data).toEqual(before);
        expect(filled.data).not.toBe(placed!.grid.data);
        expect(filled.rows).toBe(5);
        expect(filled.cols).toBe(5);
    });
});