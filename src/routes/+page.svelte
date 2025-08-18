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
        UnfoldHorizontal
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

<div class="flex h-20 w-full items-center bg-white px-4 pt-2 pb-4">
    <div
        class="flex h-full flex-1 items-center rounded-2xl bg-zinc-100 px-4 py-1"
    >
        <div class="flex items-center space-x-2 p-2">
            <Button onClick={() => sheetContext.minimizeColumnsWidths()}>
                <span class="sr-only">Minimize columns widths</span>
                <FoldHorizontal size="20" />
            </Button>
            <Button onClick={() => sheetContext.maximizeColumnsWidths()}>
                <span class="sr-only">Maximize columns widths</span>
                <UnfoldHorizontal size="20" />
            </Button>
            <Button onClick={() => sheetContext.resetColumnsWidths()}>
                <span class="sr-only">Reset columns widths</span>
                <ChevronsLeftRightEllipsis size="20" />
            </Button>
        </div>
        <Delimiter />

        <div class="flex items-center space-x-2 p-2">
            <Button onClick={() => sheetContext.addRow()}>
                <span class="sr-only">Add row</span>

                <div class="relative">
                    <Rows2 size="20" />
                    <Plus
                        size="14"
                        class="absolute -bottom-1 -left-1 rounded-full bg-zinc-100"
                    />
                </div>
            </Button>
            <Button onClick={() => sheetContext.addColumn()}>
                <span class="sr-only">Add column</span>
                <div class="relative">
                    <Columns2 size="20" />
                    <Plus
                        size="14"
                        class="absolute -bottom-1 -left-1 rounded-full bg-zinc-100"
                    />
                </div>
            </Button>
            <Button onClick={() => sheetContext.deleteColumn(1)}>
                <span class="sr-only">Delete column</span>
                <div class="relative">
                    <Rows2 size="20" />
                    <Plus
                        size="14"
                        class="absolute -bottom-1 -left-1 rounded-full bg-zinc-100"
                    />
                </div>
            </Button>
        </div>
        <Delimiter />
    </div>
</div>

<Sheet />
