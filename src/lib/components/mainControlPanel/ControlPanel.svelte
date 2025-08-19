<script lang="ts">
    import {
        ChevronsLeftRightEllipsis,
        Columns2,
        FoldHorizontal,
        Plus,
        Rows2,
        UnfoldHorizontal,
        X
    } from '@lucide/svelte';
    import { getSheetContext } from '../sheet/SheetContext.svelte';
    import Button from './Button.svelte';
    import Delimiter from './Delimiter.svelte';

    let sheetContext = getSheetContext();
</script>

<div
    class="flex h-full flex-1 items-center rounded-2xl bg-zinc-100 px-2 py-1 md:px-4"
>
    <div class="flex items-center space-x-2 px-2">
        <Button
            title="Minimize columns widths"
            onClick={() => sheetContext.minimizeColumnsWidths()}
        >
            <span class="sr-only">Minimize columns widths</span>
            <FoldHorizontal class="size-4 md:size-5" />
        </Button>
        <Button
            title="Maximize columns widths"
            onClick={() => sheetContext.maximizeColumnsWidths()}
        >
            <span class="sr-only">Maximize columns widths</span>
            <UnfoldHorizontal class="size-4 md:size-5" />
        </Button>
        <Button
            title="Reset columns widths"
            onClick={() => sheetContext.resetColumnsWidths()}
        >
            <span class="sr-only">Reset columns widths</span>
            <ChevronsLeftRightEllipsis class="size-4 md:size-5" />
        </Button>
    </div>
    <Delimiter />

    <div class="flex items-center space-x-2 px-2">
        <Button
            title="Add row"
            onClick={() => sheetContext.addRow()}
        >
            <span class="sr-only">Add row</span>

            <div class="relative flex-1">
                <Rows2 class="size-4 md:size-5" />
                <Plus
                    size="14"
                    class="absolute -bottom-1 -left-1 size-2.5 rounded-full bg-zinc-100 group-hover:bg-white md:size-3.5"
                />
            </div>
        </Button>
        <Button
            title="Add column"
            onClick={() => sheetContext.addColumn()}
        >
            <span class="sr-only">Add column</span>
            <div class="relative">
                <Columns2 class="size-4 md:size-5" />
                <Plus
                    class="absolute -bottom-1 -left-1 size-2.5 rounded-full bg-zinc-100 group-hover:bg-white md:size-3.5"
                />
            </div>
        </Button>
        <Button
            title="Delete column"
            disabled={!sheetContext.getSelectedCell()}
            onClick={() => {
                const { col } = sheetContext.getSelectedCell() ?? {
                    col: null
                };
                if (!col) return;

                sheetContext.deleteColumn(col);
            }}
        >
            <span class="sr-only">Delete column</span>
            <div class="relative">
                <Rows2 class="size-4 md:size-5" />
                <X
                    class="absolute -bottom-1 -left-1 size-2.5 rounded-full bg-zinc-100 group-hover:bg-white md:size-3.5"
                />
            </div>
        </Button>
    </div>
    <Delimiter />
</div>
