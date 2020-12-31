import config, { Vec } from './config';

export default class Mouse {
    private square_size: number;
    private margin: number;

    constructor(canvas: HTMLCanvasElement) {
        this.square_size = canvas.width*3/20;
        this.margin = canvas.width/20;
    }

    getWindowPos(e: MouseEvent): [number, number] {
        const rect: DOMRect = (e.target as Element).getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    }

    private chcoord(pos: [number, number]): [number, number] {
        return new Vec(pos)
            .add(-this.margin).quot(this.square_size).val();
    }

    getCoord(e: MouseEvent): [number, number] {
        return this.chcoord(this.getWindowPos(e));
    }

    onArea(x: number, y: number,
            left: number, top: number, w: number, h: number): boolean {
        return left <= x && x <= left+w && top <= y&& y <= top+h;
    }
}