<script lang="ts">
    import { numberToAlphabet } from '$lib/utils';
    import { getSheetContext } from './SheetContext.svelte';

    type Props = {
        col: number;
        row: number;
    };

    let { col, row }: Props = $props();

    const DEFAULT_HEIGHT = 30;

    let sheetContext = getSheetContext();

    let width = $derived(sheetContext.getColumnWidth(col - 1));

    let isAlphabetHeader = $state(col > 0 && row === 0);
    let isNumberHeader = $state(col === 0 && row > 0);
    let isEditing = $state(false);
    let isHeader = $derived(col == 0 || row == 0);
    let isResizing = $state(false);

    const focusOnMount = (element: HTMLInputElement) => {
        element.focus();
    };

    const startResize = (e: MouseEvent) => {
        e.preventDefault();
        isResizing = true;
        const startX = e.clientX;
        const startWidth = width;

        const doResize = (moveEvent: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = Math.max(
                sheetContext.minColumnWidth,
                startWidth + (moveEvent.clientX - startX)
            );

            sheetContext.setColumnWidth(col - 1, newWidth);
            const cellElement = document.getElementById(`cell-${row}-${col}`);
            if (cellElement) {
                cellElement.style.width = `${newWidth}px`;
            }
        };

        const stopResize = () => {
            isResizing = false;
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
        };

        window.addEventListener('mousemove', doResize);
        window.addEventListener('mouseup', stopResize);
    };
</script>

<svelte:element
    this={isHeader ? 'th' : 'td'}
    id={`cell-${row}-${col}`}
    role="cell"
    tabindex="0"
    class={[
        'relative border text-sm',
        !isHeader ? 'border-zinc-300' : 'border-zinc-800',
        sheetContext.isCellSelected(row, col) && '!border-blue-500'
    ]}
    class:border-2={sheetContext.isCellSelected(row, col)}
    onclick={() => {
        if (row === 0 && col === 0) {
            return;
        }
        sheetContext.selectCell(row, col);
    }}
    oncontextmenu={(e) => {
        sheetContext.selectCell(row, col);
    }}
    ondblclick={() => {
        isEditing = true;
    }}
    style={`width: ${width}px; height: ${DEFAULT_HEIGHT}px; background-color: ${isHeader ? '#f7f7f7' : '#ffffff'}`}
>
    {#if isAlphabetHeader}
        <!--<div
            id={'cell-' + row + '-' + col + '-resize-left-handle'}
            role="slider"
            aria-valuenow={width}
            tabindex="-1"
            class="absolute top-0 bottom-0 left-0 w-1 cursor-col-resize hover:bg-green-400"
            onmousedown={startResize}
        ></div>-->
        <div
            id={'cell-' + row + '-' + col + '-resize-right-handle'}
            role="slider"
            aria-valuenow={width}
            aria-label="Resize column"
            tabindex="-1"
            class="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-green-400"
            onmousedown={startResize}
        >
            <span class="sr-only">Resize column</span>
        </div>
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
                <p
                    id={`cell-${row}-${col}-value`}
                    class="w-full text-center"
                >
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
