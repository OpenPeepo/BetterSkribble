import { type } from "os";
import CanvasBrush from "./brush";
import CanvasBrushType from "./brush-type";

type StepCoords = {
    coords: [number, number]
};

type StepColor = {
    color: number
}

class CanvasAction {
    brush: CanvasBrushType;
    steps: StepData[];

    complete: boolean;

    constructor(brush: CanvasBrushType = CanvasBrushType.UNKNOWN) {
        this.brush = brush;
        this.steps = [];
        this.complete = false;
    }
}

export type StepData = StepCoords & StepColor;

export default CanvasAction;