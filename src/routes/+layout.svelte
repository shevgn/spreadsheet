<script lang="ts">
    import '../app.css';
    import type { Cell } from '$lib/types';
    import { createTabsContext } from '$lib/TabsContext.svelte';
    import Footer from '$lib/components/footer/Footer.svelte';
    import { contextMenuContext } from '$lib/components/contextMenu';
    import { createSheetContext } from '$lib/components/sheet/SheetContext.svelte';
    import { onDestroy, onMount } from 'svelte';
    import Header from '$lib/components/header/Header.svelte';
    import { browser } from '$app/environment';

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
    createTabsContext();
    contextMenuContext.create();

    let mainEl = $state<HTMLElement | null>(null);
    let headerHeight = $state(0);
    let footerHeight = $state(0);

    function resizeLayout() {
        if (!mainEl) return;

        const { innerHeight } = window;

        mainEl.style.height = `${innerHeight - headerHeight - footerHeight}px`;
    }

    onMount(() => {
        resizeLayout();

        if (!browser) return;
        window.addEventListener('resize', resizeLayout);
    });

    onDestroy(() => {
        if (!browser) return;
        window.removeEventListener('resize', resizeLayout);
    });
</script>

<div class="relative flex h-screen flex-col overflow-hidden">
    <Header bind:elHeight={headerHeight} />

    <main
        class="flex flex-1 flex-col items-center"
        bind:this={mainEl}
    >
        {@render children()}
    </main>

    <Footer bind:elHeight={footerHeight} />
</div>
