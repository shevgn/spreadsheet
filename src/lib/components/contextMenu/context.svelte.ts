import { getContext, setContext } from 'svelte';

type Pos = {
    x: number;
    y: number;
};

class ContextMenuContext {
    private openId = $state<string | null>(null);
    private position = $state<Pos>({ x: 0, y: 0 });

    constructor() {}

    open(id: string, pos: Pos) {
        this.openId = id;
        this.position = pos;
    }

    close() {
        this.openId = null;
    }

    isOpen(id: string) {
        return this.openId === id;
    }

    getPosition() {
        return this.position;
    }

    getOpenId() {
        return this.openId;
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
