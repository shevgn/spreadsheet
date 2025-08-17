import { browser } from '$app/environment';
import { clamp } from '$lib/utils';
import { getContext, setContext } from 'svelte';

type Pos = {
    x: number;
    y: number;
};

export const CONTEXT_MENU_OFFSET = 4;

class ContextMenuContext {
    private openId = $state<string | null>(null);
    private menuEl = $state<HTMLElement | null>(null);
    private position = $state<Pos>({ x: 0, y: 0 });
    private offset = $state<number>(CONTEXT_MENU_OFFSET);

    private _onDocClick: ((e: MouseEvent) => void) | null = null;
    private _onResize: (() => void) | null = null;
    private listenersAttached = $state(false);

    lastActiveElement = $state<HTMLElement | null>(null);

    constructor() {
        if (!browser) return;
        this.setupEventListeners();
    }

    isOpen(id: string) {
        return this.openId === id && this.menuEl !== null;
    }

    getPosition() {
        return this.position;
    }

    getOpenId() {
        return this.openId;
    }

    getMenuEl() {
        return this.menuEl;
    }

    open(id: string, pos: Pos, triggerEl?: HTMLElement | null) {
        this.lastActiveElement =
            (document.activeElement as HTMLElement) ?? null;

        this.openId = id;
        this.position = pos;
        if (triggerEl) {
            // optional: save triggerEl if needed
        }
    }

    close() {
        this.openId = null;
        this.menuEl = null;
        this.position = { x: 0, y: 0 };
        if (this.lastActiveElement) {
            try {
                this.lastActiveElement.focus();
            } catch (e) {
                console.warn(
                    'Could not focus on last active element. Error:',
                    e
                );
            }
        }
        this.lastActiveElement = null;
    }

    setup(menuEl: HTMLElement, id: string, offset: number) {
        if (this.openId !== id) {
            this.menuEl = null;
            return;
        }

        this.menuEl = menuEl;
        this.offset = offset;
    }

    setupEventListeners() {
        if (this.listenersAttached) return;
        this._onDocClick = (e: MouseEvent) => this.onDocClick(e);
        this._onResize = () => this.reposition();

        document.addEventListener('click', this._onDocClick);
        window.addEventListener('resize', this._onResize);

        // window.addEventListener('scroll', this._onResize, { passive: true });

        this.listenersAttached = true;
    }

    teardownEventListeners() {
        if (!this.listenersAttached) return;
        if (this._onDocClick)
            document.removeEventListener('click', this._onDocClick);
        if (this._onResize)
            window.removeEventListener('resize', this._onResize);

        // якщо ви додавали scroll, видаліть його теж
        this._onDocClick = null;
        this._onResize = null;
        this.listenersAttached = false;
    }

    reposition() {
        if (!this.menuEl) return;

        const rect = this.menuEl.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        const x = this.position.x;
        const y = this.position.y;

        // reset styles
        this.menuEl.style.right = '';
        this.menuEl.style.bottom = '';

        const canShowRight =
            x + this.offset + rect.width <= innerWidth - this.offset;
        const canShowLeft = x - this.offset - rect.width >= this.offset;

        let left: number;
        if (canShowRight) {
            left = x + this.offset;
        } else if (canShowLeft) {
            left = x - this.offset - rect.width;
        } else {
            left = clamp(
                x + this.offset,
                this.offset,
                Math.max(this.offset, innerWidth - rect.width - this.offset)
            );
        }

        if (rect.width >= innerWidth - this.offset * 2) {
            left = this.offset;
        }

        this.menuEl.style.left = Math.round(left) + 'px';

        const top = clamp(
            /* desired */ y - this.offset,
            /* min */ this.offset,
            /* max */ Math.max(
                this.offset,
                innerHeight - rect.height - this.offset
            )
        );

        this.menuEl.style.top = Math.round(top) + 'px';
    }

    onDocClick(e: MouseEvent) {
        if (!this.menuEl) return;
        if (!this.menuEl.contains(e.target as Node)) {
            this.close();
        }
    }
}

const ContextMenuContextKey = Symbol('ContextMenuContext');

export function createContextMenuContext() {
    const contextMenuContext = new ContextMenuContext();
    return setContext(ContextMenuContextKey, contextMenuContext);
}

export function getContextMenuContext() {
    return getContext<ReturnType<typeof createContextMenuContext>>(
        ContextMenuContextKey
    );
}

export { createContextMenuContext as create, getContextMenuContext as get };
