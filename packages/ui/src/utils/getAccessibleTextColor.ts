function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
}

function relativeLuminance(hex: string): number {
    const [r, g, b] = hexToRgb(hex).map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

export function getAccessibleTextColor(backgroundHex: string): "#000000" | "#ffffff" {
    const bgLuminance = relativeLuminance(backgroundHex);
    const contrastWithBlack = contrastRatio(bgLuminance, relativeLuminance("#000000"));
    const contrastWithWhite = contrastRatio(bgLuminance, relativeLuminance("#ffffff"));
    return contrastWithBlack > contrastWithWhite ? "#000000" : "#ffffff";
}
