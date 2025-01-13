class Circle extends Shape {
    constructor(center, color, size, segments) {
        super(color, size);
        this.center = center;
        this.segments = segments;
    }

    render() {
        const vertices = [];
        for (let i = 0; i <= this.segments; i++) {
            const angle = (i / this.segments) * Math.PI * 2;
            vertices.push(
                this.center[0],
                this.center[1],
                this.center[0] + Math.cos(angle) * (this.size / 200),
                this.center[1] + Math.sin(angle) * (this.size / 200)
            );
        }
        
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(u_FragColor, ...this.color);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segments + 2);
    }
}