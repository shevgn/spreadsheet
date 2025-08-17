import { getContext, setContext } from 'svelte';
import type { Tab } from './types';

class TabsContext {
    private tabs: Tab[] = $state([]);
    private selectedTabId = $state<string>();
    private readonly localStorageKey = 'sheet-tabs';

    renamingTabId = $state<string | null>(null);
    renamingValue = $state('');

    constructor() {
        this.addTab();
        this.selectedTabId = this.tabs[0].id;
    }

    getSelectedTab() {
        return this.tabs.find((tab) => tab.id === this.selectedTabId);
    }

    setSelectedTab(id: string) {
        this.selectedTabId = id;
    }

    getTabs() {
        return this.tabs;
    }

    addTab() {
        this.tabs.push({
            id: crypto.randomUUID(),
            name: 'Tab ' + (this.tabs.length + 1)
        });
    }

    isSelected(id: string) {
        return id === this.selectedTabId;
    }

    deleteTab(id: string) {
        if (this.tabs.length === 1) return;

        if (this.selectedTabId === id) {
            if (this.selectedTabId === this.tabs[0].id) {
                this.selectedTabId = this.tabs[1].id;
            } else {
                this.selectedTabId = this.tabs[0].id;
            }
        }

        this.tabs = this.tabs.filter((tab) => tab.id !== id);
    }

    updateTab(id: string, name: string) {
        this.tabs = this.tabs.map((tab) =>
            tab.id === id ? { ...tab, name } : tab
        );
    }

    startRename(id: string) {
        const tab = this.tabs.find((t) => t.id === id);
        if (!tab) return;

        this.renamingTabId = id;
        this.renamingValue = tab.name;
    }

    cancelRename() {
        this.renamingTabId = null;
        this.renamingValue = '';
    }

    commitRename() {
        const id = this.renamingTabId;
        if (!id) return;

        const name = (this.renamingValue || '').trim() || 'Untitled';
        this.updateTab(id, name);

        this.renamingTabId = null;
        this.renamingValue = '';
    }

    saveToLocalStorage() {
        localStorage.setItem(
            this.localStorageKey,
            JSON.stringify(this.tabs.map((tab) => tab.id))
        );
    }

    loadFromLocalStorage() {
        const storedTabs = localStorage.getItem(this.localStorageKey);

        if (storedTabs) {
            this.tabs = (JSON.parse(storedTabs) as string[]).map(
                (tabId) =>
                    ({
                        id: tabId,
                        name: 'Tab ' + (this.tabs.length + 1)
                    }) as Tab
            );
        }
    }
}

const TabsContextKey = Symbol('TabsContext');

export function createTabsContext() {
    const tabsContext = new TabsContext();
    return setContext(TabsContextKey, tabsContext);
}

export function getTabsContext() {
    return getContext<ReturnType<typeof createTabsContext>>(TabsContextKey);
}
