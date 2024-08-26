import { HEXToRGB } from "./util.js";

// Get the canvas and initialize the WebGL2 context
const canvas = document.querySelector("div canvas.game");

const gl = canvas.getContext("webgl2");
if (!gl) {
    console.error("WebGL2 not supported by your browser.");
}

// width of canvas
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

gl.viewport(0, 0, canvas.width, canvas.height);
// Vertex shader program
const vsSource = `#version 300 es
in vec2 aPosition;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

// Fragment shader program
const fsSource = `#version 300 es
precision mediump float;
out vec4 color;
void main() {
    color = vec4(1.0, 1.0, 1.0, 1.0); // White color
}`;

// Initialize a shader program
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

// Creates a shader of the given type, uploads the source and compiles it
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

const shaderProgram = initShaderProgram(gl);

// Collect all the info needed to use the shader program.
const programInfo = {
    program: shaderProgram,
    attribLocations: {
        position: gl.getAttribLocation(shaderProgram, "aPosition"),
    },
};

// Define the positions for the grid lines
function createGrid(size, divisions) {
    const positions = [];
    const step = size / divisions;
    const halfSize = size / 2;

    for (let i = 0; i <= divisions; i++) {
        const x = -halfSize + i * step;
        positions.push(x, -halfSize, x, halfSize); // Vertical lines
        positions.push(-halfSize, x, halfSize, x); // Horizontal lines
    }

    return positions;
}

const gridSize = 1.0;
const gridDivisions = 10;
const positions = createGrid(gridSize, gridDivisions);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

function drawScene(gl, programInfo) {
    const backColor = HEXToRGB(
        getComputedStyle(document.body)
            .getPropertyValue("--game-background-color")
        ).map((v) => v / 255);
    gl.clearColor(...backColor);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
        programInfo.attribLocations.position,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.position);

    const vertexCount = positions.length / numComponents;
    gl.drawArrays(gl.LINES, 0, vertexCount);
}

drawScene(gl, programInfo);
