import CanvasBrush from "../brush";

class CircleFillBrush extends CanvasBrush {
    draw(ctx: CanvasRenderingContext2D, drawSteps: [number, number][]): void {
        throw new Error("Method not implemented.");
    }
}

export default CircleFillBrush;