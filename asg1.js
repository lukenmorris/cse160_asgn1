// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  vec2 distance = 2.0 * gl_PointCoord - 1.0;\n' +
  '  if (length(distance) > 1.0) {\n' +
  '      discard;\n' +
  '  }\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global variables
var gl;
var canvas;
var a_Position;
var u_FragColor;
var u_Size;
var shapesList = [];
var currentMode = 'point';
var currentColor = [1.0, 0.0, 0.0, 1.0];
var currentSize = 10.0;
var segments = 12;
var isDrawing = false;

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
    gl = WebGLUtils.setupWebGL(canvas, { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get WebGL context');
        return;
    }
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
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

function drawGeometricDesign() {
    // Save current settings
    const oldColor = currentColor;
    const oldSize = currentSize;
    const oldMode = currentMode;
    
    // Set color to white and adjust size
    document.getElementById('redSlider').value = 100;
    document.getElementById('greenSlider').value = 100;
    document.getElementById('blueSlider').value = 100;
    updateColor();
    currentSize = 5; // Thin lines
    
    // Switch to triangle mode
    setMode('triangle');

    // Outer diamond
    const triangleScale = 0.1;
    shapesList.push(new Triangle([
        0.0, 0.6,    // Top
        -0.6, 0.0,   // Left
        0.0, 0.0     // Center
    ], currentColor, triangleScale));

    shapesList.push(new Triangle([
        0.0, 0.6,    // Top
        0.6, 0.0,    // Right
        0.0, 0.0     // Center
    ], currentColor, triangleScale));

    shapesList.push(new Triangle([
        0.0, -0.6,   // Bottom
        -0.6, 0.0,   // Left
        0.0, 0.0     // Center
    ], currentColor, triangleScale));

    shapesList.push(new Triangle([
        0.0, -0.6,   // Bottom
        0.6, 0.0,    // Right
        0.0, 0.0     // Center
    ], currentColor, triangleScale));

    // Left "notch" triangle
    shapesList.push(new Triangle([
        -0.4, 0.2,   // Top
        -0.5, 0.0,   // Bottom left
        -0.3, 0.0    // Bottom right
    ], currentColor, triangleScale));

    // Right "notch" triangle
    shapesList.push(new Triangle([
        0.4, 0.2,    // Top
        0.3, 0.0,    // Bottom left
        0.5, 0.0     // Bottom right
    ], currentColor, triangleScale));

    // Top small triangle
    shapesList.push(new Triangle([
        0.0, 0.1,    // Top
        -0.1, -0.1,  // Bottom left
        0.1, -0.1    // Bottom right
    ], currentColor, triangleScale));

    // Center arrangement - Left triangle
    shapesList.push(new Triangle([
        -0.2, -0.2,  // Left
        -0.1, -0.3,  // Bottom
        -0.1, -0.1   // Top
    ], currentColor, triangleScale));

    // Center arrangement - Right triangle
    shapesList.push(new Triangle([
        0.2, -0.2,   // Right
        0.1, -0.3,   // Bottom
        0.1, -0.1    // Top
    ], currentColor, triangleScale));

    // Center arrangement - Top triangle
    shapesList.push(new Triangle([
        0.0, -0.1,   // Top
        -0.1, -0.2,  // Left
        0.1, -0.2    // Right
    ], currentColor, triangleScale));

    // Center arrangement - Bottom triangle
    shapesList.push(new Triangle([
        0.0, -0.3,   // Bottom
        -0.1, -0.2,  // Left
        0.1, -0.2    // Right
    ], currentColor, triangleScale));

    // Render all shapes
    renderAllShapes();

    // Restore original settings
    currentColor = oldColor;
    currentSize = oldSize;
    currentMode = oldMode;
    document.getElementById('redSlider').value = oldColor[0] * 100;
    document.getElementById('greenSlider').value = oldColor[1] * 100;
    document.getElementById('blueSlider').value = oldColor[2] * 100;
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
    const color = [
        document.getElementById('redSlider').value / 100,
        document.getElementById('greenSlider').value / 100,
        document.getElementById('blueSlider').value / 100,
        1.0
    ];

    switch (currentMode) {
        case 'point':
            shapesList.push(new Point([x, y], color, currentSize));
            break;
        case 'triangle':
            const size = currentSize / 100;
            shapesList.push(new Triangle([
                x, y + size,
                x - size, y - size,
                x + size, y - size
            ], color, currentSize));
            break;
        case 'circle':
            shapesList.push(new Circle([x, y], color, currentSize, segments));
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

function updateSize() {
    currentSize = document.getElementById('sizeSlider').value;
}

function updateColor() {
    currentColor = [
        document.getElementById('redSlider').value / 100,
        document.getElementById('greenSlider').value / 100,
        document.getElementById('blueSlider').value / 100,
        1.0
    ];
}

function updateSegments() {
    segments = document.getElementById('segmentsSlider').value;
}