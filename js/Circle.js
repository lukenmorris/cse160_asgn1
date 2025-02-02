class Circle {
    constructor(center, color, size, segments) {
        this.center = center;
        this.color = color;
        this.size = size;
        this.segments = segments;
    }

    render() {
        const vertices = [];
        const radius = this.size / 100;
        
        // Push center vertex
        vertices.push(this.center[0], this.center[1]);
        
        // Create circle vertices
        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * Math.PI * 2;
            vertices.push(
                this.center[0] + Math.cos(angle) * radius,
                this.center[1] + Math.sin(angle) * radius
            );
        }
        
        // Create and bind buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        // Set vertex attribute
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        // Set color uniform
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        
        // Draw the circle
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segments + 2);
        
        // Clean up
        gl.deleteBuffer(vertexBuffer);
    }
}