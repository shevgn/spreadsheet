<script lang="ts">
    import Button from '$lib/components/mainControlPanel/Button.svelte';
    import Delimiter from '$lib/components/mainControlPanel/Delimiter.svelte';
    import Sheet from '$lib/components/sheet/Sheet.svelte';
    import { getSheetContext } from '$lib/components/sheet/SheetContext.svelte';
    import {
        ChevronsLeftRightEllipsis,
        Columns2,
        FoldHorizontal,
        Plus,
        Rows2,
        UnfoldHorizontal,
        X
    } from '@lucide/svelte';

    let sheetContext = getSheetContext();
</script>

<svelte:head>
    <title>Spreadsheet</title>
    <meta
        name="description"
        content="Simple spreadsheet application"
    />
</svelte:head>

<div
    class="flex h-14 w-full items-center bg-white px-2 pt-2 pb-2 md:h-16 md:px-4"
>
    <div
        class="flex h-full flex-1 items-center rounded-2xl bg-zinc-100 px-2 py-1 md:px-4"
    >
        <div class="flex items-center space-x-2 px-2">
            <Button onClick={() => sheetContext.minimizeColumnsWidths()}>
                <span class="sr-only">Minimize columns widths</span>
                <FoldHorizontal class="size-4 md:size-5" />
            </Button>
            <Button onClick={() => sheetContext.maximizeColumnsWidths()}>
                <span class="sr-only">Maximize columns widths</span>
                <UnfoldHorizontal class="size-4 md:size-5" />
            </Button>
            <Button onClick={() => sheetContext.resetColumnsWidths()}>
                <span class="sr-only">Reset columns widths</span>
                <ChevronsLeftRightEllipsis class="size-4 md:size-5" />
            </Button>
        </div>
        <Delimiter />

        <div class="flex items-center space-x-2 px-2">
            <Button onClick={() => sheetContext.addRow()}>
                <span class="sr-only">Add row</span>

                <div class="relative flex-1">
                    <Rows2 class="size-4 md:size-5" />
                    <Plus
                        size="14"
                        class="absolute -bottom-1 -left-1 size-2.5 rounded-full bg-zinc-100 group-hover:bg-white md:size-3.5"
                    />
                </div>
            </Button>
            <Button onClick={() => sheetContext.addColumn()}>
                <span class="sr-only">Add column</span>
                <div class="relative">
                    <Columns2 class="size-4 md:size-5" />
                    <Plus
                        class="absolute -bottom-1 -left-1 size-2.5 rounded-full bg-zinc-100 group-hover:bg-white md:size-3.5"
                    />
                </div>
            </Button>
            <Button
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
</div>

<Sheet />
