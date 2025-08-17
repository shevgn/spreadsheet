<script lang="ts">
    import { type Snippet, tick } from 'svelte';
    import { contextMenuContext } from '.';
    import { CONTEXT_MENU_OFFSET } from './context.svelte';

    type Props = {
        trigger: Snippet;
        content?: Snippet;
        id?: string;
        offset?: number;
    };

    let {
        trigger,
        content,
        id = $bindable(crypto.randomUUID()),
        offset = $bindable(CONTEXT_MENU_OFFSET)
    }: Props = $props();

    let context = contextMenuContext.get();
    let menuEl = $state<HTMLElement | null>(null);
    let isOpen = $derived(() => context.getOpenId() === id);

    function openAt(clientX: number, clientY: number) {
        context.open(id, {
            x: clientX,
            y: clientY
        });

        tick().then(() => {
            if (menuEl) {
                context.setup(menuEl, id, offset);
            }
        });
    }

    function onContext(e: MouseEvent) {
        e.preventDefault();
        // якщо хочемо — можемо також e.stopPropagation();
        openAt(e.clientX, e.clientY);
        requestAnimationFrame(() => context.reposition());
    }

    $effect(() => {
        if (isOpen()) requestAnimationFrame(() => context.reposition());
    });
</script>

<div
    aria-label="Menu Trigger"
    role="menu"
    tabindex="-1"
    oncontextmenu={onContext}
>
    {@render trigger()}
</div>

{#if isOpen()}
    <ul
        bind:this={menuEl}
        class="z-50 min-w-[160px] rounded border border-zinc-200 bg-white p-1 text-sm shadow-md"
        style="position: fixed;"
        tabindex="-1"
        role="menu"
        aria-label="Context menu"
        onkeydown={(e) => {
            if (e.key === 'Escape') {
                context.close();
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
            }
        }}
    >
        {@render content?.()}
    </ul>
{/if}
