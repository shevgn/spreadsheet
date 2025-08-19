<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    type Props = {
        onClick?: () => void;
        children?: Snippet;
        disabled?: boolean;
    } & HTMLButtonAttributes;

    let { onClick, disabled, children, ...rest }: Props = $props();
</script>

<button
    {...rest}
    aria-disabled={disabled}
    {disabled}
    type="button"
    class="not-disabled:group relative inline-flex cursor-pointer rounded-full p-1 not-disabled:hover:scale-105 not-disabled:hover:bg-white not-disabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:p-2"
    onclick={onClick}
>
    {@render children?.()}
</button>
