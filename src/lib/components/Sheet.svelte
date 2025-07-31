<script lang="ts">
    import { getSheetContext } from '$lib/SheetContext.svelte';
    import SheetCell from './SheetCell.svelte';

    let sheetContext = getSheetContext();

    const MIN_COLS = 10;
    const MIN_ROWS = 10;

    let rowsCount = $derived(
        sheetContext.cells.length > MIN_ROWS
            ? sheetContext.cells.length
            : MIN_ROWS
    );
    let maxCols = $derived.by(() => {
        return sheetContext.cells.reduce(
            (acc, row) => Math.max(acc, row.length, MIN_COLS),
            0
        );
    });
</script>

<div class="h-[80vh] w-full overflow-scroll">
    <table class="h-full w-full table-fixed">
        <tbody class="h-full w-full">
            {#each { length: rowsCount + 1 }, row (row)}
                <tr class="w-full">
                    {#each { length: maxCols + 1 }, col (col)}
                        <SheetCell
                            {col}
                            {row}
                        />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
