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

/***/ "./server.ts":
/*!*******************!*\
  !*** ./server.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);\n\n\nvar app = express__WEBPACK_IMPORTED_MODULE_0__();\napp.use(express__WEBPACK_IMPORTED_MODULE_0__.static(process.cwd() + '/public'));\nvar server = http__WEBPACK_IMPORTED_MODULE_1__.createServer(app);\nvar io = __webpack_require__(/*! socket.io */ \"socket.io\")(server);\napp.get('/', function (req, res) {\n    res.sendFile(process.cwd() + '/public/index.html');\n});\nvar rooms = {};\nio.on('connection', function (socket) {\n    socket.on('enterRoom', function (info) {\n        socket.info = info;\n        var roomId = Number(info.roomId);\n        if (info.role === 'play') {\n            // 対戦者として参加\n            if (rooms[roomId]) {\n                // 指定のルームに対戦者がいたとき\n                if (Object.keys(rooms[roomId]).length === 1) {\n                    // 対戦者が1人待機している\n                    rooms[roomId].player2 = info.name;\n                    socket.join(info.roomId);\n                    io.to(info.roomId).emit('startGame', rooms[roomId]);\n                }\n                else {\n                    // 対戦者がすでに2人いる\n                    socket.emit('roomFull', info.roomId);\n                }\n            }\n            else {\n                // 新たにルームを作成する\n                rooms[roomId] = {\n                    player1: info.name\n                };\n                socket.join(info.roomId);\n                socket.emit('wait');\n            }\n            // デバッグ\n            console.log(rooms);\n        }\n        else {\n            // 観戦者として参加\n            if (rooms[roomId]) {\n                // 指定のルームが存在するとき\n                socket.join(info.roomId);\n                if (Object.keys(rooms[roomId]).length === 1) {\n                    // 対戦者が1人待機している\n                    socket.emit('wait');\n                }\n                else {\n                    // 対戦者がすでに2人いる\n                    socket.emit('watch');\n                }\n            }\n            else {\n                // 指定したルームがないとき\n                socket.emit('noRoom', info.roomId);\n            }\n        }\n    });\n    socket.on('disconnect', function () {\n        var info = socket.info;\n        // 接続が切れたとき\n        if (info) {\n            // ルームに入っていたとき\n            if (info.role === 'play') {\n                // 対戦者としてルームにいたとき\n                delete rooms[Number(info.roomId)];\n                // 観戦者ともう一方の対戦者も退出させる\n                socket.to(info.roomId).leave(info.roomId);\n                socket.to(info.roomId).emit('player_discon', info.name);\n            }\n        }\n    });\n});\nvar port = process.env.PORT || 3000;\nserver.listen(port, function () {\n    console.log(\"listening on \" + port);\n});\n\n\n//# sourceURL=webpack://geister-online/./server.ts?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

eval("module.exports = require(\"express\");;\n\n//# sourceURL=webpack://geister-online/external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

eval("module.exports = require(\"http\");;\n\n//# sourceURL=webpack://geister-online/external_%22http%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

eval("module.exports = require(\"socket.io\");;\n\n//# sourceURL=webpack://geister-online/external_%22socket.io%22?");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	__webpack_require__("./server.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;