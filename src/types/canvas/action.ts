import CanvasBrush from "./brush";
import CanvasBrushType from "./brush-type";

class CanvasAction {
    brush: CanvasBrushType;
    positions: [number, number][];

    constructor(brush: CanvasBrushType) {
        this.brush = brush;
        this.positions = [];
    }
}

export default CanvasAction;