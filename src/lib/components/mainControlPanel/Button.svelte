<script lang="ts">
    import type { Snippet } from 'svelte';

    type Props = {
        onClick?: () => void;
        children?: Snippet;
    };

    let { onClick, children }: Props = $props();
</script>

<button
    type="button"
    class="cursor-pointer rounded-full p-2 not-disabled:hover:scale-105 not-disabled:hover:bg-white"
    onclick={onClick}
>
    {@render children?.()}
</button>
