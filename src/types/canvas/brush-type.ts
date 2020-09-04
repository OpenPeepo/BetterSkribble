import CanvasBrush from "./brush";
import CircleFillBrush from "./brush/circle-fill-brush";

export enum CanvasBrushType {
    UNKNOWN,
    CIRCLE_FILL
}

export function getBrush(type: CanvasBrushType): CanvasBrush | null {
    switch (type) {
        case CanvasBrushType.UNKNOWN:
            return null;
        case CanvasBrushType.CIRCLE_FILL:
            return new CircleFillBrush();
    }
}

export default CanvasBrushType;