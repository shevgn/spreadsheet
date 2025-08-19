<script lang="ts">
    import { getLocale, locales, setLocale } from '$lib/paraglide/runtime';
</script>

<div class="flex items-center space-x-2">
    {#each locales as locale (locale)}
        <button
            disabled={locale === getLocale()}
            class="relative inline-flex rounded-md border-2 border-transparent bg-white px-4 py-1 not-disabled:cursor-pointer not-disabled:hover:bg-zinc-100 disabled:opacity-50"
            onclick={() => setLocale(locale)}
        >
            {#if locale === getLocale()}
                <div
                    class="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-xl bg-green-600"
                ></div>
            {/if}
            {locale}
        </button>
    {/each}
</div>
