import { getContext, setContext } from 'svelte';
import type { Cell } from './types';
import { browser } from '$app/environment';

class SheetContext {
    cells: Cell[][] = $state([]);
    localStorageKey = 'sheet-cells';

    constructor(cells: Cell[][]) {
        this.cells = cells;
    }

    addRow() {
        this.cells.push([]);

        this.saveToLocalStorage();
    }

    addColumn() {
        this.cells.forEach((row) => {
            row.push({
                value: '',
                bgColor: '',
                color: ''
            });
        });

        this.saveToLocalStorage();
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

        this.saveToLocalStorage();
    }

    updateCell(row: number, col: number, cell: Cell) {
        this.cells[row][col] = cell;

        this.saveToLocalStorage();
    }

    safeCell(row: number, col: number) {
        if (this.cells[row]?.[col] === undefined) {
            this.addCell(row, col);
        }

        return this.cells[row][col];
    }

    saveToLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.cells));
    }

    loadFromLocalStorage() {
        const storedCells = localStorage.getItem(this.localStorageKey);

        if (storedCells) {
            this.cells = JSON.parse(storedCells) as Cell[][];
        }
    }
}

const SheetContextKey = Symbol('SheetContext');

export function createSheetContext(cells?: Cell[][]) {
    const sheetContext = new SheetContext(cells ?? []);
    if (browser) {
        sheetContext.loadFromLocalStorage();
    }
    return setContext(SheetContextKey, sheetContext);
}

export function getSheetContext() {
    return getContext<ReturnType<typeof createSheetContext>>(SheetContextKey);
}

export function isCellEmpty(cell: Cell | undefined) {
    if (cell === undefined) return true;

    return cell.value === '' && cell.bgColor === '' && cell.color === '';
}
