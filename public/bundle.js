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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./draw */ \"./src/draw.ts\");\n\n// 対戦するを選択したときはユーザー名入力欄を表示\nvar radios = document.getElementsByName('role');\nvar _loop_1 = function (i) {\n    var state = '';\n    if (i === 0) {\n        state = 'visible';\n    }\n    else {\n        state = 'hidden';\n    }\n    radios[i].addEventListener('click', function () {\n        document.getElementById('username-div').style.visibility = state;\n    });\n};\nfor (var i = 0; i <= 1; i++) {\n    _loop_1(i);\n}\nvar myrole;\nvar myname;\nvar draw;\nvar doneInitCanvas = false;\nvar initCanvas = function () {\n    document.getElementById('settings').style.display = 'none';\n    var canvas = document.getElementById('canvas');\n    draw = new _draw__WEBPACK_IMPORTED_MODULE_0__.default(canvas);\n    doneInitCanvas = true;\n};\nvar socket = io();\nvar form = document.getElementById('form');\nform.addEventListener('submit', function (e) {\n    e.preventDefault();\n    var data = new FormData(form);\n    var info = {\n        roomId: data.get('room'),\n        role: data.get('role'),\n        name: data.get('username'),\n    };\n    myrole = info.role;\n    myname = info.name;\n    socket.emit('enterRoom', info);\n}, false);\nsocket.on('roomFull', function (id) {\n    var p = document.getElementById('message');\n    p.innerText = \"\\u30EB\\u30FC\\u30E0\" + id + \"\\u306F\\u3044\\u3063\\u3071\\u3044\\u3067\\u3059\\u3002\\u5BFE\\u6226\\u8005\\u3068\\u3057\\u3066\\u53C2\\u52A0\\u3059\\u308B\\u3053\\u3068\\u306F\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002\";\n});\nsocket.on('noRoom', function (id) {\n    var p = document.getElementById('message');\n    p.innerText = \"\\u30EB\\u30FC\\u30E0\" + id + \"\\u3067\\u306F\\u5BFE\\u6226\\u304C\\u884C\\u308F\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002\";\n});\nsocket.on('wait', function () {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    draw.waitingPlayer();\n});\nsocket.on('startGame', function (room) {\n    if (!doneInitCanvas) {\n        initCanvas();\n    }\n    ;\n    if (myrole === 'play') {\n        if (room.player1 === myname) {\n            // 先手\n            draw.decidePiecePlace(0);\n        }\n        else {\n            // 後手\n            draw.decidePiecePlace(1);\n        }\n    }\n    else {\n        draw.waitingPlacing();\n    }\n});\nsocket.on('player_discon', function (name) {\n    alert(name + \"\\u3055\\u3093\\u306E\\u63A5\\u7D9A\\u304C\\u5207\\u308C\\u307E\\u3057\\u305F\\u3002\");\n    location.reload();\n});\n\n\n//# sourceURL=webpack://geister-online/./src/client.ts?");

/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__,\n/* harmony export */   \"Vec\": () => /* binding */ Vec\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    ivory: 'rgb(240, 227, 206)',\n    dark: 'rgb(30, 30, 30)',\n    red: 'rgb(200, 0, 0)',\n    blue: 'rgb(0, 0, 200)'\n});\nvar Vec = /** @class */ (function () {\n    function Vec(v) {\n        this.v = v;\n    }\n    Vec.prototype.val = function () {\n        return this.v;\n    };\n    Vec.prototype.add = function (v) {\n        if (Array.isArray(v)) {\n            return new Vec([v[0] + this.v[0], v[1] + this.v[1]]);\n        }\n        else {\n            return new Vec([v + this.v[0], v + this.v[1]]);\n        }\n    };\n    Vec.prototype.mul = function (n) {\n        return new Vec([n * this.v[0], n * this.v[1]]);\n    };\n    Vec.prototype.div = function (n) {\n        return new Vec([this.v[0] / n, this.v[1] / n]);\n    };\n    return Vec;\n}());\n\n\n\n//# sourceURL=webpack://geister-online/./src/config.ts?");

/***/ }),

/***/ "./src/draw.ts":
/*!*********************!*\
  !*** ./src/draw.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\nvar __spreadArrays = (undefined && undefined.__spreadArrays) || function () {\n    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;\n    for (var r = Array(s), k = 0, i = 0; i < il; i++)\n        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)\n            r[k] = a[j];\n    return r;\n};\n\nvar Draw = /** @class */ (function () {\n    function Draw(canvas) {\n        var cw = document.documentElement.clientWidth;\n        var ch = document.documentElement.clientHeight;\n        var min = cw < ch ? cw : ch;\n        var cvsize = (0.9 * min).toString();\n        canvas.setAttribute('width', cvsize);\n        canvas.setAttribute('height', cvsize);\n        this.canvas = canvas;\n        this.ctx = canvas.getContext('2d');\n        this.square_size = canvas.width * 3 / 20;\n        this.margin = canvas.width / 20;\n        this.piece_size = canvas.width / 10;\n    }\n    // アイボリーで画面全体を塗りつぶす\n    Draw.prototype.clearCanvas = function () {\n        this.ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.ivory;\n        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\n    };\n    // 待機画面\n    Draw.prototype.waiting = function (obj) {\n        this.clearCanvas();\n        var canvas = this.canvas;\n        var ctx = this.ctx;\n        var textSize = canvas.width / 20;\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        if (obj === 'player') {\n            ctx.fillText('対戦相手の入室を待っています...', canvas.width / 2 - (7.5) * textSize, canvas.height / 2);\n        }\n        else {\n            ctx.fillText('対戦者が駒を配置するのを待っています...', canvas.width / 2 - (9.5) * textSize, canvas.height / 2);\n        }\n    };\n    // 対戦相手の参加を待つ画面\n    Draw.prototype.waitingPlayer = function () {\n        this.waiting('player');\n    };\n    // 対戦者の駒配置を待つ画面（観戦者のみ）\n    Draw.prototype.waitingPlacing = function () {\n        this.waiting('placing');\n    };\n    // 一辺 square_size のグリッドを描く\n    Draw.prototype.grid = function (coord, col, row) {\n        var ctx = this.ctx;\n        var square_size = this.square_size;\n        ctx.strokeStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.lineWidth = 2;\n        ctx.beginPath();\n        for (var i = 0; i <= row; i++) {\n            ctx.moveTo.apply(ctx, new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([0, square_size * i]).val());\n            ctx.lineTo.apply(ctx, new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([square_size * col, square_size * i]).val());\n        }\n        for (var i = 0; i <= col; i++) {\n            ctx.moveTo.apply(ctx, new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([square_size * i, 0]).val());\n            ctx.lineTo.apply(ctx, new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([square_size * i, square_size * row]).val());\n        }\n        ctx.closePath();\n        ctx.stroke();\n    };\n    // 駒を描く\n    Draw.prototype.piece = function (color, pos, rev) {\n        var ctx = this.ctx;\n        var padding = (this.square_size - this.piece_size) / 2;\n        var coord = new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(pos).mul(this.square_size)\n            .add(this.margin + padding).val();\n        var piece_size = this.piece_size;\n        var points;\n        if (rev) {\n            // 相手の駒は逆転して描く\n            points = [coord,\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size, 0]).val(),\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size / 2, piece_size]).val()];\n        }\n        else {\n            points = [new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([0, piece_size]).val(),\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size, piece_size]).val(),\n                new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add([piece_size / 2, 0]).val()];\n        }\n        ctx.fillStyle = color;\n        ctx.beginPath();\n        ctx.moveTo.apply(ctx, points[0]);\n        ctx.lineTo.apply(ctx, points[1]);\n        ctx.lineTo.apply(ctx, points[2]);\n        ctx.closePath();\n        ctx.fill();\n    };\n    // ボタンを描く\n    Draw.prototype.button = function (coord, size, disabled) {\n        var ctx = this.ctx;\n        ctx.fillStyle = disabled ?\n            'rgb(160, 140, 120)' : 'rgb(200, 180, 160)';\n        ctx.fillRect.apply(ctx, __spreadArrays(coord, size));\n        ctx.font = this.canvas.width / 30 + \"px Meiryo\";\n        ctx.textAlign = 'center';\n        ctx.textBaseline = 'middle';\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.fillText.apply(ctx, __spreadArrays(['OK'], new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(coord).add(new _config__WEBPACK_IMPORTED_MODULE_0__.Vec(size).div(2).val()).val()));\n    };\n    // 駒の配置を決める画面（対戦者のみ）\n    Draw.prototype.decidePiecePlace = function (turn) {\n        this.clearCanvas();\n        var ctx = this.ctx;\n        var csize = this.canvas.width;\n        var textSize = csize / 40;\n        var text1 = \"\\u3042\\u306A\\u305F\\u306F\" + (turn === 0 ? '先' : '後') + \"\\u624B\\u3060\\u3088\\u3002\";\n        var text2 = '駒の配置を決めてね（↓自分側　↑相手側）';\n        var text3 = '左クリックで悪いおばけ（赤）、右クリックで良いおばけ（青）を配置するよ';\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.font = \"bold \" + textSize + \"px Meiryo\";\n        ctx.fillText(text1, csize / 30, csize / 30);\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillText(text2, csize / 30 + 10 * textSize, csize / 30);\n        ctx.fillText(text3, csize / 30, csize / 30 + 2 * textSize);\n        var lefttop = [\n            this.margin + this.square_size,\n            this.margin + 2 * this.square_size\n        ];\n        this.grid(lefttop, 4, 2);\n        this.button([csize * 5 / 6, csize * 5 / 6], [csize / 8, csize / 12], true);\n    };\n    return Draw;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Draw);\n;\n\n\n//# sourceURL=webpack://geister-online/./src/draw.ts?");

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