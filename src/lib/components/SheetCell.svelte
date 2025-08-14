<script lang="ts">
    import { getSheetContext } from '$lib/SheetContext.svelte';
    import { numberToAlphabet } from '$lib/utils';

    type Props = {
        col: number;
        row: number;
        selected?: boolean;
        selectCell: (row: number, col: number) => void;
        width?: number;
        height?: number;
    };

    let { col, row, selected, selectCell, width, height }: Props = $props();

    const DEFAULT_WIDTH = 80;
    const DEFAULT_HEIGHT = 30;

    if (!width) width = DEFAULT_WIDTH;
    if (!height) height = DEFAULT_HEIGHT;

    let sheetContext = getSheetContext();

    let isAlphabetHeader = $state(col > 0 && row === 0);
    let isNumberHeader = $state(col === 0 && row > 0);
    let isEditing = $state(false);
    let isHeader = $derived(col == 0 || row == 0);
    let isResizing = $state(false);

    const focusOnMount = (element: HTMLInputElement) => {
        element.focus();
    };
</script>

<svelte:element
    this={isHeader ? 'th' : 'td'}
    role="cell"
    tabindex="0"
    class={[
        'relative text-sm',
        !isHeader && !selected && 'border-[0.5px]',
        selected && 'border-blue-500'
    ]}
    class:border={isHeader}
    class:border-2={selected}
    onclick={() => {
        if (row === 0 && col === 0) {
            return;
        }
        selectCell(row, col);
    }}
    ondblclick={() => {
        isEditing = true;
    }}
    style={`width: ${width}px;height: ${height}px;background-color: ${isHeader ? '#f7f7f7' : '#ffffff'}`}
>
    {#if isAlphabetHeader}
        <div
            id={'cell-' + row + '-' + col + '-resize-left-handle'}
            role="slider"
            aria-valuenow={width}
            tabindex="0"
            class="absolute top-0 bottom-0 left-0 w-1 cursor-col-resize hover:bg-green-400"
        ></div>
        <div
            id={'cell-' + row + '-' + col + '-resize-right-handle'}
            role="slider"
            aria-valuenow={width}
            tabindex="0"
            class="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-green-400"
        ></div>
    {/if}
    <div class="flex h-full w-full items-center justify-center">
        {#if isAlphabetHeader}
            <span class="pointer-events-none select-none">
                {numberToAlphabet(col - 1)}
            </span>
        {/if}
        {#if isNumberHeader}
            <span class="pointer-events-none select-none">
                {row}
            </span>
        {/if}
        {#if col > 0 && row > 0}
            {#if isEditing}
                {@render input()}
            {:else}
                <p class="w-full text-center">
                    {sheetContext.cells[row - 1]?.[col - 1]?.value ?? ''}
                </p>
            {/if}
        {/if}
    </div>
</svelte:element>

{#snippet input()}
    <input
        type="text"
        name={'cell-' + row + '-' + col}
        class="absolute z-10 bg-white"
        style:width={`${() => sheetContext.safeCell(row - 1, col - 1).value.length * 10}px`}
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
{/snippet}
