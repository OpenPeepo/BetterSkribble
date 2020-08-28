import CanvasBrush from "./brush";

export enum CanvasBrushType {
    UNKNOWN,
    CIRCLE_FILL
}

export function getBrush(type: CanvasBrushType): CanvasBrush {
    switch (type) {
        case CanvasBrushType.UNKNOWN:
            return null;
        case CanvasBrushType.CIRCLE_FILL:
            return new CircleFillBrush();
    }
}

export default { getBrush, CanvasBrushType };