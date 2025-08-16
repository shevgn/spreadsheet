<script lang="ts">
    import { Plus } from '@lucide/svelte';

    type Props = {
        elHeight: number;
    };

    let { elHeight = $bindable() }: Props = $props();
</script>

<footer
    class="flex min-h-14 flex-1 items-center justify-between bg-white px-8 py-2"
    bind:clientHeight={elHeight}
>
    <section class="flex items-center space-x-4">
        <h3>Tabs</h3>

        <button
            type="button"
            class="rounded-full p-2 hover:bg-zinc-100"
        >
            <span class="sr-only">Tab 1</span>
            <Plus size="20" />
        </button>
    </section>
    <p>&copy; 2025 Levchenko Artem</p>
</footer>
