function HEXToRGB(color) {
    // trim and remove # from color
    color = color.trim();
    color = color.replace("#", "");

    // color is not 3,4,6 or 8 chars
    if (!color.length in [3, 4, 6, 8]) return [0, 0, 0];

    let size = color.length >= 6 ? 2 : 1;

    let r,
        g,
        b,
        a = 255;

    r = parseInt(color.substring(0 * size, 1 * size), 16);
    g = parseInt(color.substring(1 * size, 2 * size), 16);
    b = parseInt(color.substring(2 * size, 3 * size), 16);
    if (color.length < 3 * size)
        a = parseInt(color.substring(4 * size, 4 * size), 16);

    return [r, g, b, a];
}

export { HEXToRGB };