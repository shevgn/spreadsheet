<script lang="ts">
    import { getSheetContext } from '$lib/SheetContext.svelte';
    import { numberToAlphabet } from '$lib/utils';

    type Props = {
        col: number;
        row: number;
    };

    let { col, row }: Props = $props();

    let sheetContext = getSheetContext();

    let isAlphabetHeader = $state(col > 0 && row === 0);
    let isNumberHeader = $state(col === 0 && row > 0);

    let isEditing = $state(false);

    const focusOnMount = (element: HTMLInputElement) => {
        element.focus();
    };
</script>

<svelte:element
    this={col === 0 || row === 0 ? 'th' : 'td'}
    class="min-h-8 min-w-8 border"
>
    <div class="flex h-full items-center justify-center">
        {#if isAlphabetHeader}
            {numberToAlphabet(col - 1)}
        {/if}
        {#if isNumberHeader}
            {row}
        {/if}
        {#if col > 0 && row > 0}
            {#if isEditing}
                <input
                    type="text"
                    name={'cell-' + row + '-' + col}
                    class="h-full w-full"
                    bind:value={
                        () => sheetContext.safeCell(row - 1, col - 1).value,
                        (v) =>
                            sheetContext.updateCell(row - 1, col - 1, {
                                ...sheetContext.safeCell(row - 1, col - 1),
                                value: v
                            })
                    }
                    use:focusOnMount
                    onfocusout={() => {
                        isEditing = false;
                    }}
                    onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Escape') {
                            isEditing = false;
                        }
                    }}
                />
            {:else}
                <button
                    type="button"
                    ondblclick={() => {
                        isEditing = true;
                    }}
                    class="flex h-full flex-1 cursor-pointer items-center justify-center"
                >
                    {#if sheetContext.cells[row - 1]?.[col - 1]?.value}
                        <p>
                            {sheetContext.cells[row - 1][col - 1].value}
                        </p>
                    {:else}
                        <span class="invisible text-gray-400/50">
                            {numberToAlphabet(col - 1)}
                        </span>
                    {/if}
                </button>
            {/if}
        {/if}
    </div>
</svelte:element>
