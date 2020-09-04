import CanvasBrush from "./brush";
import CanvasBrushType from "./brush-type";

class CanvasAction {
    brush: CanvasBrushType;
    steps: [number, number][];

    constructor(brush: CanvasBrushType = CanvasBrushType.UNKNOWN) {
        this.brush = brush;
        this.steps = [];
    }


}

export default CanvasAction;