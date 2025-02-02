class Triangle {
    constructor(vertices, color, size) {
        this.vertices = vertices;
        this.color = color;
        this.size = size;
    }

    render() {
        // Create and bind buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        
        // Set vertex attribute
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        // Set color uniform
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        
        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        
        // Clean up
        gl.deleteBuffer(vertexBuffer);
    }
}