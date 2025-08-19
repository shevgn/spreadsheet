<script lang="ts">
    import { m } from '$lib/paraglide/messages';
    import { fade } from 'svelte/transition';

    type Props = {
        isSaved: boolean;
        isSaving: boolean;
    };

    let { isSaved, isSaving }: Props = $props();
</script>

{#if !isSaved && !isSaving}
    <div
        transition:fade={{ duration: 200 }}
        class="flex items-center rounded-md border-2 border-red-100 bg-gradient-to-br from-red-200 to-red-50 px-3 py-1"
        aria-live="polite"
    >
        <span class="font-medium text-red-800">{m.status_indicator()}</span>
    </div>
{/if}
