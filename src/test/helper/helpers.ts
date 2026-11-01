import { STEPS } from "../../types";
import type { Grid, PlacedWord } from "../../types";

export const readWord = (grid: Grid, p: PlacedWord): string => {
    const { dr, dc } = STEPS[p.direction];
    return Array.from({ length: p.word.length }, (_, i) =>
        grid.data[p.position.row + dr * i][p.position.col + dc * i]
    ).join("");
};