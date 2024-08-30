import { Matrix4x4 } from '../LA/matrix4x4.js';

let programInfo;
/**
 * Sets up the WebGL context with the given program information.
 *
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {object} _programInfo - An object containing the program and attribute locations.
 */
function setupWebGL(gl, _programInfo) {
    gl.useProgram(_programInfo.program);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

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


export { setupWebGL, setupMatrix, drawInCanvas };