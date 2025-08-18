<script lang="ts">
    import SheetCell from './SheetCell.svelte';
    import { getSheetContext } from './SheetContext.svelte';

    let sheetContext = getSheetContext();

    let rowsCount = $derived(
        sheetContext.getCells().length > sheetContext.MIN_ROWS
            ? sheetContext.getCells().length
            : sheetContext.MIN_ROWS
    );
    let maxCols = $derived.by(() => {
        return sheetContext.cells.reduce(
            (acc, row) =>
                Math.max(
                    acc,
                    row?.length ?? sheetContext.MIN_COLS,
                    sheetContext.MIN_COLS
                ),
            0
        );
    });
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
                        />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
