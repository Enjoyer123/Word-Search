import { describe, it, expect } from "vitest";
import { generateGame } from "../game";
import { readWord } from "./helper/helpers";

describe("generateGame", () => {
    it("builds a complete game", () => {
        for (let n = 0; n < 200; n++) {
            const words = ["hello", "World", "cat", "typescript"];
            const original = [...words];
            const game = generateGame(words, 12, 12);

            expect(game.failed).toHaveLength(0);
            expect(game.placed).toHaveLength(4);
            expect(game.grid.data.flat().every(c => /^[A-Z]$/.test(c))).toBe(true);
            expect(game.placed.every(p => p.word === p.word.toUpperCase())).toBe(true);
            expect(game.placed.every(p => readWord(game.grid, p) === p.word)).toBe(true);
            expect(words).toEqual(original);
        }
    });

    it("reports words that cannot fit and still fills the grid", () => {
        const game = generateGame(["ABCDEFGHIJ"], 3, 3);

        expect(game.placed).toHaveLength(0);
        expect(game.failed).toEqual(["ABCDEFGHIJ"]);
        expect(game.grid.data.flat().every(c => /^[A-Z]$/.test(c))).toBe(true);
    });

    it("handles an empty word list", () => {
        const game = generateGame([], 5, 5);

        expect(game.placed).toHaveLength(0);
        expect(game.failed).toHaveLength(0);
        expect(game.grid.data.flat().every(c => /^[A-Z]$/.test(c))).toBe(true);
    });
});