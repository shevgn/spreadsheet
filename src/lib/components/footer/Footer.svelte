<script lang="ts">
    import { getTabsContext } from '$lib/TabsContext.svelte';
    import { Plus } from '@lucide/svelte';
    import { fade } from 'svelte/transition';
    import TabsContextMenu from './TabsContextMenu.svelte';

    type Props = {
        elHeight: number;
    };

    let { elHeight = $bindable() }: Props = $props();

    let tabsContext = getTabsContext();
</script>

<footer
    class="flex min-h-16 flex-1 items-center justify-between bg-white px-8 py-2"
    bind:clientHeight={elHeight}
>
    <section class="flex items-center space-x-4">
        <h3>Tabs</h3>

        <button
            type="button"
            class="rounded-full p-2 hover:bg-zinc-100"
            onclick={() => tabsContext.addTab()}
        >
            <span class="sr-only">Add Tab</span>
            <Plus size="20" />
        </button>
        <ol class="flex items-center space-x-4">
            {#each tabsContext.getTabs() as tab (tab.id)}
                <li
                    transition:fade={{ duration: 300 }}
                    class={[
                        'relative rounded transition-all duration-200',
                        tabsContext.isSelected(tab.id) &&
                            'border-t-[3px] border-green-500'
                    ]}
                >
                    <TabsContextMenu {tab} />
                </li>
            {/each}
        </ol>
    </section>
    <!--<p>&copy; 2025 Levchenko Artem</p>-->
</footer>
