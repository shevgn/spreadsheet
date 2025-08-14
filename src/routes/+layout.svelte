<script lang="ts">
    import { createSheetContext } from '$lib/SheetContext.svelte';
    import type { Cell } from '$lib/types';
    import { onMount } from 'svelte';
    import '../app.css';

    let { children } = $props();

    let cells = $state<Cell[][]>([
        [
            {
                value: '1',
                bgColor: 'red',
                color: 'white'
            },
            {
                value: '2',
                bgColor: 'green',
                color: 'white'
            },
            {
                value: '3',
                bgColor: 'blue',
                color: 'white'
            }
        ],
        [
            {
                value: '4',
                bgColor: 'red',
                color: 'white'
            },
            {
                value: '5',
                bgColor: 'green',
                color: 'white'
            },
            {
                value: '6',
                bgColor: 'blue',
                color: 'white'
            }
        ],
        [
            {
                value: '7',
                bgColor: 'red',
                color: 'white'
            },
            {
                value: '8',
                bgColor: 'green',
                color: 'white'
            },
            {
                value: '9',
                bgColor: 'blue',
                color: 'white'
            }
        ]
    ]);

    createSheetContext(cells);

    let rootEl = $state<HTMLElement | null>(null);
    let headerEl = $state<HTMLElement | null>(null);
    let mainEl = $state<HTMLElement | null>(null);
    let footerEl = $state<HTMLElement | null>(null);

    onMount(() => {
        if (!rootEl) {
            return;
        }
        if (!headerEl) {
            return;
        }
        if (!mainEl) {
            return;
        }
        if (!footerEl) {
            return;
        }
        mainEl.style.height = `${
            rootEl.clientHeight - headerEl.clientHeight - footerEl.clientHeight
        }px`;
    });
</script>

<div
    class="relative flex h-screen flex-col overflow-hidden"
    bind:this={rootEl}
>
    <header
        class="flex min-h-14 items-center justify-between bg-white"
        bind:this={headerEl}
    >
        <div class="container mx-auto px-2 py-4">
            <h1 class="text-3xl font-bold">Spreadsheet</h1>
        </div>
    </header>
    <main
        class="flex flex-1 flex-col items-center"
        bind:this={mainEl}
    >
        {@render children()}
    </main>
    <footer
        class="flex min-h-14 items-center justify-between bg-white"
        bind:this={footerEl}
    >
        <div class="container mx-auto px-2 py-4">
            <p>&copy; 2025 Levchenko Artem</p>
        </div>
    </footer>
</div>
