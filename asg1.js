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
    'uniform vec4 u_FragColor;\n' +  // uniform
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSides = 3;
let g_shapesList = [];

function main() {
    setupCanvas();
    connectVariablesToGLSL();
    addActionForHtmlUI();
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons==1) {click(ev)} }; 
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function setupCanvas(){
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL(){
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

function addActionForHtmlUI(){
    document.getElementById('clear').onclick = function() { 
        g_shapesList = []; 
        renderAllShapes(); 
    }

    document.getElementById('pointButton').onclick = function() { g_selectedType = POINT; }
    document.getElementById('triglButton').onclick = function() { g_selectedType = TRIANGLE; }
    document.getElementById('circlButton').onclick = function() { g_selectedType = CIRCLE; }

    document.getElementById('redSlide').addEventListener('mouseup', function() { 
        g_selectedColor[0] = this.value/100; 
    });
    document.getElementById('greSlide').addEventListener('mouseup', function() { 
        g_selectedColor[1] = this.value/100; 
    });
    document.getElementById('bluSlide').addEventListener('mouseup', function() { 
        g_selectedColor[2] = this.value/100; 
    });
    document.getElementById('alpSlide').addEventListener('mouseup', function() { 
        g_selectedColor[3] = this.value/100; 
    });

    document.getElementById('sizeSlide').addEventListener('mouseup', function() { 
        g_selectedSize = this.value; 
    });

    document.getElementById('sideSlide').addEventListener('mouseup', function() { 
        g_selectedSides = this.value; 
    });

    document.getElementById('drawingButton').onclick = function() { 
        drawFace(); 
    };
}

function click(ev) {
    let [x, y] = convertCoordEventToWebGL(ev);

    let point;
    if(g_selectedType == POINT){
        point = new Point();
    }
    else if(g_selectedType == TRIANGLE){
        point = new Triangle();
    }
    else{
        point = new Circle();
        point.sides = g_selectedSides;
    }

    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    renderAllShapes();
}

function convertCoordEventToWebGL(ev){
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return ([x,y]);
}

function renderAllShapes(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}

function drawFace() {
    const vertices = new Float32Array([
        // Diamond outline
        0.0, 0.8,   -0.8, 0.0,   0.8, 0.0,    // Top triangle
        -0.8, 0.0,   0.8, 0.0,   0.0, -0.8,    // Bottom triangle
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Add more triangles for eyes, nose, and mouth...
}