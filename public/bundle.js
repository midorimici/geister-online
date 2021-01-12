/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client.ts":
/*!***********************!*\
  !*** ./src/client.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./draw */ \"./src/draw.ts\");\n/* harmony import */ var _mouse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mouse */ \"./src/mouse.ts\");\n/* harmony import */ var _piece__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./piece */ \"./src/piece.ts\");\nvar __read = (undefined && undefined.__read) || function (o, n) {\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\n    if (!m) return o;\n    var i = m.call(o), r, ar = [], e;\n    try {\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\n    }\n    catch (error) { e = { error: error }; }\n    finally {\n        try {\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\n        }\n        finally { if (e) throw e.error; }\n    }\n    return ar;\n};\nvar __spread = (undefined && undefined.__spread) || function () {\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\n    return ar;\n};\n\n\n\n// 入室～対戦相手待機\nvar draw;\n/** initCanvas を実行済か */\nvar doneInitCanvas = false;\n/** canvas 要素 */\nvar canvas = document.getElementById('canvas');\n/** canvas 横のメッセージ */\nvar gameMessage = document.getElementById('game-message');\n/** ミュートボタン */\nvar muteButton = document.getElementById('mute-icon');\n/** ミュート状態か */\nvar muted = false;\n/** 入力フォームを非表示にし、canvas などを表示する */\nvar initCanvas = function () {\n    document.getElementById('settings').style.display = 'none';\n    draw = new _draw__WEBPACK_IMPORTED_MODULE_0__.default(canvas);\n    doneInitCanvas = true;\n    document.getElementById('game-container').style.visibility = 'visible';\n};\n/** 対戦者か観戦者か */\nvar myrole;\n// フォーム取得\nvar socket = io();\nvar form = document.getElementById('form');\nform.addEventListener('submit', function (e) {\n    e.preventDefault();\n    var data = new FormData(form);\n    var info = {\n        roomId: data.get('room'),\n        role: data.get('role'),\n        name: data.get('username') === ''\n            ? '名無し' : data.get('username'),\n    };\n    myrole = info.role;\n    socket.emit('enter room', info);\n}, false);\n// 部屋がいっぱいだったとき\nsocket.on('room full', /** @param id 部屋番号 */ function (id) {\n    var p = document.getElementById('message');\n    p.innerText = \"\\u30EB\\u30FC\\u30E0 \" + id + \" \\u306F\\u3044\\u3063\\u3071\\u3044\\u3067\\u3059\\u3002\\u5BFE\\u6226\\u8005\\u3068\\u3057\\u3066\\u53C2\\u52A0\\u3059\\u308B\\u3053\\u3068\\u306F\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002\";\n});\n// 空室を観戦しようとしたとき\nsocket.on('no room', /** @param id 部屋番号 */ function (id) {\n    var p = document.getElementById('message');\n    p.innerText = \"\\u30EB\\u30FC\\u30E0 \" + id + \" \\u3067\\u306F\\u5BFE\\u6226\\u304C\\u884C\\u308F\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002\";\n});\n// 対戦相手を待っているとき\nsocket.on('wait opponent', function () {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    draw.waitingPlayer();\n});\n// 駒配置\n/** 位置と色の Map */\nvar posmap = new Map();\nfor (var i = 1; i <= 4; i++) {\n    for (var j = 2; j <= 3; j++) {\n        posmap.set(i + \",\" + j, 'R');\n    }\n}\nvar mouse;\n/**\n * 音声を再生する\n * @param file ファイル名。拡張子除く\n */\nvar snd = function (file) {\n    new Audio(\"./static/sounds/\" + file + \".wav\").play();\n};\n// 駒を配置する処理\nsocket.on('place pieces', function () {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    var csize = canvas.width;\n    /** 赤と青が同数ずつあるか */\n    var satisfied = false;\n    //const selectSnd = new Audio('./static/sounds/select.wav');\n    /**\n     * 赤と青が同数ずつあるかチェックする\n     * @param colors 色のリスト\n     */\n    var checkColor = function (colors) {\n        return (colors.filter(function (color) { return color === 'R'; })).length\n            === (colors.filter(function (color) { return color === 'B'; })).length;\n    };\n    /** 画面を描画する */\n    var drawDisp = function () {\n        draw.decidePiecePlace(posmap, !satisfied);\n    };\n    drawDisp();\n    // マウスイベント\n    mouse = new _mouse__WEBPACK_IMPORTED_MODULE_1__.default(canvas);\n    canvas.onclick = function (e) {\n        // 駒配置\n        for (var i = 1; i <= 4; i++) {\n            for (var j = 2; j <= 3; j++) {\n                if (String(mouse.getCoord(e)) === String([i, j])) {\n                    posmap.set(i + \",\" + j, posmap.get(i + \",\" + j) === 'R'\n                        ? 'B' : 'R');\n                    satisfied = checkColor(Array.from(posmap.values()));\n                    if (!muted)\n                        snd('select');\n                }\n            }\n        }\n        // ボタン\n        if (mouse.onArea.apply(mouse, __spread(mouse.getWindowPos(e), [csize * 5 / 6, csize * 5 / 6, csize / 8, csize / 12]))) {\n            if (satisfied) {\n                canvas.onclick = function () { };\n                socket.emit('decided place', __spread(posmap.entries()));\n                if (!muted)\n                    snd('decide');\n            }\n            else {\n                if (!muted)\n                    snd('forbid');\n            }\n        }\n        drawDisp();\n    };\n});\n// 駒の配置を待つ処理\nsocket.on('wait placing', function () {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    draw.waitingPlacing();\n});\n// ゲーム進行\n// 対戦者の処理\nsocket.on('game', \n/**\n * 対戦者側のゲーム処理\n * @param board 盤面データ\n * @param turn 自分が先手か後手か\n * @param myturn 現在自分のターンか\n * @param first 先手のプレイヤー名\n * @param second 後手のプレイヤー名\n * @param takenPieces それぞれが取った駒の色と数\n */\nfunction (board, turn, myturn, first, second, takenPieces) {\n    var boardmap = new Map(board);\n    /** 選択中の駒の位置 */\n    var selectingPos;\n    draw.board(boardmap, turn, first, second);\n    draw.takenPieces(takenPieces, turn);\n    // 手番の表示\n    // マウスイベント\n    if (myturn) {\n        gameMessage.innerText = 'あなたの番です。';\n        mouse = new _mouse__WEBPACK_IMPORTED_MODULE_1__.default(canvas);\n        canvas.onclick = function (e) {\n            var sqPos = mouse.getCoord(e);\n            if (boardmap.has(String(sqPos))\n                && boardmap.get(String(sqPos)).turn === turn) {\n                // 自分の駒を選択したとき\n                selectingPos = sqPos;\n                var pieceData = Object.values(boardmap.get(String(sqPos)));\n                var piece = new (_piece__WEBPACK_IMPORTED_MODULE_2__.default.bind.apply(_piece__WEBPACK_IMPORTED_MODULE_2__.default, __spread([void 0], pieceData)))();\n                // 行先を描画\n                draw.board(boardmap, turn, first, second);\n                draw.dest(piece, selectingPos, boardmap);\n                draw.takenPieces(takenPieces, turn);\n            }\n            else {\n                if (boardmap.has(String(selectingPos))) {\n                    var pieceData = Object.values(boardmap.get(String(selectingPos)));\n                    var piece = new (_piece__WEBPACK_IMPORTED_MODULE_2__.default.bind.apply(_piece__WEBPACK_IMPORTED_MODULE_2__.default, __spread([void 0], pieceData)))();\n                    if (piece.coveringSquares(selectingPos).some(function (e) {\n                        return String(e) === String(sqPos);\n                    })) {\n                        // 行先を選択したとき\n                        // 駒の移動\n                        boardmap.set(String(sqPos), boardmap.get(String(selectingPos)));\n                        boardmap.delete(String(selectingPos));\n                        if (!muted)\n                            snd('move');\n                        // サーバへ移動データを渡す\n                        socket.emit('move piece', turn, selectingPos, sqPos);\n                    }\n                }\n                // 盤面描画更新\n                draw.board(boardmap, turn, first, second);\n                draw.takenPieces(takenPieces, turn);\n                selectingPos = null;\n            }\n        };\n    }\n    else {\n        gameMessage.innerText = '相手の番です。';\n        canvas.onclick = function () { };\n    }\n});\n// 観戦者の処理\nsocket.on('watch', \n/**\n * 観戦者側のゲーム処理\n * @param board 盤面データ\n * @param first 先手のプレイヤー名\n * @param second 後手のプレイヤー名\n * @param turn 現在のターン\n * @param takenPieces それぞれが取った駒の色と数\n */\nfunction (board, first, second, turn, takenPieces) {\n    if (myrole === 'watch') {\n        if (!doneInitCanvas) {\n            initCanvas();\n        }\n        ;\n        var boardmap = new Map(board);\n        draw.board(boardmap, 0, first, second, true);\n        draw.takenPieces(takenPieces, 0);\n        gameMessage.innerText = (turn === 0 ? first : second) + \" \\u3055\\u3093\\u306E\\u756A\\u3067\\u3059\\u3002\";\n        if (!muted)\n            snd('move');\n    }\n});\n// 勝者が決まったとき（観戦者と先手）\nsocket.on('tell winner to audience and first', \n/** 勝者が決まったときの処理\n * @param winner 勝者のプレイヤー名\n * @param board 盤面データ\n * @param first 先手のプレイヤー名\n * @param second 後手のプレイヤー名\n * @param takenPieces それぞれが取った駒の色と数\n*/\nfunction (winner, board, first, second, takenPieces) {\n    gameMessage.innerText = winner + \" \\u306E\\u52DD\\u3061\\uFF01\";\n    if (!muted)\n        snd('win');\n    if (myrole === 'play') {\n        canvas.onclick = function () {\n            draw.board(new Map(board), 0, first, second, true);\n            draw.takenPieces(takenPieces, 0);\n            canvas.onclick = function () { };\n        };\n    }\n});\n// 勝者が決まったとき（後手）\nsocket.on('tell winner to second', \n/** 勝者が決まったときの処理\n * @param winner 勝者のプレイヤー名\n * @param board 盤面データ\n * @param first 先手のプレイヤー名\n * @param second 後手のプレイヤー名\n * @param takenPieces それぞれが取った駒の色と数\n*/\nfunction (winner, board, first, second, takenPieces) {\n    gameMessage.innerText = winner + \" \\u306E\\u52DD\\u3061\\uFF01\";\n    if (!muted)\n        snd('win');\n    canvas.onclick = function () {\n        draw.board(new Map(board), 1, first, second, true);\n        draw.takenPieces(takenPieces, 1);\n        canvas.onclick = function () { };\n    };\n});\n// 接続が切れたとき\nsocket.on('player discon', \n/** @param name 接続が切れたプレイヤー名 */ function (name) {\n    alert(name + \"\\u3055\\u3093\\u306E\\u63A5\\u7D9A\\u304C\\u5207\\u308C\\u307E\\u3057\\u305F\\u3002\");\n    location.reload();\n});\n// ミュートボタン\nmuteButton.onclick = function () {\n    muteButton.src = muted\n        ? './static/volume-mute-solid.svg'\n        : './static/volume-up-solid.svg';\n    muteButton.title = muted ? 'ミュート' : 'ミュート解除';\n    muted = !muted;\n};\n// チャット\nvar chatForm = document.getElementById('chat-form');\nvar chatInput = document.getElementById('chat-input');\nvar chatSendButton = document.getElementById('chat-send-icon');\nchatForm.addEventListener('submit', function (e) {\n    e.preventDefault();\n    if (chatInput.value) {\n        socket.emit('chat message', chatInput.value);\n        chatInput.value = '';\n    }\n});\nchatSendButton.onclick = function () {\n    if (chatInput.value) {\n        socket.emit('chat message', chatInput.value);\n        chatInput.value = '';\n    }\n};\nvar ul = document.getElementById('chat-messages');\nsocket.on('chat message', function (msg, name) {\n    var item = document.createElement('li');\n    var nameSpan = document.createElement('span');\n    var msgSpan = document.createElement('span');\n    nameSpan.className = 'chat-name';\n    nameSpan.innerText = name;\n    msgSpan.innerText = msg;\n    item.appendChild(nameSpan);\n    item.appendChild(msgSpan);\n    ul.appendChild(item);\n    ul.scrollTop = ul.scrollHeight;\n});\n\n\n//# sourceURL=webpack://geister-online/./src/client.ts?");

/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__,\n/* harmony export */   \"Vec\": () => /* binding */ Vec\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    ivory: 'rgb(240, 227, 206)',\n    dark: 'rgb(30, 30, 30)',\n    red: 'rgb(200, 0, 0)',\n    blue: 'rgb(0, 0, 200)',\n    grey: 'rgb(150, 150, 150)',\n    safe: 'rgb(121, 202, 68)'\n});\n/**\n * @classdesc 二次元ベクトルの計算を補助する\n */\nvar Vec = /** @class */ (function () {\n    /**\n     * @param v 二数の配列\n     */\n    function Vec(v) {\n        this.v = v;\n    }\n    /**\n     * Vec インスタンスから二数の配列を返す\n     */\n    Vec.prototype.val = function () {\n        return this.v;\n    };\n    /**\n     * ベクトルに加算する\n     * @param v 加算する数またはベクトル\n     */\n    Vec.prototype.add = function (v) {\n        if (Array.isArray(v)) {\n            return new Vec([v[0] + this.v[0], v[1] + this.v[1]]);\n        }\n        else {\n            return new Vec([v + this.v[0], v + this.v[1]]);\n        }\n    };\n    /**\n     * ベクトルに乗算する\n     * @param n 乗ずる数\n     */\n    Vec.prototype.mul = function (n) {\n        return new Vec([n * this.v[0], n * this.v[1]]);\n    };\n    /**\n     * ベクトルに除算する\n     * @param n 除する数\n     */\n    Vec.prototype.div = function (n) {\n        return new Vec([this.v[0] / n, this.v[1] / n]);\n    };\n    /**\n     * ベクトルに除算した商を返す\n     * @param n 除する数\n     */\n    Vec.prototype.quot = function (n) {\n        return new Vec([Math.floor(this.v[0] / n), Math.floor(this.v[1] / n)]);\n    };\n    return Vec;\n}());\n\n\n\n//# sourceURL=webpack://geister-online/./src/config.ts?");

/***/ }),

/***/ "./src/draw.ts":
/*!*********************!*\
  !*** ./src/draw.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\nvar __read = (undefined && undefined.__read) || function (o, n) {\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\n    if (!m) return o;\n    var i = m.call(o), r, ar = [], e;\n    try {\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\n    }\n    catch (error) { e = { error: error }; }\n    finally {\n        try {\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\n        }\n        finally { if (e) throw e.error; }\n    }\n    return ar;\n};\nvar __spread = (undefined && undefined.__spread) || function () {\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\n    return ar;\n};\nvar __values = (undefined && undefined.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\n\nvar Draw = /** @class */ (function () {\n    /**\n     * - canvas サイズ設定\n     * - context 作成\n     * - プロパティ定義\n     * - 駒、矢印のパス定義\n     * @param canvas canvas 要素\n     */\n    function Draw(canvas) {\n        var cw = document.documentElement.clientWidth;\n        var ch = document.documentElement.clientHeight;\n        var min = cw < ch ? cw : ch;\n        var cvsize = (0.9 * min).toString();\n        canvas.setAttribute('width', cvsize);\n        canvas.setAttribute('height', cvsize);\n        this.canvas = canvas;\n        this.ctx = canvas.getContext('2d');\n        this.squareSize = canvas.width * 3 / 20;\n        this.margin = canvas.width / 20;\n        this.pieceSize = canvas.width / 10;\n        this.piecePath = new Path2D();\n        this.piecePath.moveTo(0, -this.pieceSize / 2);\n        this.piecePath.lineTo(-this.pieceSize / 2, this.pieceSize / 2);\n        this.piecePath.lineTo(this.pieceSize / 2, this.pieceSize / 2);\n        this.piecePath.closePath();\n        this.arrowPath = new Path2D();\n        this.arrowPath.moveTo(this.pieceSize / 2, this.pieceSize / 2);\n        this.arrowPath.lineTo(0, 0);\n        this.arrowPath.lineTo(-this.pieceSize / 2, this.pieceSize / 2);\n        this.arrowPath.moveTo(0, 0);\n        this.arrowPath.lineTo(0, this.pieceSize);\n        this.arrowPath.closePath();\n    }\n    /** アイボリーで画面全体を塗りつぶす */\n    Draw.prototype.clearCanvas = function () {\n        this.ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.ivory;\n        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\n    };\n    /** 待機画面\n     * @param obj 待機している対象。\n     * 対戦者の入室または対戦者の駒配置\n     */\n    Draw.prototype.waiting = function (obj) {\n        this.clearCanvas();\n        var canvas = this.canvas;\n        var ctx = this.ctx;\n        var textSize = canvas.width / 20;\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.font = textSize + \"px Meiryo\";\n        if (obj === 'player') {\n            ctx.fillText('対戦相手の入室を待っています...', canvas.width / 2 - (7.5) * textSize, canvas.height / 2);\n        }\n        else {\n            ctx.fillText('対戦者が駒を配置するのを待っています...', canvas.width / 2 - (9.5) * textSize, canvas.height / 2);\n        }\n    };\n    /** 対戦相手の参加を待つ画面 */\n    Draw.prototype.waitingPlayer = function () {\n        this.waiting('player');\n    };\n    /** 対戦者の駒配置を待つ画面（観戦者のみ） */\n    Draw.prototype.waitingPlacing = function () {\n        this.waiting('placing');\n    };\n    /**\n     * 一辺 squareSize のグリッドを描く\n     * @param coord 左上の座標。ウィンドウ座標\n     * @param col 列数\n     * @param row 行数\n     */\n    Draw.prototype.grid = function (coord, col, row) {\n        var ctx = this.ctx;\n        var squareSize = this.squareSize;\n        ctx.strokeStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.lineWidth = 2;\n        ctx.beginPath();\n        for (var i = 0; i <= row; i++) {\n            ctx.moveTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([0, squareSize * i]).val()));\n            ctx.lineTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([squareSize * col, squareSize * i]).val()));\n        }\n        for (var i = 0; i <= col; i++) {\n            ctx.moveTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([squareSize * i, 0]).val()));\n            ctx.lineTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([squareSize * i, squareSize * row]).val()));\n        }\n        ctx.closePath();\n        ctx.stroke();\n    };\n    /**\n     * 駒を描く\n     * @param color 駒色。rgb(R, G, B) の書式\n     * @param pos 駒の位置。ゲーム内座標\n     * @param rev 上下反転して表示する\n     */\n    Draw.prototype.piece = function (color, pos, rev) {\n        var ctx = this.ctx;\n        var coord = new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(pos).mul(this.squareSize)\n            .add(this.margin + this.squareSize / 2).val();\n        ctx.save();\n        ctx.fillStyle = color;\n        ctx.translate.apply(ctx, __spread(coord));\n        if (rev) {\n            // 相手の駒は逆転して描く\n            ctx.rotate(Math.PI);\n        }\n        ctx.fill(this.piecePath);\n        ctx.restore();\n    };\n    /**\n     * ボタンを描く\n     * @param coord 位置。ウィンドウ座標\n     * @param size 幅と高さ\n     * @param disabled 押せなくする\n     */\n    Draw.prototype.button = function (coord, size, disabled) {\n        var ctx = this.ctx;\n        ctx.fillStyle = disabled ?\n            'rgb(160, 140, 120)' : 'rgb(200, 180, 160)';\n        ctx.fillRect.apply(ctx, __spread(coord, size));\n        ctx.font = this.canvas.width / 30 + \"px Meiryo\";\n        ctx.save();\n        ctx.textAlign = 'center';\n        ctx.textBaseline = 'middle';\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.fillText.apply(ctx, __spread(['OK'], new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(size).div(2).add(coord).val()));\n        ctx.restore();\n    };\n    /** 駒の配置を決める画面（対戦者のみ）\n     * @param pos 位置と色の Map\n     * @param disabled ボタンを押せなくする\n    */\n    Draw.prototype.decidePiecePlace = function (pos, disabled) {\n        var e_1, _a;\n        this.clearCanvas();\n        var ctx = this.ctx;\n        var csize = this.canvas.width;\n        var textSize = csize / 40;\n        var text1 = '駒の配置を決めてね（↓自分側　↑相手側）';\n        var text2 = 'クリック（タップ）で悪いおばけ（赤）と良いおばけ（青）を切り替えるよ';\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillText(text1, csize / 30, csize / 30);\n        ctx.fillText(text2, csize / 30, csize / 30 + 2 * textSize);\n        var lefttop = [\n            this.margin + this.squareSize,\n            this.margin + 2 * this.squareSize\n        ];\n        this.grid(lefttop, 4, 2);\n        this.button([csize * 5 / 6, csize * 5 / 6], [csize / 8, csize / 12], disabled);\n        try {\n            for (var _b = __values(pos.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {\n                var _d = __read(_c.value, 2), k = _d[0], v = _d[1];\n                var _e = __read(k.split(','), 2), x = _e[0], y = _e[1];\n                this.piece(v === 'R' ? _config__WEBPACK_IMPORTED_MODULE_0__.default.red : _config__WEBPACK_IMPORTED_MODULE_0__.default.blue, [+x, +y], false);\n            }\n        }\n        catch (e_1_1) { e_1 = { error: e_1_1 }; }\n        finally {\n            try {\n                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n            }\n            finally { if (e_1) throw e_1.error; }\n        }\n    };\n    /** ゲームボードと盤面上の駒を描く\n     * @param boardmap 盤面データ\n     * @param turn 先手後手どちら目線か\n     * @param first 先手のプレイヤー名\n     * @param second 後手のプレイヤー名\n     * @param showAll すべての駒色を隠さず表示する\n     */\n    Draw.prototype.board = function (boardmap, turn, first, second, showAll) {\n        var e_2, _a;\n        if (showAll === void 0) { showAll = false; }\n        this.clearCanvas();\n        var ctx = this.ctx;\n        // グリッド\n        this.grid([this.margin, this.margin], 6, 6);\n        // 角の矢印\n        var padding = (this.squareSize - this.pieceSize) / 2;\n        var coord = new _config__WEBPACK_IMPORTED_MODULE_0__.Vec([this.squareSize / 2, padding])\n            .add(this.margin).val();\n        ctx.save();\n        ctx.translate.apply(ctx, __spread(coord));\n        ctx.stroke(this.arrowPath);\n        ctx.restore();\n        ctx.save();\n        ctx.translate.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([5 * this.squareSize, 0]).val()));\n        ctx.stroke(this.arrowPath);\n        ctx.restore();\n        ctx.save();\n        ctx.translate.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord)\n            .add([0, 5 * this.squareSize + this.pieceSize]).val()));\n        ctx.rotate(Math.PI);\n        ctx.stroke(this.arrowPath);\n        ctx.restore();\n        ctx.save();\n        ctx.translate.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord)\n            .add([5 * this.squareSize,\n            5 * this.squareSize + this.pieceSize]).val()));\n        ctx.rotate(Math.PI);\n        ctx.stroke(this.arrowPath);\n        ctx.restore();\n        try {\n            // 駒\n            for (var _b = __values(boardmap.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {\n                var _d = __read(_c.value, 2), pos = _d[0], piece = _d[1];\n                var pieceColor = piece.color === 'R' ? _config__WEBPACK_IMPORTED_MODULE_0__.default.red : _config__WEBPACK_IMPORTED_MODULE_0__.default.blue;\n                var pos_ = pos.split(',').map(function (e) { return +e; });\n                if (turn === 0) {\n                    // 先手\n                    this.piece((showAll || piece.turn === 0) ? pieceColor : _config__WEBPACK_IMPORTED_MODULE_0__.default.grey, pos_, piece.turn === 1);\n                }\n                else {\n                    // 後手\n                    this.piece((showAll || piece.turn === 1) ? pieceColor : _config__WEBPACK_IMPORTED_MODULE_0__.default.grey, pos_, piece.turn === 0);\n                }\n            }\n        }\n        catch (e_2_1) { e_2 = { error: e_2_1 }; }\n        finally {\n            try {\n                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n            }\n            finally { if (e_2) throw e_2.error; }\n        }\n        // プレイヤー名\n        var csize = this.canvas.width;\n        var textSize = csize / 40;\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillText(turn === 1 ? second : first, csize * 3 / 4, csize - textSize);\n        ctx.fillText(turn === 1 ? first : second, csize * 3 / 4, textSize);\n    };\n    /**\n     * 駒の行先を円で表示する\n     * @param piece 駒インスタンス\n     * @param pos 位置。ゲーム内座標\n     * @param boardmap 盤面データ\n     */\n    Draw.prototype.dest = function (piece, pos, boardmap) {\n        var e_3, _a;\n        var ctx = this.ctx;\n        try {\n            for (var _b = __values(piece.coveringSquares(pos)), _c = _b.next(); !_c.done; _c = _b.next()) {\n                var dest = _c.value;\n                // 自分の駒の位置を除外\n                if (!(boardmap.has(String(dest))\n                    && boardmap.get(String(dest)).turn\n                        === boardmap.get(String(pos)).turn)) {\n                    var coord = new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(dest).mul(this.squareSize)\n                        .add(this.margin + this.squareSize / 2).val();\n                    ctx.beginPath();\n                    ctx.arc.apply(ctx, __spread(coord, [this.pieceSize / 2, 0, 2 * Math.PI]));\n                    ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.safe;\n                    ctx.fill();\n                }\n            }\n        }\n        catch (e_3_1) { e_3 = { error: e_3_1 }; }\n        finally {\n            try {\n                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n            }\n            finally { if (e_3) throw e_3.error; }\n        }\n    };\n    /**\n     * 取った駒を盤面の端に描画する\n     * @param numbers それぞれが取った駒の色と数\n     * @param turn 先手後手どちら目線か\n     */\n    Draw.prototype.takenPieces = function (numbers, turn) {\n        var _this = this;\n        var ctx = this.ctx;\n        var smallPieceSize = this.pieceSize / 6;\n        var margin = this.margin;\n        var squareSize = this.squareSize;\n        var drawPiece = function (coord, color) {\n            ctx.save();\n            ctx.fillStyle = color;\n            ctx.translate.apply(ctx, __spread(coord));\n            ctx.scale(1 / 6, 1 / 6);\n            ctx.fill(_this.piecePath);\n            ctx.restore();\n        };\n        var y1 = turn === 0 ? margin + 6 * squareSize + smallPieceSize : smallPieceSize;\n        var y2 = turn === 1 ? margin + 6 * squareSize + smallPieceSize : smallPieceSize;\n        // 先手が取った駒\n        for (var i = 0; i < numbers[0]['R']; i++) {\n            var coord = [(i + 1) * smallPieceSize, y1];\n            drawPiece(coord, _config__WEBPACK_IMPORTED_MODULE_0__.default.red);\n        }\n        for (var i = 0; i < numbers[0]['B']; i++) {\n            var coord = [(i + 1 + numbers[0]['R']) * smallPieceSize, y1];\n            drawPiece(coord, _config__WEBPACK_IMPORTED_MODULE_0__.default.blue);\n        }\n        // 後手が取った駒\n        for (var i = 0; i < numbers[1]['R']; i++) {\n            var coord = [(i + 1) * smallPieceSize, y2];\n            drawPiece(coord, _config__WEBPACK_IMPORTED_MODULE_0__.default.red);\n        }\n        for (var i = 0; i < numbers[1]['B']; i++) {\n            var coord = [(i + 1 + numbers[1]['R']) * smallPieceSize, y2];\n            drawPiece(coord, _config__WEBPACK_IMPORTED_MODULE_0__.default.blue);\n        }\n    };\n    return Draw;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Draw);\n;\n\n\n//# sourceURL=webpack://geister-online/./src/draw.ts?");

/***/ }),

/***/ "./src/mouse.ts":
/*!**********************!*\
  !*** ./src/mouse.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\n\nvar Mouse = /** @class */ (function () {\n    function Mouse(canvas) {\n        this.squareSize = canvas.width * 3 / 20;\n        this.margin = canvas.width / 20;\n    }\n    /**\n     * ウィンドウ座標を取得する\n     * @param e マウスイベント\n     */\n    Mouse.prototype.getWindowPos = function (e) {\n        var rect = e.target.getBoundingClientRect();\n        return [e.clientX - rect.left, e.clientY - rect.top];\n    };\n    /**\n     * ウィンドウ座標をゲーム内座標に変換する\n     * @param pos ウィンドウ座標\n     */\n    Mouse.prototype.chcoord = function (pos) {\n        return new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(pos)\n            .add(-this.margin).quot(this.squareSize).val();\n    };\n    /**\n     * ゲーム内座標を取得する\n     * @param e マウスイベント\n     */\n    Mouse.prototype.getCoord = function (e) {\n        return this.chcoord(this.getWindowPos(e));\n    };\n    /**\n     * (x, y) が指定範囲内にあるか\n     * @param x 位置\n     * @param y 位置\n     * @param left 左端\n     * @param top 上端\n     * @param w 幅\n     * @param h 高さ\n     */\n    Mouse.prototype.onArea = function (x, y, left, top, w, h) {\n        return left <= x && x <= left + w && top <= y && y <= top + h;\n    };\n    return Mouse;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Mouse);\n\n\n//# sourceURL=webpack://geister-online/./src/mouse.ts?");

/***/ }),

/***/ "./src/piece.ts":
/*!**********************!*\
  !*** ./src/piece.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\nvar __read = (undefined && undefined.__read) || function (o, n) {\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\n    if (!m) return o;\n    var i = m.call(o), r, ar = [], e;\n    try {\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\n    }\n    catch (error) { e = { error: error }; }\n    finally {\n        try {\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\n        }\n        finally { if (e) throw e.error; }\n    }\n    return ar;\n};\n\nvar Piece = /** @class */ (function () {\n    /**\n     * @param color 駒色\n     * @param turn 先手(0)後手(1)どちらの駒か\n     */\n    function Piece(color, turn) {\n        this.color = color;\n        this.turn = turn;\n    }\n    /**\n     * 駒が動ける位置のリストを返す\n     * @param pos 駒の位置。ゲーム内座標\n     */\n    Piece.prototype.coveringSquares = function (pos) {\n        var pos_ = [[0, 1], [0, -1], [-1, 0], [1, 0]]\n            .map(function (e) { return new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(pos).add(e).val(); });\n        var dest = pos_\n            .filter(function (_a) {\n            var _b = __read(_a, 2), x = _b[0], y = _b[1];\n            return 0 <= x && x <= 5 && 0 <= y && y <= 5;\n        });\n        if (this.color === 'B') {\n            if (String(pos) === '0,0') {\n                dest.push([0, -1]);\n            }\n            else if (String(pos) === '5,0') {\n                dest.push([5, -1]);\n            }\n        }\n        return dest;\n    };\n    return Piece;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Piece);\n\n\n//# sourceURL=webpack://geister-online/./src/piece.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/client.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;