import config, { Vec } from './config';

export default class Draw {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private square_size: number;
    private margin: number;

    constructor(canvas: HTMLCanvasElement) {
        const cw: number = document.documentElement.clientWidth;
        const ch: number = document.documentElement.clientHeight;
        const min: number = cw < ch ? cw : ch;
        const cvsize: string = (0.9*min).toString();
        canvas.setAttribute('width', cvsize);
        canvas.setAttribute('height', cvsize);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.square_size = canvas.width*3/20;
        this.margin = canvas.width/20;
        this.piece_size = canvas.width/10;
    }

    // アイボリーで画面全体を塗りつぶす
    private clearCanvas() {
        this.ctx.fillStyle = config.ivory;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 待機画面
    private waiting(obj: 'player' | 'placing') {
        this.clearCanvas();
        const canvas = this.canvas;
        const ctx = this.ctx;
        const textSize: number = canvas.width/20;
        ctx.font = `${textSize}px Meiryo`;
        ctx.fillStyle = config.dark;
        if (obj === 'player') {
            ctx.fillText('対戦相手の入室を待っています...',
                canvas.width/2 - (7.5)*textSize,
                canvas.height/2);
        } else {
            ctx.fillText('対戦者が駒を配置するのを待っています...',
                canvas.width/2 - (9.5)*textSize,
                canvas.height/2);
        }
    }

    // 対戦相手の参加を待つ画面
    waitingPlayer() {
        this.waiting('player');
    }

    // 対戦者の駒配置を待つ画面（観戦者のみ）
    waitingPlacing() {
        this.waiting('placing');
    }

    // 一辺 square_size のグリッドを描く
    private grid(coord: [number, number], col: number, row: number) {
        const ctx = this.ctx;
        const square_size: number = this.square_size;
        ctx.strokeStyle = config.dark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i: number = 0; i <= row; i++) {
            ctx.moveTo(...new Vec(coord).add([0, square_size*i]));
            ctx.lineTo(...new Vec(coord).add([square_size*col, square_size*i]));
        }
        for (let i: number = 0; i <= col; i++) {
            ctx.moveTo(...new Vec(coord).add([square_size*i, 0]));
            ctx.lineTo(...new Vec(coord).add([square_size*i, square_size*row]));
        }
        ctx.closePath();
        ctx.stroke();
    }

    // 駒の配置を決める画面（対戦者のみ）
    decidePiecePlace(turn: 0 | 1) {
        this.clearCanvas();
        const ctx = this.ctx;
        const csize = this.canvas.width;
        const textSize: number = csize/40;
        const text1: string = `あなたは${turn === 0 ? '先' : '後'}手だよ。`
        const text2: string = '駒の配置を決めてね（↓自分側　↑相手側）';
        const text3: string = '左クリックで悪いおばけ（赤）、右クリックで良いおばけ（青）を配置するよ';
        ctx.fillStyle = config.dark;
        ctx.font = `bold ${textSize}px Meiryo`;
        ctx.fillText(text1, csize/30, csize/30);
        ctx.font = `${textSize}px Meiryo`;
        ctx.fillText(text2, csize/30 + 10*textSize, csize/30);
        ctx.fillText(text3, csize/30, csize/30 + 2*textSize);

        const lefttop: [number, number] = [
            this.margin + this.square_size,
            this.margin + 2*this.square_size];
        this.grid(lefttop, 4, 2);
    }
};