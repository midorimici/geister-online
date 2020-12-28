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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    ivory: 'rgb(240, 227, 206)',\n    dark: 'rgb(30, 30, 30)'\n});\n\n\n//# sourceURL=webpack://geister-online/./src/config.ts?");

/***/ }),

/***/ "./src/draw.ts":
/*!*********************!*\
  !*** ./src/draw.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\n\nvar Draw = /** @class */ (function () {\n    function Draw(canvas) {\n        var cw = document.documentElement.clientWidth;\n        var ch = document.documentElement.clientHeight;\n        var min = cw < ch ? cw : ch;\n        var cvsize = (0.9 * min).toString();\n        canvas.setAttribute('width', cvsize);\n        canvas.setAttribute('height', cvsize);\n        this.canvas = canvas;\n        this.ctx = canvas.getContext('2d');\n    }\n    Draw.prototype.clearCanvas = function () {\n        this.ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.ivory;\n        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\n    };\n    Draw.prototype.waiting = function (obj) {\n        this.clearCanvas();\n        var canvas = this.canvas;\n        var ctx = this.ctx;\n        var textSize = canvas.width / 20;\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        if (obj === 'player') {\n            ctx.fillText('対戦相手の入室を待っています...', canvas.width / 2 - (7.5) * textSize, canvas.height / 2);\n        }\n        else {\n            ctx.fillText('対戦者が駒を配置するのを待っています...', canvas.width / 2 - (9.5) * textSize, canvas.height / 2);\n        }\n    };\n    // 対戦相手の参加を待つ画面\n    Draw.prototype.waitingPlayer = function () {\n        this.waiting('player');\n    };\n    // 対戦者の駒配置を待つ画面（観戦者のみ）\n    Draw.prototype.waitingPlacing = function () {\n        this.waiting('placing');\n    };\n    // 駒の配置を決める画面（対戦者のみ）\n    Draw.prototype.decidePiecePlace = function (turn) {\n        this.clearCanvas();\n        var ctx = this.ctx;\n        var csize = this.canvas.width;\n        var textSize = csize / 40;\n        var text1 = \"\\u3042\\u306A\\u305F\\u306F\" + (turn === 0 ? '先' : '後') + \"\\u624B\\u3060\\u3088\\u3002\";\n        var text2 = '駒の配置を決めてね（↓自分側　↑相手側）';\n        var text3 = '左クリックで悪いおばけ（赤）、右クリックで良いおばけ（青）を配置するよ';\n        ctx.fillStyle = _config__WEBPACK_IMPORTED_MODULE_0__.default.dark;\n        ctx.font = \"bold \" + textSize + \"px Meiryo\";\n        ctx.fillText(text1, csize / 30, csize / 30);\n        ctx.font = textSize + \"px Meiryo\";\n        ctx.fillText(text2, csize / 30 + 10 * textSize, csize / 30);\n        ctx.fillText(text3, csize / 30, csize / 30 + 2 * textSize);\n    };\n    return Draw;\n}());\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Draw);\n;\n\n\n//# sourceURL=webpack://geister-online/./src/draw.ts?");

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