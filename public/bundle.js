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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./draw */ \"./src/draw.ts\");\n/* harmony import */ var _mouse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mouse */ \"./src/mouse.ts\");\nvar __read = (undefined && undefined.__read) || function (o, n) {\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\n    if (!m) return o;\n    var i = m.call(o), r, ar = [], e;\n    try {\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\n    }\n    catch (error) { e = { error: error }; }\n    finally {\n        try {\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\n        }\n        finally { if (e) throw e.error; }\n    }\n    return ar;\n};\nvar __spread = (undefined && undefined.__spread) || function () {\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\n    return ar;\n};\n\n\n// 対戦するを選択したときはユーザー名入力欄を表示\nvar radios = document.getElementsByName('role');\nvar _loop_1 = function (i) {\n    var state = '';\n    if (i === 0) {\n        state = 'visible';\n    }\n    else {\n        state = 'hidden';\n    }\n    radios[i].addEventListener('click', function () {\n        document.getElementById('username-div').style.visibility = state;\n    });\n};\nfor (var i = 0; i <= 1; i++) {\n    _loop_1(i);\n}\n// 入室～対戦相手待機\nvar myroom;\nvar myrole;\nvar myname;\nvar draw;\nvar doneInitCanvas = false;\nvar initCanvas = function () {\n    document.getElementById('settings').style.display = 'none';\n    var canvas = document.getElementById('canvas');\n    draw = new _draw__WEBPACK_IMPORTED_MODULE_0__.default(canvas);\n    doneInitCanvas = true;\n};\nvar socket = io();\nvar form = document.getElementById('form');\nform.addEventListener('submit', function (e) {\n    e.preventDefault();\n    var data = new FormData(form);\n    var info = {\n        roomId: data.get('room'),\n        role: data.get('role'),\n        name: data.get('username'),\n    };\n    myroom = info.roomId;\n    myrole = info.role;\n    myname = info.name;\n    socket.emit('enter room', info);\n}, false);\nsocket.on('room full', function (id) {\n    var p = document.getElementById('message');\n    p.innerText = \"\\u30EB\\u30FC\\u30E0\" + id + \"\\u306F\\u3044\\u3063\\u3071\\u3044\\u3067\\u3059\\u3002\\u5BFE\\u6226\\u8005\\u3068\\u3057\\u3066\\u53C2\\u52A0\\u3059\\u308B\\u3053\\u3068\\u306F\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002\";\n});\nsocket.on('no room', function (id) {\n    var p = document.getElementById('message');\n    p.innerText = \"\\u30EB\\u30FC\\u30E0\" + id + \"\\u3067\\u306F\\u5BFE\\u6226\\u304C\\u884C\\u308F\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002\";\n});\nsocket.on('wait opponent', function () {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    draw.waitingPlayer();\n});\n// 駒配置\nvar posmap = new Map();\nfor (var i = 1; i <= 4; i++) {\n    for (var j = 2; j <= 3; j++) {\n        posmap.set(i + \",\" + j, 'R');\n    }\n}\nvar mouse;\nsocket.on('place pieces', function () {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    var canvas = document.getElementById('canvas');\n    var csize = canvas.width;\n    var satisfied = false;\n    var checkColor = function (colors) {\n        return (colors.filter(function (color) { return color === 'R'; })).length\n            === (colors.filter(function (color) { return color === 'B'; })).length;\n    };\n    var drawDisp = function () {\n        draw.decidePiecePlace(posmap, !satisfied);\n    };\n    drawDisp();\n    // マウスイベント\n    mouse = new _mouse__WEBPACK_IMPORTED_MODULE_1__.default(canvas);\n    canvas.onclick = function (e) {\n        for (var i = 1; i <= 4; i++) {\n            for (var j = 2; j <= 3; j++) {\n                if (String(mouse.getCoord(e)) === String([i, j])) {\n                    posmap.set(i + \",\" + j, posmap.get(i + \",\" + j) === 'R'\n                        ? 'B' : 'R');\n                    satisfied = checkColor(Array.from(posmap.values()));\n                }\n            }\n        }\n        if (mouse.onArea.apply(mouse, __spread(mouse.getWindowPos(e), [csize * 5 / 6, csize * 5 / 6, csize / 8, csize / 12]))) {\n            if (satisfied) {\n                socket.emit('decided place', myroom, myname, __spread(posmap.entries()));\n            }\n            else {\n                console.log('ng');\n            }\n        }\n        drawDisp();\n    };\n});\nsocket.on('wait placing', function () {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    draw.waitingPlacing();\n});\nsocket.on('game', function (board) {\n    var boardmap = new Map(board);\n    console.log(boardmap);\n});\nsocket.on('player discon', function (name) {\n    alert(name + \"\\u3055\\u3093\\u306E\\u63A5\\u7D9A\\u304C\\u5207\\u308C\\u307E\\u3057\\u305F\\u3002\");\n    location.reload();\n});\n\n\n//# sourceURL=webpack://geister-online/./src/client.ts?");

/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__,\n/* harmony export */   \"Vec\": () => /* binding */ Vec\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    ivory: 'rgb(240, 227, 206)',\n    dark: 'rgb(30, 30, 30)',\n    red: 'rgb(200, 0, 0)',\n    blue: 'rgb(0, 0, 200)'\n});\nvar Vec = /** @class */ (function () {\n    function Vec(v) {\n        this.v = v;\n    }\n    Vec.prototype.val = function () {\n        return this.v;\n    };\n    Vec.prototype.add = function (v) {\n        if (Array.isArray(v)) {\n            return new Vec([v[0] + this.v[0], v[1] + this.v[1]]);\n        }\n        else {\n            return new Vec([v + this.v[0], v + this.v[1]]);\n        }\n    };\n    Vec.prototype.mul = function (n) {\n        return new Vec([n * this.v[0], n * this.v[1]]);\n    };\n    Vec.prototype.div = function (n) {\n        return new Vec([this.v[0] / n, this.v[1] / n]);\n    };\n    Vec.prototype.quot = function (n) {\n        return new Vec([Math.floor(this.v[0] / n), Math.floor(this.v[1] / n)]);\n    };\n    return Vec;\n}());\n\n\n\n//# sourceURL=webpack://geister-online/./src/config.ts?");

/***/ }),

/***/ "./src/draw.ts":
/*!*********************!*\
  !*** ./src/draw.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\nvar __read = (undefined && undefined.__read) || function (o, n) {\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\n    if (!m) return o;\n    var i = m.call(o), r, ar = [], e;\n    try {\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\n    }\n    catch (error) { e = { error: error }; }\n    finally {\n        try {\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\n        }\n        finally { if (e) throw e.error; }\n    }\n    return ar;\n};\nvar __spread = (undefined && undefined.__spread) || function () {\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\n    return ar;\n};\nvar __values = (undefined && undefined.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\n\nvar Draw = /** @class */ (function () {\n    function Draw(canvas) {\n        var cw = document.documentElement.clientWidth;\n        var ch = document.documentElement.clientHeight;\n        var min = cw < ch ? cw : ch;\n        var cvsize = (0.9 * min).toString();\n        canvas.setAttribute('width', cvsize);\n        canvas.setAttribute('height', cvsize);\n        this.canvas = canvas;\n        this.ctx = canvas.getContext('2d');\n        this.square_size = canvas.width * 3 / 20;\n        this.margin = canvas.width / 20;\n        this.piece_size = canvas.width / 10;\n    }\n    // アイボリーで画面全体を塗りつぶす\n    Draw.prototype.clearCanvas = function () {\n        this.ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.ivory;\n        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\n    };\n    // 待機画面\n    Draw.prototype.waiting = function (obj) {\n        this.clearCanvas();\n        var canvas = this.canvas;\n        var ctx = this.ctx;\n        var textSize = canvas.width / 20;\n        ctx.textAlign = 'start';\n        ctx.textBaseline = 'alphabetic';\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        if (obj === 'player') {\n            ctx.fillText('対戦相手の入室を待っています...', canvas.width / 2 - (7.5) * textSize, canvas.height / 2);\n        }\n        else {\n            ctx.fillText('対戦者が駒を配置するのを待っています...', canvas.width / 2 - (9.5) * textSize, canvas.height / 2);\n        }\n    };\n    // 対戦相手の参加を待つ画面\n    Draw.prototype.waitingPlayer = function () {\n        this.waiting('player');\n    };\n    // 対戦者の駒配置を待つ画面（観戦者のみ）\n    Draw.prototype.waitingPlacing = function () {\n        this.waiting('placing');\n    };\n    // 一辺 square_size のグリッドを描く\n    Draw.prototype.grid = function (coord, col, row) {\n        var ctx = this.ctx;\n        var square_size = this.square_size;\n        ctx.strokeStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.lineWidth = 2;\n        ctx.beginPath();\n        for (var i = 0; i <= row; i++) {\n            ctx.moveTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([0, square_size * i]).val()));\n            ctx.lineTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([square_size * col, square_size * i]).val()));\n        }\n        for (var i = 0; i <= col; i++) {\n            ctx.moveTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([square_size * i, 0]).val()));\n            ctx.lineTo.apply(ctx, __spread(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([square_size * i, square_size * row]).val()));\n        }\n        ctx.closePath();\n        ctx.stroke();\n    };\n    // 駒を描く\n    Draw.prototype.piece = function (color, pos, rev) {\n        var ctx = this.ctx;\n        var padding = (this.square_size - this.piece_size) / 2;\n        var coord = new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(pos).mul(this.square_size)\n            .add(this.margin + padding).val();\n        var piece_size = this.piece_size;\n        var points;\n        if (rev) {\n            // 相手の駒は逆転して描く\n            points = [coord,\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size, 0]).val(),\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size / 2, piece_size]).val()];\n        }\n        else {\n            points = [new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([0, piece_size]).val(),\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size, piece_size]).val(),\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size / 2, 0]).val()];\n        }\n        ctx.fillStyle = color;\n        ctx.beginPath();\n        ctx.moveTo.apply(ctx, __spread(points[0]));\n        ctx.lineTo.apply(ctx, __spread(points[1]));\n        ctx.lineTo.apply(ctx, __spread(points[2]));\n        ctx.closePath();\n        ctx.fill();\n    };\n    // ボタンを描く\n    Draw.prototype.button = function (coord, size, disabled) {\n        var ctx = this.ctx;\n        ctx.fillStyle = disabled ?\n            'rgb(160, 140, 120)' : 'rgb(200, 180, 160)';\n        ctx.fillRect.apply(ctx, __spread(coord, size));\n        ctx.font = this.canvas.width / 30 + \"px Meiryo\";\n        ctx.textAlign = 'center';\n        ctx.textBaseline = 'middle';\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.fillText.apply(ctx, __spread(['OK'], new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(size).div(2).add(coord).val()));\n    };\n    // 駒の配置を決める画面（対戦者のみ）\n    Draw.prototype.decidePiecePlace = function (pos, disabled) {\n        var e_1, _a;\n        this.clearCanvas();\n        var ctx = this.ctx;\n        var csize = this.canvas.width;\n        var textSize = csize / 40;\n        var text1 = '駒の配置を決めてね（↓自分側　↑相手側）';\n        var text2 = 'クリック（タップ）で悪いおばけ（赤）と良いおばけ（青）を切り替えるよ';\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.textAlign = 'start';\n        ctx.textBaseline = 'alphabetic';\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillText(text1, csize / 30 + 10 * textSize, csize / 30);\n        ctx.fillText(text2, csize / 30, csize / 30 + 2 * textSize);\n        var lefttop = [\n            this.margin + this.square_size,\n            this.margin + 2 * this.square_size\n        ];\n        this.grid(lefttop, 4, 2);\n        this.button([csize * 5 / 6, csize * 5 / 6], [csize / 8, csize / 12], disabled);\n        try {\n            for (var _b = __values(pos.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {\n                var _d = __read(_c.value, 2), k = _d[0], v = _d[1];\n                var _e = __read(k.split(','), 2), x = _e[0], y = _e[1];\n                this.piece(v === 'R' ? _config__WEBPACK_IMPORTED_MODULE_0__.default.red : _config__WEBPACK_IMPORTED_MODULE_0__.default.blue, [+x, +y], false);\n            }\n        }\n        catch (e_1_1) { e_1 = { error: e_1_1 }; }\n        finally {\n            try {\n                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n            }\n            finally { if (e_1) throw e_1.error; }\n        }\n    };\n    return Draw;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Draw);\n;\n\n\n//# sourceURL=webpack://geister-online/./src/draw.ts?");

/***/ }),

/***/ "./src/mouse.ts":
/*!**********************!*\
  !*** ./src/mouse.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\n\nvar Mouse = /** @class */ (function () {\n    function Mouse(canvas) {\n        this.square_size = canvas.width * 3 / 20;\n        this.margin = canvas.width / 20;\n    }\n    Mouse.prototype.getWindowPos = function (e) {\n        var rect = e.target.getBoundingClientRect();\n        return [e.clientX - rect.left, e.clientY - rect.top];\n    };\n    Mouse.prototype.chcoord = function (pos) {\n        return new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(pos)\n            .add(-this.margin).quot(this.square_size).val();\n    };\n    Mouse.prototype.getCoord = function (e) {\n        return this.chcoord(this.getWindowPos(e));\n    };\n    Mouse.prototype.onArea = function (x, y, left, top, w, h) {\n        return left <= x && x <= left + w && top <= y && y <= top + h;\n    };\n    return Mouse;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Mouse);\n\n\n//# sourceURL=webpack://geister-online/./src/mouse.ts?");

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