import CanvasBrush from "./brush";
import CanvasBrushType from "./brush-type";

class CanvasAction {
    brush: CanvasBrushType;
    steps: [number, number][];

    complete: boolean;

    constructor(brush: CanvasBrushType = CanvasBrushType.UNKNOWN) {
        this.brush = brush;
        this.steps = [];
        this.complete = false;
    }
}

export default CanvasAction;