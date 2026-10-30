import type { Direction, Cell } from "./types"
import { STEPS } from "./types";

export const randomInt = (n: number): number => {
    return Math.floor(Math.random() * n);

}

export const randomDirection = (): Direction => {

    const directions = Object.keys(STEPS) as Direction[];

    const index = randomInt(directions.length);

    return directions[index];

}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const randomLetter = (): Cell => {
    const index = randomInt(ALPHABET.length);
    return ALPHABET[index];
}

