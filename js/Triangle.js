class Triangle {
    constructor(vertices, color, size) {
        this.vertices = vertices;
        this.color = color;
        this.size = size;
    }

    render() {
        const vertices = new Float32Array(this.vertices);
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, ...this.color);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}