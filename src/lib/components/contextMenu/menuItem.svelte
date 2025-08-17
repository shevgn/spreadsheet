<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    type Props = {
        onClick?: () => void;
    } & HTMLButtonAttributes;

    let { onClick, children }: Props = $props();
</script>

<li>
    <button
        class="w-full rounded px-2 py-1 text-left hover:bg-zinc-100"
        data-action="close"
        onclick={() => {
            onClick?.();
        }}
        role="menuitem"
        tabindex="-1"
    >
        {@render children?.()}
    </button>
</li>
