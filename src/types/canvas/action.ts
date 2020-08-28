import CanvasBrush from "./brush";
import CanvasBrushType from "./brush-type";

class CanvasAction {
    brush: CanvasBrushType;
    positions: Record<string, unknown>[];

    constructor(brush: CanvasBrushType = CanvasBrushType.UNKNOWN) {
        this.brush = brush;
        this.positions = [];
    }


}

export default CanvasAction;