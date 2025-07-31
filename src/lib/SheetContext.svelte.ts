import { getContext, setContext } from 'svelte';
import type { Cell } from './types';

class SheetContext {
    cells: Cell[][] = $state([]);

    constructor(cells: Cell[][]) {
        this.cells = cells;
    }

    addRow() {
        this.cells.push([]);
    }

    addColumn() {
        this.cells.forEach((row) => {
            row.push({
                value: '',
                bgColor: '',
                color: ''
            });
        });
    }

    addCell(row: number, col: number) {
        if (this.cells[row] === undefined) {
            this.cells[row] = [];
        }

        this.cells[row][col] = {
            value: '',
            bgColor: '',
            color: ''
        };
    }

    updateCell(row: number, col: number, cell: Cell) {
        this.cells[row][col] = cell;
    }

    safeCell(row: number, col: number) {
        if (this.cells[row]?.[col] === undefined) {
            this.addCell(row, col);
        }

        return this.cells[row][col];
    }
}

const SheetContextKey = Symbol('SheetContext');

export function createSheetContext(cells?: Cell[][]) {
    return setContext(SheetContextKey, new SheetContext(cells || []));
}

export function getSheetContext() {
    return getContext<ReturnType<typeof createSheetContext>>(SheetContextKey);
}

export function isCellEmpty(cell: Cell | undefined) {
    if (cell === undefined) return true;

    return cell.value === '' && cell.bgColor === '' && cell.color === '';
}
