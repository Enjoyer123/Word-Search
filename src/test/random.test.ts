import { describe, it, expect } from "vitest";
import { randomInt, randomDirection, randomLetter } from "../random";
import { STEPS } from "../types";

describe("randomInt", () => {
    it("returns integers in 0..n-1 and covers every value", () => {
        const seen = new Set<number>();
        for (let i = 0; i < 5000; i++) {
            const n = randomInt(5);
            expect(Number.isInteger(n)).toBe(true);
            expect(n).toBeGreaterThanOrEqual(0);
            expect(n).toBeLessThan(5);
            seen.add(n);
        }
        expect(seen.size).toBe(5);
    });
});

describe("randomDirection", () => {
    it("always returns a valid direction and covers all 8", () => {
        const seen = new Set<string>();
        for (let i = 0; i < 5000; i++) {
            const d = randomDirection();
            expect(Object.keys(STEPS)).toContain(d);
            seen.add(d);
        }
        expect(seen.size).toBe(8);
    });
});

describe("randomLetter", () => {
    it("always returns one uppercase letter and covers A-Z", () => {
        const seen = new Set<string>();
        for (let i = 0; i < 5000; i++) {
            const c = randomLetter();
            expect(c).toMatch(/^[A-Z]$/);
            seen.add(c);
        }
        expect(seen.size).toBe(26);
    });
});