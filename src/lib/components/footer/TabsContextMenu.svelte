<script lang="ts">
    import { getTabsContext } from '$lib/TabsContext.svelte';
    import * as ContextMenu from '$lib/components/contextMenu';
    import type { Tab } from '$lib/types';

    type Props = {
        tab: Tab;
    };

    let { tab }: Props = $props();

    let tabsContext = getTabsContext();
</script>

<ContextMenu.Root>
    {#snippet trigger()}
        <button
            type="button"
            class={[
                'p-2 select-none hover:bg-zinc-100',
                tabsContext.isSelected(tab.id) ? 'rounded-b-md' : 'rounded-md'
            ]}
            onclick={() => tabsContext.setSelectedTab(tab.id)}
        >
            <span>{tab.name}</span>
        </button>
    {/snippet}
    {#snippet content()}
        <ContextMenu.Item
            disabled={tabsContext.isSelected(tab.id)}
            onClick={() => tabsContext.setSelectedTab(tab.id)}
        >
            {#if tabsContext.isSelected(tab.id)}
                <span>Selected</span>
            {:else}
                <span>Select</span>
            {/if}
        </ContextMenu.Item>
        <ContextMenu.Item onClick={() => tabsContext.deleteTab(tab.id)}>
            <span class="text-red-600">Delete</span>
        </ContextMenu.Item>
    {/snippet}
</ContextMenu.Root>
