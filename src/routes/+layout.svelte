<script lang="ts">
    import { createSheetContext } from '$lib/SheetContext.svelte';
    import type { Cell } from '$lib/types';
    import { onMount } from 'svelte';
    import '../app.css';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';

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

    let mainEl = $state<HTMLElement | null>(null);
    let rootHeight = $state(0);
    let headerHeight = $state(0);
    let footerHeight = $state(0);

    onMount(() => {
        if (!mainEl) return;

        mainEl.style.height = `${rootHeight - headerHeight - footerHeight}px`;
    });
</script>

<div
    class="relative flex h-screen flex-col overflow-hidden"
    bind:clientHeight={rootHeight}
>
    <Header bind:elHeight={headerHeight} />

    <main
        class="flex flex-1 flex-col items-center"
        bind:this={mainEl}
    >
        {@render children()}
    </main>

    <Footer bind:elHeight={footerHeight} />
</div>
