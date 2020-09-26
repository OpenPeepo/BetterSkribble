abstract class CanvasBrush {
    /*redrawOnly: boolean;

    constructor(completeOnly: boolean) {
        this.redrawOnly = completeOnly;
    }*/

    abstract draw(ctx: CanvasRenderingContext2D, drawSteps: [number, number][]): void;

    protected drawPixel(imageData: ImageData, x: number, y: number, rgba: number): void {
        const width = imageData.width;

        const red = (rgba & 0xFF000000) >> 6;
        const green = (rgba & 0x00FF0000) >> 4;
        const blue = (rgba & 0x0000FF00) >> 2;
        const alpha = (rgba & 0x000000FF);

        const posIndex = (x + y * width) * 4;
        imageData.data[posIndex] = red;
        imageData.data[posIndex + 1] = green;
        imageData.data[posIndex + 2] = blue;
        imageData.data[posIndex + 3] = alpha;
        return;
    }
}


export default CanvasBrush;