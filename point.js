class Point extends Shape {
    constructor(position, color, size) {
        super(color, size);
        this.position = position;
    }

    render() {
        gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
        gl.uniform4f(u_FragColor, ...this.color);
        gl.uniform1f(u_Size, this.size);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}