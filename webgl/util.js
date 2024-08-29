import { Matrix4x4 } from './matrix4x4.js';


/**
 * Creates a grid of lines within a square of size [-1, -1, 0] to [1, 1, 0].
 *
 * @param {number} size - The size of the square.
 * @param {number} divisions - The number of divisions along each side of the square.
 * @return {Array} An array containing the WebGL rendering mode (LINES), an array of positions, and the number of components per group (3).
 */
function createGrid(size, divisions) {
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

    return [WebGL2RenderingContext.LINES, positions];
}


/**
 * Creates a sky cylinder with a given radius, height, and number of segments.
 * The sky cylinder is a set of two circles, one at the top and one at the bottom.
 * The color of the top circle is determined by the sky color, and the color of
 * the bottom circle is determined by the ground color.
 *
 * @param {number} radius - The radius of the cylinder.
 * @param {number} height - The height of the cylinder.
 * @param {number} segments - The number of segments to divide the circle into.
 * @param {Array<number>} skyColor - The color of the sky, in the format [r, g, b].
 * @param {Array<number>} groundColor - The color of the ground, in the format [r, g, b].
 * @return {Array} An array containing the WebGL rendering mode (TRIANGLES), an array of positions, and the number of components per group (3).
 */
function createSkyCylinder(radius, height, segments=32, groundColor=[0, 0, 0], skyColor=[1, 1, 1]) {
    const positions = [];
    const colors = [];
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
            
            positions.push(...pivot);
            colors.push(...color);
            positions.push(x1, h, z1);
            colors.push(...color);
            positions.push(x2, h, z2);
            colors.push(...color);
        }
    };



    for(let i = 0; i < segments; i++) {
        let [x1, z1] = getPos(i);
        let [x2, z2] = getPos(i + 1);
        
        positions.push(x1, +height, z1);
        colors.push(...skyColor);
        positions.push(x2, +height, z2);
        colors.push(...skyColor);
        positions.push(x2, -height, z2);
        colors.push(...groundColor);

        positions.push(x1, +height, z1);
        colors.push(...skyColor);
        positions.push(x2, -height, z2);
        colors.push(...groundColor);
        positions.push(x1, -height, z1);
        colors.push(...groundColor);
    }





    
    CylinderCircle(+height, skyColor);
    CylinderCircle(-height, groundColor);

            
    positions.push(...colors);
    return [WebGL2RenderingContext.TRIANGLES, new Float32Array(positions)];
}


let programInfo;
/**
 * Sets up the WebGL context with the given program information.
 *
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {object} _programInfo - An object containing the program and attribute locations.
 */
function setupWebGL(gl, _programInfo) {
    gl.useProgram(_programInfo.program);
    
    programInfo = _programInfo;
}



/**
 * Sets up a matrix for use in a WebGL program.
 *
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {string} name - The name of the matrix to set up.
 * @param {Matrix4x4|Array|Float32Array} matrix - The matrix data to set up.
 * @param {boolean} [transpose=false] - Whether to transpose the matrix.
 * @return {number} -1 on failure, otherwise undefined.
 */
function setupMatrix(gl, name, matrix, transpose = false) {
    if(matrix instanceof Matrix4x4)
        matrix = matrix.getData();
    if(matrix instanceof Array)
        matrix = new Float32Array(matrix);

    if (matrix instanceof Float32Array === false)
    {
        console.error("Failed to create Float32Array from " + matrix);
        console.error(matrix);
        return -1;
    }



    let program = gl.getParameter(gl.CURRENT_PROGRAM)
    let matrixRef = gl.getUniformLocation(program, name);

    if (!matrixRef)
    {
        console.error("Failed to get the storage location of " + name);
        return -1;
    }

    gl.uniformMatrix4fv(matrixRef, transpose, matrix);
}




function setDefaultAttrib(gl, dimension, location, data) {
    if(dimension == 4)
        gl.vertexAttrib4fv(location, data);
    else if(dimension == 3)
        gl.vertexAttrib3fv(location, data);
    else if(dimension == 2)
        gl.vertexAttrib2fv(location, data);
    else
        gl.vertexAttrib1fv(location, data);
}

/**
 * Draws an object in the WebGL canvas.
 *
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {Array} object_info - An array containing the draw type and all vertices data.
 * @param {Object} [attribs=null] - A dictionary mapping attribute names to their locations in the program. If not provided, all attributes will be enabled.
 * @param {number} [type=WebGL2RenderingContext.STATIC_DRAW] - The type of buffer data to store.
 * @return {undefined}
 */
function drawInCanvas(gl, object_info, attribSettings=null, type = WebGL2RenderingContext.STATIC_DRAW) {
    const [ drawType, bufferValues ] = object_info;
    const bufferPointer = gl.createBuffer();

    let attribs;
    let genericAttribs;

    if(attribSettings == null)
        attribSettings = {};
    
    attribs        = attribSettings.attribs        ?? programInfo.attribs;
    genericAttribs = attribSettings.genericAttribs ?? [];

    
    
    attribSettings.vertexSize = 0;
    for(let attrib of attribs)
        attribSettings.vertexSize += attrib.size;

    attribSettings.vertexCount = bufferValues.length / attribSettings.vertexSize;

    
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPointer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferValues), type);
    
    
    let offset = 0;
    for(let attrib of attribs){
        gl.enableVertexAttribArray(attrib.location);
        gl.vertexAttribPointer(attrib.location, attrib.size, gl.FLOAT, false,
                               0, offset * attribSettings.vertexCount * Float32Array.BYTES_PER_ELEMENT);
        offset += attrib.size;
    }


    for(let attrib of genericAttribs){
        gl.disableVertexAttribArray(attrib.attrib.location);
        setDefaultAttrib(gl, attrib.attrib.size, attrib.attrib.location, attrib.value);
    }

    gl.drawArrays(drawType, bufferPointer, attribSettings.vertexCount);
}




export { createGrid, createSkyCylinder, setupWebGL, setupMatrix, drawInCanvas };