import { createSkyCylinder, createGrid, createAxis, createVector } from "./models.js";
import { setupWebGL, setupMatrix, drawInCanvas } from "./util.js";
import { initShaderProgram } from "./shader.js";
import { Matrix4x4 } from '../LA/matrix4x4.js';
import { Vector3 } from "../LA/vector3.js";



const canvas = document.querySelector("div canvas.game");
const gl = canvas.getContext("webgl2");

if (!gl)
    throw new Error("WebGL2 not supported by your browser.");



// * keep info about the canvas
const screen = {
    width: 0,
    height: 0,

    aspectRatio: 1,

    recalcCanvasSize() {
        screen.width = canvas.clientWidth;
        screen.height = canvas.clientHeight;

        if (screen.width === canvas.width && screen.height === canvas.height) return;

        screen.aspectRatio = screen.width / screen.height;

        canvas.width = screen.width;
        canvas.height = screen.height;
        
        gl.viewport(0, 0, screen.width, screen.height)
    },
}

// * keep info about the view camera
const view = {
    angleX: Math.PI / 4,
    angleY: Math.PI / 4,

    zoomLevel: 5,
    minZoom: 2,
    maxZoom: 10,

    rotationMatrix: Matrix4x4.identity,
    positionMatrix: Matrix4x4.identity,

    zoom(zoomFactor) {
        this.zoomLevel *= zoomFactor;
        this.zoomLevel = Math.min(Math.max(this.zoomLevel, this.minZoom), this.maxZoom);


        this.positionMatrix = Matrix4x4.translation(0, 0, -this.zoomLevel);
    },

    rotate(xOffset, yOffset) {
        this.angleX += xOffset;
        this.angleY += yOffset;

        this.angleX = Math.min(Math.max(this.angleX, -Math.PI/2), Math.PI/2);

        this.rotationMatrix = Matrix4x4.applyAll(
            Matrix4x4.rotationX(this.angleX),
            Matrix4x4.rotationY(this.angleY),
        );

    },

    getMatrix(){
        return Matrix4x4.applyAll(
            this.positionMatrix,
            this.rotationMatrix,
        );
    }
}
// just to set the initial values in matrixes
view.zoom(1);
view.rotate(0, 0);



const shaderProgram = initShaderProgram(gl);



const programInfo = {
    program: shaderProgram,
    attribs: [
        {
            name: "position",
            location: gl.getAttribLocation(shaderProgram, "aPosition"),
            size: 3,
        },
        {
            name: "color",
            location: gl.getAttribLocation(shaderProgram, "aColor"),
            size: 3,
        }
    ]
};

const activeAttributes = {};

for (const attrib of programInfo.attribs)
    activeAttributes[attrib.name] = attrib;


function drawScene() {
    screen.recalcCanvasSize();

    setupWebGL(gl, programInfo);
    gl.clear(gl.COLOR_BUFFER_BIT);

    setupMatrix(
        gl,
        "uModelToWorld",
        Matrix4x4.applyAll(
            Matrix4x4.scale(1, 1, 1),
        )
    );
    
    updateCameraView();

    setupMatrix(
        gl,
        "uViewToProj",
        Matrix4x4.perspective(50 * Math.PI/180, screen.aspectRatio, 0.01, 100)
    );
    
    const gridSize = 10.0;
    const gridDivisions = 10;
    const axisSize = 1;

    drawInCanvas(gl, createSkyCylinder(
        15, 10, 32,
        [0.11, 0.06, 0.11],
        [0.45, 0.45, 0.57],
    ));
    
    drawInCanvas(gl, createGrid(gridSize, gridDivisions),
    {
        attribs: [
            activeAttributes.position
        ],
        genericAttribs: [
            {
                attrib: activeAttributes.color,
                value: new Float32Array([1, 1, 1]),
            }
        ]
    });

    drawInCanvas(gl, createAxis(axisSize));
    
    drawInCanvas(gl, createVector(new Vector3(0,1,1), [1, .2, .2], .02));

}

function updateCameraView(){
    setupMatrix(gl, "uWorldToView", view.getMatrix());
}

const mouseSettings = {
    zoomFactor: (e) => {return 1.0 + 0.05 * (e.deltaY > 0 ? 1 : -1)},
    sensitivity: (e) => {return [0.01 * e.movementY,  0.01 * e.movementX]},
    dragging: false,
    x: -1,
    y: -1,
    threshold: 10,
};




function updateView(e){
    switch(e.type){
        case "wheel":
            view.zoom(mouseSettings.zoomFactor(e));
            break;
        case "mousemove":
            view.rotate(...mouseSettings.sensitivity(e));
            break;
    }

    drawScene();
}

function onCanvasScroll(e){
    updateView(e);
}
function onCanvasMouseMove(e){
    if(mouseSettings.x === -1 && mouseSettings.y === -1)
        return;

    mouseSettings.dragging =
    mouseSettings.dragging ||
    Math.hypot(
        mouseSettings.x - e.clientX,
        mouseSettings.y - e.clientY
    ) > mouseSettings.threshold;


    if(mouseSettings.dragging)
        updateView(e);
}


// update aspect ratio of canvas
window.addEventListener("resize", onCanvasScroll);

// events to make dragging work
canvas.addEventListener("mousedown", (e) => {
    mouseSettings.dragging = false;
    mouseSettings.x = e.clientX;
    mouseSettings.y = e.clientY;
});
canvas.addEventListener("mouseup", (e) => {
    mouseSettings.x = -1;
    mouseSettings.y = -1;
});

// events to update the view matrix
canvas.addEventListener("mousemove", onCanvasMouseMove);
canvas.addEventListener("wheel", onCanvasScroll, { passive: true });

drawScene();