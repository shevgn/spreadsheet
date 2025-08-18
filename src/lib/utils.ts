import { MIN_COLS } from './components/sheet/SheetContext.svelte';

export function numberToAlphabet(num: number): string {
    const SYMBOLS_SKIP = 6;
    const CASE_DIFF = 32;

    if (num >= MIN_COLS) {
        return (
            String.fromCharCode(num + 65 - CASE_DIFF + SYMBOLS_SKIP) +
            String.fromCharCode(num + 65 - CASE_DIFF + SYMBOLS_SKIP)
        );
    }

    return String.fromCharCode(num + 65);
}

export function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
}
