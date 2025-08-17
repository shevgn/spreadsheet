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
        <ContextMenu.Item onClick={() => tabsContext.setSelectedTab(tab.id)}>
            <span>Select</span>
        </ContextMenu.Item>
    {/snippet}
</ContextMenu.Root>
