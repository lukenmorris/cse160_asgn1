// Base Shape class
class Shape {
    constructor(color, size) {
        this.color = color;
        this.size = size;
    }

    render() {
        // Abstract method to be implemented by subclasses
        throw new Error('render() must be implemented by subclass');
    }
}