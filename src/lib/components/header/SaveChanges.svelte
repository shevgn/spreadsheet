<script lang="ts">
    import { Check } from '@lucide/svelte';
    type Props = {
        isSaved: boolean;
        isSaving: boolean;
        saveChanges: () => void;
    };

    let { isSaved, isSaving, saveChanges }: Props = $props();
</script>

<button
    type="button"
    class="inline-flex items-center gap-2 rounded-md border-2 border-green-100 px-4 py-1 hover:bg-green-100 not-disabled:active:scale-95 disabled:opacity-60"
    onclick={saveChanges}
    disabled={isSaving || isSaved}
    aria-busy={isSaving}
    aria-live="polite"
>
    {#if isSaving}
        <svg
            class="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden={!isSaving}
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                stroke-opacity="0.25"
            ></circle>
            <path
                d="M22 12a10 10 0 00-10-10"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
            ></path>
        </svg>
        <span>Saving…</span>
    {:else if isSaved}
        <Check
            size="20"
            aria-hidden={!isSaved}
        />
        <span>Saved</span>
    {:else}
        <span class="font-medium">Save</span>
    {/if}
</button>
