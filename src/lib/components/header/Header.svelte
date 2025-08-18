<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import NotSavedIndicator from '$lib/components/header/NotSavedIndicator.svelte';
    import SaveChanges from '$lib/components/header/SaveChanges.svelte';

    type Props = {
        elHeight: number;
    };

    let { elHeight = $bindable() }: Props = $props();

    let isSaved = $state(false);
    let isSaving = $state(false);
    let saveError = $state<string | null>(null);
    let lastSavedAt = $state<number | null>(null);

    let now = $state<number>(Date.now());
    let nowInterval: ReturnType<typeof setInterval> | null = null;

    onMount(() => {
        nowInterval = setInterval(() => {
            now = Date.now();
        }, 1000);
    });

    onDestroy(() => {
        if (nowInterval) clearInterval(nowInterval);
    });

    // fetch here
    async function saveChanges() {
        if (isSaving) return;

        isSaving = true;
        saveError = null;

        try {
            // const res = await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
            // if (!res.ok) throw new Error('server error');

            await new Promise((r) => setTimeout(r, 1200));

            isSaved = true;
            lastSavedAt = Date.now();
        } catch (err) {
            saveError = (err as Error)?.message ?? 'Save failed';
            isSaved = false;
        } finally {
            isSaving = false;
        }
    }

    function timeAgo(ts: number | null) {
        if (!ts) return '';

        const s = Math.floor((now - ts) / 1000);
        if (s < 60) return `${s}s ago`;

        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;

        const h = Math.floor(m / 60);
        return `${h}h ago`;
    }
</script>

<header
    class="flex min-h-16 flex-1 items-center justify-between bg-white px-8 py-2"
    bind:clientHeight={elHeight}
>
    <h1 class="sr-only text-xl font-bold">Spreadsheet</h1>
    <section class="flex items-center space-x-2">
        <h3 class="sr-only">Saved status</h3>
        <NotSavedIndicator
            {isSaved}
            {isSaving}
        />

        <SaveChanges
            {isSaved}
            {isSaving}
            {saveChanges}
        />

        <div class="ml-2 text-sm text-gray-500">
            {#if saveError}
                <span class="text-red-600">Error: {saveError}</span>
            {:else if lastSavedAt}
                <span title={new Date(lastSavedAt).toLocaleString()}>
                    Saved {timeAgo(lastSavedAt)}
                </span>
            {/if}
        </div>
    </section>

    <div>
        <span>User: </span>
        <span>Artem Levchenko</span>
    </div>
</header>
