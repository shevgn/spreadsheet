import { getContext, setContext } from 'svelte';

type Position = {
    x: number;
    y: number;
};

class ContextMenuContext {
    private opened = $state(false);
    private position = $state<Position>({ x: 0, y: 0 });

    constructor() {}

    getPosition() {
        return this.position;
    }

    getOpened() {
        return this.opened;
    }

    open(position: Position) {
        this.opened = true;
        this.position = position;
    }

    close() {
        this.opened = false;
        this.position = undefined;
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
