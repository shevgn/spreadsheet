<script lang="ts">
    import { getSheetContext } from '$lib/SheetContext.svelte';
    import SheetCell from './SheetCell.svelte';

    let sheetContext = getSheetContext();

    const MIN_COLS = 26;
    const MIN_ROWS = 30;

    let rowsCount = $derived(
        sheetContext.cells.length > MIN_ROWS
            ? sheetContext.cells.length
            : MIN_ROWS
    );
    let maxCols = $derived.by(() => {
        return sheetContext.cells.reduce(
            (acc, row) => Math.max(acc, row?.length ?? MIN_COLS, MIN_COLS),
            0
        );
    });

    let selectedCell = $state<{ row: number; col: number } | null>(null);

    const selectCell = (row: number, col: number) => {
        selectedCell = { row, col };
    };
</script>

<div class="h-full w-full max-w-screen overflow-scroll">
    <table class="h-full w-full table-fixed border-collapse">
        <tbody class="h-full w-full">
            {#each { length: rowsCount + 1 }, row (row)}
                <tr class="h-full w-full">
                    {#each { length: maxCols + 1 }, col (col)}
                        <SheetCell
                            {col}
                            {row}
                            selected={selectedCell?.row === row &&
                                selectedCell?.col === col}
                            {selectCell}
                        />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
