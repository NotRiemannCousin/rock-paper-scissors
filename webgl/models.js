// memoization
const models = {}

/**
 * Breaks an array of properties into multiple arrays of the same size.
 * Given an array of properties and an array of sizes, it will return an array
 * of arrays, where each inner array is a subset of the original array
 * of properties. The length of each inner array is the same as the sizes array.
 *
 * @param {Array} props - The array of properties to chunk.
 * @param {number[]} sizes - The array of sizes to chunk the array into.
 * @return {Array[]} - An array of arrays, where each inner array is a subset
 *                     of the original array of properties.
 */
function chunkBy(props, sizes) {
    const results = [];
    for (let i = 0; i < sizes.length; i++)
        results.push([]);

    let i = 0;
    while (i < props.length) {
        for(const [j, size] of sizes.entries()) {
            results[j].push(...props.slice(i, i + size));
            i += size;
        }
    }

   return results;
}




/**
 * Creates a sky cylinder model.
 *
 * @param {number} radius - The radius of the cylinder.
 * @param {number} height - The height of the cylinder.
 * @param {number} [segments=32] - The number of segments in the cylinder.
 * @param {number[]} groundColor - The color of the ground.
 * @param {number[]} skyColor - The color of the sky.
 * @param {boolean} [forceUpdate=false] - Whether to force update the model.
 * @return {[WebGL2RenderingContext.TRIANGLES, Float32Array]} An array containing the WebGL rendering mode (TRIANGLES), and an array of positions.
 */
function createSkyCylinder(radius, height, segments=32, groundColor=[0, 0, 0], skyColor=[1, 1, 1], forceUpdate=false) {
    const key = `sky-cylinder-${radius}-${height}-${segments}-${groundColor}-${skyColor}`;

    if(key in models && !forceUpdate)
        return models[key];

    const positions = [];
    const colors = [];

    const vertexSizes = [3, 3];
    const step = 2 * Math.PI / segments;
    

    const getPos = (i) =>
    {
        return [
            radius * Math.cos(i * step),
            radius * Math.sin(i * step)
        ];
    };

    const CylinderCircle = (h, color) =>
    {
        const pivot = [radius, h, 0];

        for (let i = 1; i < segments - 1; i++) {
            let [x1, z1] = getPos(i);
            let [x2, z2] = getPos(i + 1);
            
            const [_pos, _col] = chunkBy(
                [
                     ...pivot,      ...color,
                    x1, h, z1,      ...color,
                    x2, h, z2,      ...color,
                ]
                , [3, 3]);

            positions.push(..._pos);
            colors.push(..._col);
        }
    };


    for(let i = 0; i < segments; i++) {
        let [x1, z1] = getPos(i);
        let [x2, z2] = getPos(i + 1);
        
        const [pos1, col1] = chunkBy(
            [
                x1, -height, z1,    ...groundColor,
                x2, -height, z2,    ...groundColor,
                x2, +height, z2,    ...skyColor,
            ], vertexSizes
        );

        const [pos2, col2] = chunkBy(
            [
                x1, +height, z1,    ...skyColor,
                x2, +height, z2,    ...skyColor,
                x1, -height, z1,    ...groundColor,
            ], vertexSizes
        );
        positions.push(...pos1, ...pos2);
        colors.push(...col1, ...col2);
    }
    
    CylinderCircle(+height, skyColor);
    CylinderCircle(-height, groundColor);

    positions.push(...colors);

    models[key] = [WebGL2RenderingContext.TRIANGLES, new Float32Array(positions)];

    return models[key];
}


/**
 * Creates a grid model with the given size and number of divisions.
 * @param {number} size - The size of the grid.
 * @param {number} divisions - The number of divisions in the grid.
 * @param {boolean} [forceUpdate=false] - If true, will recreate the model even if it is already stored in the model cache.
 * @return {[WebGL2RenderingContext.LINES, Float32Array]} - An array containing the WebGL rendering mode (LINES), and an array of positions.
 */
function createGrid(size, divisions, forceUpdate=false) {
    const key = `grid-${size}-${divisions}`;

    
    if(key in models && !forceUpdate)
        return models[key];

    const positions = [];
    const step = size / divisions;
    const halfSize = size / 2;
    

    for (let i = 0; i <= divisions; i++) {
        let x = -halfSize + i * step;
        positions.push(x, 0, -halfSize); // vertical start and point
        positions.push(x, 0, halfSize);

        positions.push(-halfSize, 0, x);
        positions.push(halfSize, 0, x); // horizontal start and point
    }

    models[key] = [WebGL2RenderingContext.LINES, positions];

    return models[key];
}


/**
 * Creates a 3D axis with a given length.
 *
 * The axis is represented by three lines, each with a different color.
 * The red line is the X axis, the green line is the Y axis, and the blue line is the Z axis.
 *
 * @param {number} [size=1] - The length of the axis.
 * @param {boolean} [forceUpdate=false] - Whether to force an update of the model.
 * @return {[WebGL2RenderingContext.LINES, Float32Array]} An array containing the WebGL rendering mode (LINES), an array of positions, and the number of components per group (3).
 */
function createAxis(size=1, forceUpdate=false) {
    const key = `axis-${size}`;
    if(key in models && !forceUpdate)
        return models[key];

    const positions = [
        0, 0, 0,
        size, 0, 0,
        0, 0, 0,
        0, size, 0,
        0, 0, 0,
        0, 0, size
    ];
    const colors = [
        1, 0, 0,
        1, 0, 0,
        0, 1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 1,
    ];


    models[key] = [WebGL2RenderingContext.LINES, positions.concat(colors)];

    return models[key];
}


function createVector(position, color, stroke, forceUpdate=false) {
    const key = `vector-${position}-${color}-${stroke}`;
    
    if(key in models && !forceUpdate)
        return models[key];

    const positions = [];


    models[key] = [WebGL2RenderingContext.TRIANGLES, positions];
    return models[key];
}



export { createSkyCylinder, createGrid, createAxis };