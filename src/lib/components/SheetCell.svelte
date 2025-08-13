<script lang="ts">
    import { getSheetContext } from '$lib/SheetContext.svelte';
    import { numberToAlphabet } from '$lib/utils';

    type Props = {
        col: number;
        row: number;
        width?: number;
        height?: number;
    };

    let { col, row, width, height }: Props = $props();

    const DEFAULT_WIDTH = 80;
    const DEFAULT_HEIGHT = 40;

    if (!width) {
        width = DEFAULT_WIDTH;
    }
    if (!height) {
        height = DEFAULT_HEIGHT;
    }

    let sheetContext = getSheetContext();

    let isAlphabetHeader = $state(col > 0 && row === 0);
    let isNumberHeader = $state(col === 0 && row > 0);

    let isEditing = $state(false);

    const focusOnMount = (element: HTMLInputElement) => {
        element.focus();
    };

    let isHeader = $derived(col == 0 || row == 0);
</script>

<svelte:element
    this={isHeader ? 'th' : 'td'}
    class="border"
    style={`width: ${width}px; 
            height: ${height}px; 
            background-color: ${isHeader ? '#f7f7f7' : '#ffffff'}
    `}
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
