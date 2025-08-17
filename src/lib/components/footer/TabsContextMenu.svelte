<script lang="ts">
    import { getTabsContext } from '$lib/TabsContext.svelte';
    import * as ContextMenu from '$lib/components/contextMenu';
    import type { Tab } from '$lib/types';
    import { tick } from 'svelte';

    type Props = {
        tab: Tab;
    };

    let { tab }: Props = $props();

    let tabsContext = getTabsContext();

    function focusAndSelect(el: HTMLInputElement | null) {
        if (!el) return;

        tick().then(() => {
            try {
                el.focus();
                el.select();
            } catch {
                /* ignore */
            }
        });
    }
</script>

<ContextMenu.Root>
    {#snippet trigger()}
        {#if tabsContext.renamingTabId === tab.id}
            <input
                class="rounded border px-2 py-1"
                bind:value={tabsContext.renamingValue}
                use:focusAndSelect
                onblur={() => tabsContext.commitRename()}
                onkeydown={(e) => {
                    if (e.key === 'Enter') tabsContext.commitRename();
                    if (e.key === 'Escape') tabsContext.cancelRename();
                }}
            />
        {:else}
            <button
                type="button"
                class={[
                    'p-2 select-none hover:bg-zinc-100',
                    tabsContext.isSelected(tab.id)
                        ? 'rounded-b-md'
                        : 'rounded-md'
                ]}
                onclick={() => tabsContext.setSelectedTab(tab.id)}
            >
                <span>{tab.name}</span>
            </button>
        {/if}
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
        <ContextMenu.Item onClick={() => tabsContext.startRename(tab.id)}>
            <span>Rename</span>
        </ContextMenu.Item>
        <ContextMenu.Item onClick={() => tabsContext.deleteTab(tab.id)}>
            <span class="text-red-600">Delete</span>
        </ContextMenu.Item>
    {/snippet}
</ContextMenu.Root>
