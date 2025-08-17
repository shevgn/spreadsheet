<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { contextMenuContext } from '.';
    import { onMount } from 'svelte';

    type Props = {
        onClick?: () => void;
    } & HTMLButtonAttributes;

    let { onClick, children, ...rest }: Props = $props();

    let context = contextMenuContext.get();

    onMount(() => {
        if (!children) console.warn('ContextMenuItem should have chidlren.');
    });
</script>

<li>
    <button
        {...rest}
        class="w-full rounded px-2 py-1 text-left not-disabled:hover:bg-zinc-100 disabled:bg-zinc-100"
        data-action="close"
        onclick={() => {
            onClick?.();
            context.close();
        }}
        role="menuitem"
        tabindex="-1"
    >
        {@render children?.()}
    </button>
</li>
