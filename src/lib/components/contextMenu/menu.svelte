<script lang="ts">
    import { browser } from '$app/environment';
    import { clamp } from '$lib/utils';
    import { onMount, onDestroy, type Snippet } from 'svelte';
    import { contextMenuContext, ContextMenuItem } from '.';

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
        offset = $bindable(4)
    }: Props = $props();

    let context = contextMenuContext.get();
    let menuEl = $state<HTMLElement | null>(null);
    let isOpen = $derived(() => context?.getOpenId() === id);

    function openAt(clientX: number, clientY: number) {
        context.open(id, {
            x: clientX,
            y: clientY
        });
    }

    function onContext(e: MouseEvent) {
        e.preventDefault();
        // якщо хочемо — можемо також e.stopPropagation();
        openAt(e.clientX, e.clientY);
        requestAnimationFrame(() => reposition());
    }

    function reposition() {
        if (!menuEl) return;
        const rect = menuEl.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        const x = context.getPosition().x;
        const y = context.getPosition().y;
        const gap = offset;

        // reset styles
        menuEl.style.right = '';
        menuEl.style.bottom = '';

        const canShowRight = x + gap + rect.width <= innerWidth - gap;
        const canShowLeft = x - gap - rect.width >= gap;

        let left: number;
        if (canShowRight) {
            left = x + gap;
        } else if (canShowLeft) {
            left = x - gap - rect.width;
        } else {
            left = clamp(
                x + gap,
                gap,
                Math.max(gap, innerWidth - rect.width - gap)
            );
        }

        if (rect.width >= innerWidth - gap * 2) {
            left = gap;
        }

        menuEl.style.left = Math.round(left) + 'px';

        let desiredTop = y - gap;
        const minTop = gap;
        const maxTop = Math.max(gap, innerHeight - rect.height - gap);
        let top = clamp(desiredTop, minTop, maxTop);

        menuEl.style.top = Math.round(top) + 'px';
    }

    function onDocClick(e: MouseEvent) {
        if (!menuEl) return;
        if (!menuEl.contains(e.target as Node)) context.close();
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            context.close();
        }
    }

    onMount(() => {
        if (!browser) return;
        document.addEventListener('click', onDocClick);
        document.addEventListener('keydown', onKeydown);
        window.addEventListener('resize', reposition);
    });

    onDestroy(() => {
        if (!browser) return;
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onKeydown);
        window.removeEventListener('resize', reposition);
    });

    $effect(() => {
        if (isOpen()) requestAnimationFrame(() => reposition());
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
