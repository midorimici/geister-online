import config, { Vec } from './config';
import Piece from './piece';

export default class Draw {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private square_size: number;
    private margin: number;
    private piece_size: number;
    private piecePath: Path2D;
    private arrowPath: Path2D;

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

        this.piecePath = new Path2D();
        this.piecePath.moveTo(0, -this.piece_size/2);
        this.piecePath.lineTo(-this.piece_size/2, this.piece_size/2);
        this.piecePath.lineTo(this.piece_size/2, this.piece_size/2);
        this.piecePath.closePath();

        this.arrowPath = new Path2D();
        this.arrowPath.moveTo(this.piece_size/2, this.piece_size/2);
        this.arrowPath.lineTo(0, 0);
        this.arrowPath.lineTo(-this.piece_size/2, this.piece_size/2);
        this.arrowPath.moveTo(0, 0);
        this.arrowPath.lineTo(0, this.piece_size);
        this.arrowPath.closePath();
    }

    /** アイボリーで画面全体を塗りつぶす */
    private clearCanvas() {
        this.ctx.fillStyle = config.ivory;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /** 待機画面
     * @param obj 待機している対象。
     * 対戦者の入室または対戦者の駒配置
     */
    private waiting(obj: 'player' | 'placing') {
        this.clearCanvas();
        const canvas = this.canvas;
        const ctx = this.ctx;
        const textSize: number = canvas.width/20;
        ctx.fillStyle = config.dark;
        ctx.font = `${textSize}px Meiryo`;
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
            ctx.moveTo(...new Vec(coord).add([0, square_size*i]).val());
            ctx.lineTo(...new Vec(coord).add([square_size*col, square_size*i]).val());
        }
        for (let i: number = 0; i <= col; i++) {
            ctx.moveTo(...new Vec(coord).add([square_size*i, 0]).val());
            ctx.lineTo(...new Vec(coord).add([square_size*i, square_size*row]).val());
        }
        ctx.closePath();
        ctx.stroke();
    }

    // 駒を描く
    private piece(color: string, pos: [number, number], rev: boolean) {
        const ctx = this.ctx;
        const coord: [number, number] = new Vec(pos).mul(this.square_size)
            .add(this.margin + this.square_size/2).val();
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(...coord);
        if (rev) {
            // 相手の駒は逆転して描く
            ctx.rotate(Math.PI);
        }
        ctx.fill(this.piecePath);
        ctx.restore();
    }

    // ボタンを描く
    private button(coord: [number, number], size: [number, number],
            disabled: boolean) {
        const ctx = this.ctx;

        ctx.fillStyle = disabled ?
            'rgb(160, 140, 120)' : 'rgb(200, 180, 160)';
        ctx.fillRect(...coord, ...size);

        ctx.font = `${this.canvas.width/30}px Meiryo`;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = config.dark;
        ctx.fillText('OK',
            ...new Vec(size).div(2).add(coord).val());
        ctx.restore();
    }

    /** 駒の配置を決める画面（対戦者のみ）  
     * @param pos 位置と色の Map
     * @param disabled ボタンを押せなくする
    */
    decidePiecePlace(pos: Map<string, string>, disabled: boolean) {
        this.clearCanvas();
        const ctx = this.ctx;
        const csize = this.canvas.width;

        const textSize: number = csize/40;
        const text1: string = '駒の配置を決めてね（↓自分側　↑相手側）';
        const text2: string = 'クリック（タップ）で悪いおばけ（赤）と良いおばけ（青）を切り替えるよ';
        ctx.fillStyle = config.dark;
        ctx.font = `${textSize}px Meiryo`;
        ctx.fillText(text1, csize/30, csize/30);
        ctx.fillText(text2, csize/30, csize/30 + 2*textSize);

        const lefttop: [number, number] = [
            this.margin + this.square_size,
            this.margin + 2*this.square_size];
        this.grid(lefttop, 4, 2);
        this.button([csize*5/6, csize*5/6], [csize/8, csize/12], disabled);
        for (let [k, v] of pos.entries()) {
            let [x, y] = k.split(',')
            this.piece(v === 'R' ? config.red : config.blue,
                [+x, +y], false);
        }
    }

    /** ゲームボードと盤面上の駒を描く
     * @param boardmap 盤面データ
     * @param turn 先手後手どちら目線か。
     * 2 なら先手目線で駒色は隠さない
     * @param first 先手のプレイヤー名
     * @param second 後手のプレイヤー名
     */
    board(boardmap: Map<string, {color: 'R' | 'B', turn: 0 | 1}>,
            turn: 0 | 1 | 2, first: string, second: string) {
        this.clearCanvas();
        const ctx = this.ctx;

        // グリッド
        this.grid([this.margin, this.margin], 6, 6);

        // 角の矢印
        const padding: number = (this.square_size - this.piece_size)/2;
        const coord: [number, number] = new Vec([this.square_size/2, padding])
            .add(this.margin).val();
        ctx.save();
        ctx.translate(...coord);
        ctx.stroke(this.arrowPath);
        ctx.restore();
        ctx.save();
        ctx.translate(...new Vec(coord).add([5*this.square_size, 0]).val());
        ctx.stroke(this.arrowPath);
        ctx.restore();
        ctx.save();
        ctx.translate(...new Vec(coord)
            .add([0, 5*this.square_size + this.piece_size]).val());
        ctx.rotate(Math.PI);
        ctx.stroke(this.arrowPath);
        ctx.restore();
        ctx.save();
        ctx.translate(...new Vec(coord)
            .add([5*this.square_size,
                5*this.square_size + this.piece_size]).val());
        ctx.rotate(Math.PI);
        ctx.stroke(this.arrowPath);
        ctx.restore();

        // 駒
        for (let [pos, piece] of boardmap.entries()) {
            const pieceColor = piece.color === 'R' ? config.red : config.blue;
            const pos_ = pos.split(',').map((e: string) => +e) as [number, number];
            if (turn === 2) {
                // 観戦者は両方見える。先手目線
                this.piece(pieceColor, pos_, piece.turn === 1);
            } else if (turn === 0) {
                // 先手
                this.piece(piece.turn === 0 ? pieceColor : config.grey,
                    pos_, piece.turn === 1);
            } else {
                // 後手
                this.piece(piece.turn === 1 ? pieceColor : config.grey,
                    pos_, piece.turn === 0);
            }
        }

        // プレイヤー名
        const csize: number = this.canvas.width;
        const textSize = csize/40;
        ctx.fillStyle = config.dark;
        ctx.font = `${textSize}px Meiryo`;
        ctx.fillText(turn === 1 ? second : first, csize*3/4, csize - textSize);
        ctx.fillText(turn === 1 ? first : second, csize*3/4, textSize);
    }

    // 駒の行先を円で表示する
    dest(piece: Piece, pos: [number, number],
            boardmap: Map<string, {color: 'R' | 'B', turn: 0 | 1}>) {
        const ctx = this.ctx;
        for (let dest of piece.coveringSquares(pos)) {
            // 自分の駒の位置を除外
            if (!(boardmap.has(String(dest))
                    && boardmap.get(String(dest)).turn
                        === boardmap.get(String(pos)).turn)) {
                const coord = new Vec(dest).mul(this.square_size)
                    .add(this.margin + this.square_size/2).val();
                ctx.beginPath();
                ctx.arc(...coord, this.piece_size/2, 0, 2*Math.PI);
                ctx.fillStyle = config.safe;
                ctx.fill();
            }
        }
    }
};