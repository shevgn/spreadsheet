<script lang="ts">
    import { createSheetContext } from '$lib/SheetContext.svelte';
    import type { Cell } from '$lib/types';
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
</script>

<div class="flex min-h-screen flex-col">
    <header class="flex min-h-14 items-center justify-between">
        <div class="container mx-auto py-4">
            <h1 class="text-3xl font-bold">Spreadsheet</h1>
        </div>
    </header>
    <main class="flex flex-1 items-center justify-center p-4">
        {@render children()}
    </main>
    <footer class="flex min-h-14 items-center justify-between">
        <div class="container mx-auto py-4">
            <p>&copy; 2025 Levchenko Artem</p>
        </div>
    </footer>
</div>
