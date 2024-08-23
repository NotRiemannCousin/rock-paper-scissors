const canvasGame = document.querySelector("div canvas.game");
const ctx = canvasGame.getContext("webgl2");

var gridBuffer;

function HEXToRGB(color) {
    // trim and remove # from color
    color = color.trim();
    color = color.replace("#", "");

    // color is not 3,4,6 or 8 chars
    if (!color.length in [3, 4, 6, 8]) return [0, 0, 0];

    size = color.length >= 6 ? 2 : 1;

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

function createShader(glsl, type, source) {
    const shader = glsl.createShader(type);
    glsl.shaderSource(shader, source);
    glsl.compileShader(shader);
    const success = glsl.getShaderParameter(shader, glsl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(glsl.getShaderInfoLog(shader));
    glsl.deleteShader(shader);
}

function createProgram(glsl, vertShader, fragShader) {
    const program = glsl.createProgram();
    glsl.attachShader(program, vertShader);
    glsl.attachShader(program, fragShader);
    glsl.linkProgram(program);
    const success = glsl.getProgramParameter(program, glsl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(glsl.getProgramInfoLog(program));
    glsl.deleteProgram(program);
}

function initBuffers(ctx, max = 5) {
    gridBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, gridBuffer);

    // vertices = [];
    vertices = [0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0];

    // for (let i = 1; i < max; i++) {
    //     vertices.push(i, 0, max);
    //     vertices.push(i, 0, -max);
        
    //     vertices.push(-i, 0, max);
    //     vertices.push(-i, 0, -max);

    //     vertices.push(max, 0, i);
    //     vertices.push(-max, 0, i);

    //     vertices.push(max, 0, -i);
    //     vertices.push(-max, 0, -i);
    // }

    ctx.bufferData(
        ctx.ARRAY_BUFFER,
        new Float32Array(vertices),
        ctx.STATIC_DRAW
    );
    gridBuffer.itemSize = 3;
    gridBuffer.numberOfItems = vertices.length / 3;
}

async function main() {
    ctx.viewportWidth = canvasGame.width;
    ctx.viewportHeight = canvasGame.height;

    // canvasGame.addEventListener("resize", () => {
    //     width = canvasGame.width;
    //     height = canvasGame.height;

    //     if (window.devicePixelRatio > 1) {
    //         canvas.width = canvas.clientWidth * 2;
    //         canvas.height = canvas.clientHeight * 2;
    //         ctx.scale(2, 2);
    //     } else {
    //         canvas.width = width;
    //         canvas.height = height;
    //     }
    // });

    // get the --game-background-color var from css
    gameBackgroundColor = getComputedStyle(document.body).getPropertyValue(
        "--game-background-color"
    );
    gameBackgroundColor = HEXToRGB(gameBackgroundColor).map((v) => v / 255);
    // viewport

    const vertShaderSource = await fetch("view.vert").then((res) => res.text());
    const fragShaderSource = await fetch("view.frag").then((res) => res.text());

    const vertShader = createShader(ctx, ctx.VERTEX_SHADER, vertShaderSource);
    const fragShader = createShader(ctx, ctx.FRAGMENT_SHADER, fragShaderSource);

    const program = createProgram(ctx, vertShader, fragShader);

    initBuffers(ctx);

    var mvMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var pMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
    ctx.clearColor(...gameBackgroundColor);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    // mat4.perspective(
    //     45,
    //     ctx.viewportWidth / ctx.viewportHeight,
    //     0.1,
    //     100.0,
    //     pMatrix
    // );

    // mat4.identity(mvMatrix);
    // mat4.translate(mvMatrix, [0, 0, -5]);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, gridBuffer);
    ctx.vertexAttribPointer(0, 3, ctx.FLOAT, false, 0, 0);

    ctx.uniformMatrix4fv(program.u_PerspLocation, false, pMatrix);
    ctx.uniformMatrix4fv(program.u_ModelViewLocation, false, mvMatrix);

    console.log(gridBuffer);
    // ctx.drawArrays(ctx.LINES, 0, gridBuffer.numItems);
    ctx.drawArrays(ctx.TRIANGLES, 0, gridBuffer.numItems);
}

main();
