// Global variables
let gl;
let canvas;
let a_Position;
let u_FragColor;
let u_Size;
let currentMode = 'point';
let shapesList = [];
let currentColor = [1.0, 0.0, 0.0, 1.0];
let currentSize = 10.0;
let segments = 12;
let isDrawing = false;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    canvas.onmousedown = handleMouseDown;
    canvas.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get WebGL context');
        return;
    }
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }
    
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    
    if (a_Position < 0 || !u_FragColor || !u_Size) {
        console.log('Failed to get storage locations');
        return;
    }
}

function handleMouseDown(ev) {
    isDrawing = true;
    const rect = ev.target.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / canvas.width) * 2 - 1;
    const y = (1 - (ev.clientY - rect.top) / canvas.height) * 2 - 1;
    addShape(x, y);
    renderAllShapes();
}

function handleMouseUp() {
    isDrawing = false;
}

function handleMouseMove(ev) {
    if (!isDrawing) return;
    const rect = ev.target.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / canvas.width) * 2 - 1;
    const y = (1 - (ev.clientY - rect.top) / canvas.height) * 2 - 1;
    addShape(x, y);
    renderAllShapes();
}

function addShape(x, y) {
    switch (currentMode) {
        case 'point':
            shapesList.push(new Point([x, y], currentColor, currentSize));
            break;
        case 'triangle':
            const size = currentSize / 100;
            shapesList.push(new Triangle([
                x, y + size,
                x - size, y - size,
                x + size, y - size
            ], currentColor, currentSize));
            break;
        case 'circle':
            shapesList.push(new Circle([x, y], currentColor, currentSize, segments));
            break;
    }
}

function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapesList.forEach(shape => shape.render());
}

function clearCanvas() {
    shapesList = [];
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function setMode(mode) {
    currentMode = mode;
}

function updateColor() {
    currentColor = [
        document.getElementById('redSlider').value / 100,
        