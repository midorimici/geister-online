import color from './config';

export default class Draw {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const cw: number = document.documentElement.clientWidth;
        const ch: number = document.documentElement.clientHeight;
        const min: number = cw < ch ? cw : ch;
        const cvsize: string = (0.9*min).toString();
        canvas.setAttribute('width', cvsize);
        canvas.setAttribute('height', cvsize);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    private clearCanvas() {
        this.ctx.fillStyle = color.ivory;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private waiting(obj: 'player' | 'placing') {
        this.clearCanvas();
        const canvas = this.canvas;
        const ctx = this.ctx;
        const textSize: number = canvas.width/20;
        ctx.font = `${textSize}px Meiryo`;
        ctx.fillStyle = color.dark;
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

    // 駒の配置を決める画面（対戦者のみ）
    decidePiecePlace(turn: 0 | 1) {
        this.clearCanvas();
        const ctx = this.ctx;
        const csize = this.canvas.width;
        const textSize: number = csize/40;
        const text1: string = `あなたは${turn === 0 ? '先' : '後'}手だよ。`
        const text2: string = '駒の配置を決めてね（↓自分側　↑相手側）';
        const text3: string = '左クリックで悪いおばけ（赤）、右クリックで良いおばけ（青）を配置するよ';
        ctx.fillStyle = color.dark;
        ctx.font = `bold ${textSize}px Meiryo`;
        ctx.fillText(text1, csize/30, csize/30);
        ctx.font = `${textSize}px Meiryo`;
        ctx.fillText(text2, csize/30 + 10*textSize, csize/30);
        ctx.fillText(text3, csize/30, csize/30 + 2*textSize);
    }
};