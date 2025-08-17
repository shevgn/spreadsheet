import { getContext, setContext } from 'svelte';
import type { Cell } from './types';
import { browser } from '$app/environment';

class SheetContext {
    cells: Cell[][] = $state([]);
    columnWidths: number[] = $state([]); // Store column widths
    private readonly localStorageKey = 'sheet-cells';
    private readonly localStorageColumnWidthsKey = 'sheet-column-widths';
    private readonly defaultColumnWidth = 80;

    constructor(cells: Cell[][]) {
        this.cells = cells;
        // Initialize column widths with default values
        // We'll determine the number of columns based on the initial cells data
        const maxCols = cells.reduce(
            (acc, row) => Math.max(acc, row.length),
            0
        );
        this.columnWidths = Array(maxCols).fill(this.defaultColumnWidth);
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
        // Add a new column width entry
        this.columnWidths.push(this.defaultColumnWidth);

        this.saveToLocalStorage();
    }

    addCell(row: number, col: number) {
        if (this.cells[row] === null || this.cells[row] === undefined) {
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
        if (
            this.cells[row]?.[col] === undefined ||
            this.cells[row]?.[col] === null
        ) {
            this.addCell(row, col);
        }

        return this.cells[row][col];
    }

    getColumnWidth(colIndex: number): number {
        return this.columnWidths[colIndex] ?? this.defaultColumnWidth;
    }

    setColumnWidth(colIndex: number, width: number) {
        this.columnWidths[colIndex] = width;
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.cells));
        localStorage.setItem(
            this.localStorageColumnWidthsKey,
            JSON.stringify(this.columnWidths)
        );
    }

    loadFromLocalStorage() {
        const storedCells = localStorage.getItem(this.localStorageKey);
        const storedColumnWidths = localStorage.getItem(
            this.localStorageColumnWidthsKey
        );

        if (storedCells) {
            this.cells = JSON.parse(storedCells) as Cell[][];
        }

        if (storedColumnWidths) {
            this.columnWidths = JSON.parse(storedColumnWidths) as number[];
        } else {
            // If no stored column widths, initialize based on current cells
            const maxCols = this.cells.reduce(
                (acc, row) => Math.max(acc, row?.length ?? 20),
                0
            );
            this.columnWidths = Array(maxCols).fill(this.defaultColumnWidth);
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
