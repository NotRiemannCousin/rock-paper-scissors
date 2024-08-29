// Vertex shader code
const vsSource =
`#version 300 es
in vec3 aPosition;
in vec3 aColor;

uniform mat4 uModelToWorld;
uniform mat4 uWorldToView;
uniform mat4 uViewToProj;

out vec3 vVertexColor;

void main() {
    vVertexColor = aColor;
    gl_Position = vec4(aPosition, 1.0) * uModelToWorld * uWorldToView * uViewToProj;
}`;

// Fragment shader code
const fsSource =
`#version 300 es
precision mediump float;
in vec3 vVertexColor;

out vec4 oColor;

void main() {
    oColor = vec4(vVertexColor, 1.0); // White color
}`;


/**
 * Initializes a shader program by creating and linking a vertex and fragment shader.
 *
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @return {WebGLProgram|null} The initialized shader program, or null if initialization fails.
 */
function initShaderProgram(gl) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(
            "Unable to initialize the shader program:",
            gl.getProgramInfoLog(shaderProgram)
        );
        return null;
    }

    return shaderProgram;
}


/**
 * Creates a shader of the given type, uploads the source and compiles it.
 *
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {number} type - The type of shader to create (e.g. gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
 * @param {string} source - The source code of the shader.
 * @return {WebGLShader|null} The compiled shader, or null if compilation fails.
 */
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
            "An error occurred compiling the shaders:",
            gl.getShaderInfoLog(shader)
        );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export { initShaderProgram }