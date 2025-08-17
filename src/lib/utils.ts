export function numberToAlphabet(num: number): string {
    return String.fromCharCode(num + 65);
}

export function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
}
