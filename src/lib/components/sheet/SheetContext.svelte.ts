import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import type { Cell } from '$lib/types';

export const MIN_COLS = 26;
export const MIN_ROWS = 30;

class SheetContext {
    cells: Cell[][] = $state([]);
    columnWidths: number[] = $state([]);

    private selectedCell = $state<{ row: number; col: number } | null>(null);
    private readonly localStorageKey = 'sheet-cells';
    private readonly localStorageColumnWidthsKey = 'sheet-column-widths';

    readonly defaultColumnWidth = 80;
    readonly minColumnWidth = 50;
    readonly maxColumnWidth = 200;
    readonly MIN_COLS = MIN_COLS;
    readonly MIN_ROWS = MIN_ROWS;
    readonly MAX_COLS = this.MIN_COLS * 2;

    constructor(cells: Cell[][]) {
        this.cells = cells;
        // Initialize column widths with default values
        // We'll determine the number of columns based on the initial cells data

        this.columnWidths = Array(this.countColumns()).fill(
            this.defaultColumnWidth
        );
    }

    getCells() {
        return this.cells;
    }
    getSelectedCell() {
        return this.selectedCell;
    }

    selectCell(row: number, col: number) {
        this.selectedCell = { row, col };
    }

    isCellSelected(row: number, col: number) {
        return this.selectedCell?.row === row && this.selectedCell?.col === col;
    }

    addRow() {
        const start = Math.max(this.cells.length, this.MIN_ROWS);

        this.cells[start] = [];

        this.cells[start] = Array(this.countColumns()).fill({
            value: '',
            bgColor: '',
            color: ''
        });

        this.saveToLocalStorage();
    }

    addColumn() {
        if (this.countColumns() >= this.MAX_COLS) return;

        this.cells.forEach((row) => {
            const start = Math.max(row.length, this.MIN_COLS);

            row[start] = { value: '', bgColor: '', color: '' };
        });
        // Add a new column width entry
        this.columnWidths.push(this.defaultColumnWidth);

        this.saveToLocalStorage();
    }

    deleteColumn(col: number) {
        this.cells.forEach((row) => {
            row.splice(col - 1, 1);
        });

        this.saveToLocalStorage();
    }

    addCell(row: number, col: number) {
        if (this.cells[row] === null || this.cells[row] === undefined) {
            this.cells[row] = [];
        }

        if (
            this.cells[row][col] !== null ||
            this.cells[row][col] !== undefined
        ) {
            return;
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

    countColumns() {
        return this.cells.reduce(
            (acc, row) => Math.max(acc, row?.length ?? this.MIN_COLS),
            this.MIN_COLS
        );
    }

    getColumnWidth(colIndex: number): number {
        return this.columnWidths[colIndex] ?? this.defaultColumnWidth;
    }

    setColumnWidth(colIndex: number, width: number) {
        this.columnWidths[colIndex] = width;
        this.saveToLocalStorage();
    }

    resetColumnsWidths() {
        this.columnWidths = [];
        this.saveToLocalStorage();
    }

    minimizeColumnsWidths() {
        this.columnWidths = Array(this.countColumns()).fill(
            this.minColumnWidth
        );
        this.saveToLocalStorage();
    }

    maximizeColumnsWidths() {
        this.columnWidths = Array(this.countColumns()).fill(
            this.maxColumnWidth
        );

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
    if (cells === undefined) {
        cells = Array(MIN_ROWS).fill(
            Array(MIN_COLS).fill({
                value: '',
                bgColor: '',
                color: ''
            })
        );
    }

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
