import Root from './menu.svelte';
import Item from './menuItem.svelte';
import { create, get } from './context.svelte';

const context = { create, get };

export {
    Root,
    Item,
    context,
    // aliases
    Root as ContextMenu,
    Item as ContextMenuItem,
    context as contextMenuContext
};
