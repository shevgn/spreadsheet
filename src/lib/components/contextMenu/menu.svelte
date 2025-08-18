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

    function getMenuItems(): HTMLElement[] {
        if (!menuEl) return [];

        return Array.from(
            menuEl.querySelectorAll<HTMLElement>(
                '[role="menuitem"]:not([disabled])'
            )
        );
    }

    function focusItemAt(index: number) {
        const items = getMenuItems();
        if (!items.length) return;

        const i = ((index % items.length) + items.length) % items.length; // wrap
        items[i].focus();
    }

    function focusFirstItem() {
        focusItemAt(0);
    }

    function focusLastItem() {
        const items = getMenuItems();
        focusItemAt(items.length - 1);
    }

    function focusNextItem() {
        const items = getMenuItems();
        if (!items.length) return;

        const active = document.activeElement as HTMLElement | null;
        const idx = active ? items.indexOf(active) : -1;
        focusItemAt(idx + 1);
    }

    function focusPrevItem() {
        const items = getMenuItems();
        if (!items.length) return;

        const active = document.activeElement as HTMLElement | null;
        const idx = active ? items.indexOf(active) : 0;
        focusItemAt(idx - 1);
    }

    function activateCurrent() {
        const active = document.activeElement as HTMLElement | null;
        if (active && menuEl?.contains(active)) {
            (active as HTMLElement).click();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                focusNextItem();
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusPrevItem();
                break;
            case 'Home':
                e.preventDefault();
                focusFirstItem();
                break;
            case 'End':
                e.preventDefault();
                focusLastItem();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                activateCurrent();
                break;
            case 'Escape':
                context.close();
                break;
        }
    }

    function onFocusIn(e: FocusEvent) {
        if (!menuEl) return;
        const active = document.activeElement as HTMLElement | null;
        if (!active) return;

        if (!menuEl.contains(active)) {
            tick().then(() => {
                if (!menuEl) return;
                if (!isOpen()) return;
                focusFirstItem();
            });
        }
    }

    $effect(() => {
        if (isOpen()) {
            requestAnimationFrame(async () => {
                context.reposition();

                await tick();
                focusFirstItem();
            });

            document.addEventListener('focusin', onFocusIn);
        } else {
            document.removeEventListener('focusin', onFocusIn);
        }
    });
</script>

<div
    aria-label="Menu Trigger"
    role="button"
    tabindex="-1"
    oncontextmenu={onContext}
>
    {@render trigger()}
</div>

{#if isOpen()}
    <ul
        bind:this={menuEl}
        class="z-50 min-w-[160px] space-x-0.5 rounded border border-zinc-200 bg-white p-1 text-sm shadow-md"
        style="position: fixed;"
        tabindex="-1"
        role="menu"
        aria-label="Context menu"
        onkeydown={handleKeydown}
    >
        {@render content?.()}
    </ul>
{/if}
