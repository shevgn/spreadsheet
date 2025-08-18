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
    class="group relative inline-flex cursor-pointer rounded-full p-1 not-disabled:hover:scale-105 not-disabled:hover:bg-white md:p-2"
    onclick={onClick}
>
    {@render children?.()}
</button>
