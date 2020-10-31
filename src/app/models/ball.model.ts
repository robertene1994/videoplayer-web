export class Ball {
    constructor(
        public x: number,
        public y: number,
        public vx: number,
        public vy: number,
        public radius: number) { }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        const color = context.createRadialGradient(this.x, this.y, this.radius / 10, this.x, this.y, this.radius * 1.5);
        color.addColorStop(0, '#fcb045');
        color.addColorStop(0.5, '#fd1d1d');
        color.addColorStop(1, '#fc00ff');
        context.fillStyle = color;
        context.fill();
    }
}
