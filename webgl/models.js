import { Matrix4x4 } from "../LA/matrix4x4.js";
import { Vector3 } from "../LA/vector3.js";

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
 * Returns a position vector in the xz plane, given a step and an
 * angle in radians.
 *
 * @param {number} i - The index of the position to generate.
 * @param {number} step - The step size of the positions.
 * @param {number} radians - The angle in radians.
 * @return {[number, number]} A position vector in the xz plane.
 */
const getPos = (i, step, radius) =>
{
    return [
        radius * Math.cos(i * step),
        radius * Math.sin(i * step)
    ];
};


function getStep(segments){
    return 2 * Math.PI / segments;
}



/**
 * Creates a cylinder model with a base color.
 * Used only for help other models.
 *
 * @param {number} radius - The radius of the cylinder.
 * @param {number} height - The height of the cylinder.
 * @param {number} [segments=32] - The number of segments in the cylinder.
 * @return {[Float32Array]} The positions and colors of the cylinder.
 */
function baseCylinder(radius, height, segments=32) {
    const positions = [];
    const step = getStep(segments);

    for(let i = 0; i < segments; i++) {
        let [x1, z1] = getPos(i, step, radius);
        let [x2, z2] = getPos(i + 1, step, radius);
        
        positions.push(
            x1, -height, z1,
            x2, -height, z2,
            x2, +height, z2,

            x2, +height, z2,
            x1, +height, z1,
            x1, -height, z1
        );
    }

    return positions;
}



/**
 * Creates a circle model with a center at (0,0,0) and a base color.
 * Used only for help other models.
 *
 * @param {number} h - The height of the circle.
 * @param {number[]} color - The color of the circle.
 * @return {[Float32Array]} The positions and colors of the circle.
 */
function baseCenterCircle(radius, segments=32,  spread=0)
{
    const positions = [];
    const pivot = [0, spread, 0];
    const step = getStep(segments);

    for (let i = 0; i < segments; i++) {
        let [x1, z1] = getPos(    i, step, radius);
        let [x2, z2] = getPos(i + 1, step, radius);
        
        positions.push(
            ...pivot,
            x1, 0, z1,
            x2, 0, z2,
        );
    }

    return positions;
};






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
    
    const circle = baseCenterCircle(radius, segments, 1);
    const circleColors = [
        ...groundColor,
        ...groundColor,
        ...groundColor,
        ...skyColor,
        ...skyColor,
        ...skyColor,
    ];



    for(let i = 0; i < circle.length; i+=9) {
        positions.push(
            circle[i+0], -height, circle[i+2],
            circle[i+3], -height, circle[i+5],
            circle[i+6], -height, circle[i+8],

            circle[i+0], +height, circle[i+2],
            circle[i+3], +height, circle[i+5],
            circle[i+6], +height, circle[i+8],
        );
        colors.push(...circleColors);
    }


    const cylinder = baseCylinder(radius, height, segments, groundColor, skyColor);
    const cylinderColors = [
        ...groundColor,
        ...groundColor,
        ...skyColor,
        ...skyColor,
        ...skyColor,
        ...groundColor,
    ]

    
    positions.push(...cylinder);
    for(let i = 0; i < cylinder.length/18; i++) {
        colors.push(...cylinderColors);
    }


    
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
        .7, 0, 0,
        .7, 0, 0,
        0, .7, 0,
        0, .7, 0,
        0, 0, .7,
        0, 0, .7,
    ];


    models[key] = [WebGL2RenderingContext.LINES, positions.concat(colors)];

    return models[key];
}


/**
 * Creates a vector model with the given position, color, and stroke.
 *
 * @param {Vector3} position - The position of the vector.
 * @param {number[]} color - The color of the vector.
 * @param {number} stroke - The stroke of the vector.
 * @param {boolean} [forceUpdate=false] - Whether to force an update of the model.
 * @return {[WebGL2RenderingContext.TRIANGLES, Float32Array]} An array containing the WebGL rendering mode (TRIANGLES), an array of positions, and the number of components per group (3).
 */
function createVector(position, color, stroke, forceUpdate=false) {
    const key = `vector-${position.toString()}-${color}-${stroke}`;

    if(key in models && !forceUpdate)
        return models[key];
    
    const mag = position.magnitude();
    const matrix = Matrix4x4.applyAll(
        Matrix4x4.rotationX(-Math.acos(position.y / mag)),
        Matrix4x4.rotationY(-Math.atan2(position.x, position.z))
    );

    const positions = [];
    const spread = .2;

    const circle = baseCenterCircle(stroke*2, 8, spread);
    const cylinder = baseCylinder(stroke, (mag-spread)/2, 8);

    for(let i = 0; i < circle.length; i += 3)
        positions.push(  circle[i],  mag + circle[i+1] - spread,   circle[i+2]);
    
    for(let i = 0; i < cylinder.length; i += 3)
        positions.push(cylinder[i], (mag-spread)/2 + cylinder[i+1], cylinder[i+2]);
    
    for(let i = 0; i < positions.length; i += 3)
        [positions[i], positions[i+1], positions[i+2]] = new Vector3(positions[i], positions[i+1], positions[i+2]).applyMatrix(matrix).toArray();



    
    
    const colors = new Array(positions.length).fill(color);
    positions.push(...colors.flat());

    models[key] = [WebGL2RenderingContext.TRIANGLES, positions];
    return models[key];
}



export { createSkyCylinder, createGrid, createAxis, createVector };