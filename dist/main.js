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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);\nvar __values = (undefined && undefined.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\nvar __read = (undefined && undefined.__read) || function (o, n) {\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\n    if (!m) return o;\n    var i = m.call(o), r, ar = [], e;\n    try {\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\n    }\n    catch (error) { e = { error: error }; }\n    finally {\n        try {\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\n        }\n        finally { if (e) throw e.error; }\n    }\n    return ar;\n};\nvar __spread = (undefined && undefined.__spread) || function () {\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\n    return ar;\n};\n\n\nvar app = express__WEBPACK_IMPORTED_MODULE_0__();\napp.use(express__WEBPACK_IMPORTED_MODULE_0__.static(process.cwd() + '/public'));\nvar server = http__WEBPACK_IMPORTED_MODULE_1__.createServer(app);\nvar io = __webpack_require__(/*! socket.io */ \"socket.io\")(server);\napp.get('/', function (req, res) {\n    res.sendFile(process.cwd() + '/public/index.html');\n});\nvar rooms = new Map();\nvar order1; // 先手の初期配置\nvar order2; // 後手の初期配置\nvar board1; // 先手から見た盤面\nvar board2; // 後手から見た盤面\nvar initBoard = function (order1, order2, turn) {\n    var e_1, _a, e_2, _b;\n    var m = new Map();\n    try {\n        for (var order1_1 = __values(order1), order1_1_1 = order1_1.next(); !order1_1_1.done; order1_1_1 = order1_1.next()) {\n            var _c = __read(order1_1_1.value, 2), k = _c[0], v = _c[1];\n            var _d = __read(k.split(',').map(function (e) { return +e; }), 2), x = _d[0], y = _d[1];\n            if (turn === 0) {\n                m.set(x + \",\" + (y + 2), { color: v, turn: 0 });\n            }\n            else {\n                m.set(5 - x + \",\" + (3 - y), { color: v, turn: 0 });\n            }\n        }\n    }\n    catch (e_1_1) { e_1 = { error: e_1_1 }; }\n    finally {\n        try {\n            if (order1_1_1 && !order1_1_1.done && (_a = order1_1.return)) _a.call(order1_1);\n        }\n        finally { if (e_1) throw e_1.error; }\n    }\n    try {\n        for (var order2_1 = __values(order2), order2_1_1 = order2_1.next(); !order2_1_1.done; order2_1_1 = order2_1.next()) {\n            var _e = __read(order2_1_1.value, 2), k = _e[0], v = _e[1];\n            var _f = __read(k.split(',').map(function (e) { return +e; }), 2), x = _f[0], y = _f[1];\n            if (turn === 0) {\n                m.set(5 - x + \",\" + (3 - y), { color: v, turn: 1 });\n            }\n            else {\n                m.set(x + \",\" + (y + 2), { color: v, turn: 1 });\n            }\n        }\n    }\n    catch (e_2_1) { e_2 = { error: e_2_1 }; }\n    finally {\n        try {\n            if (order2_1_1 && !order2_1_1.done && (_b = order2_1.return)) _b.call(order2_1);\n        }\n        finally { if (e_2) throw e_2.error; }\n    }\n    return __spread(m);\n};\nio.on('connection', function (socket) {\n    socket.on('enter room', function (info) {\n        socket.info = info;\n        var room = rooms.get(info.roomId);\n        if (info.role === 'play') {\n            // 対戦者として参加\n            if (room) {\n                // 指定のルームに対戦者がいたとき\n                if (room.state === 'waiting opponent') {\n                    // 対戦者が1人待機している\n                    room.player2 = {\n                        id: socket.id,\n                        name: info.name,\n                        turn: 0\n                    };\n                    room.state = 'waiting placing';\n                    socket.join(info.roomId);\n                    io.to(info.roomId).emit('wait placing');\n                    io.to(room.player1.id).emit('place pieces');\n                    io.to(room.player2.id).emit('place pieces');\n                }\n                else {\n                    // 対戦者がすでに2人いる\n                    socket.emit('room full', info.roomId);\n                }\n            }\n            else {\n                // 新たにルームを作成する\n                rooms.set(info.roomId, {\n                    player1: {\n                        id: socket.id,\n                        name: info.name,\n                        turn: 0\n                    },\n                    player2: {\n                        id: '',\n                        name: '',\n                        turn: 0\n                    },\n                    state: 'waiting opponent',\n                    ready: 0\n                });\n                socket.join(info.roomId);\n                socket.emit('wait opponent');\n            }\n            // デバッグ\n            console.log(rooms);\n        }\n        else {\n            // 観戦者として参加\n            if (room) {\n                // 指定のルームが存在するとき\n                socket.join(info.roomId);\n                if (room.state === 'waiting opponent') {\n                    // 対戦者が1人待機している\n                    socket.emit('wait opponent');\n                }\n                else if (room.state === 'waiting placing') {\n                    // 対戦者が駒の配置を決めている\n                    socket.emit('wait placing');\n                }\n                else {\n                    // 対戦者がすでに2人いて対戦中\n                    socket.emit('watch', board1);\n                }\n            }\n            else {\n                // 指定したルームがないとき\n                socket.emit('no room', info.roomId);\n            }\n        }\n    });\n    socket.on('decided place', function (roomId, name, poslist) {\n        var posmap = new Map(poslist);\n        var room = rooms.get(roomId);\n        room.ready = room.ready + 1;\n        if (room.ready === 1) {\n            // 先手\n            order1 = posmap;\n            if (room.player1.name === name) {\n                io.to(room.player1.id).emit('wait placing');\n            }\n            else {\n                io.to(room.player2.id).emit('wait placing');\n            }\n        }\n        else if (room.ready === 2) {\n            // 後手\n            order2 = posmap;\n            if (room.player1.name === name) {\n                room.player1.turn = 1;\n            }\n            else {\n                room.player2.turn = 1;\n            }\n            room.state = 'playing';\n            board1 = initBoard(order1, order2, 0);\n            board2 = initBoard(order1, order2, 1);\n            io.to(roomId).emit('watch', board1);\n            io.to(room.player1.turn === 0 ? room.player1.id : room.player2.id)\n                .emit('game', board1, 0, true);\n            io.to(room.player1.turn === 1 ? room.player1.id : room.player2.id)\n                .emit('game', board2, 1, false);\n        }\n    });\n    socket.on('disconnect', function () {\n        var info = socket.info;\n        // 接続が切れたとき\n        if (info) {\n            // ルームに入っていたとき\n            if (info.role === 'play') {\n                // 対戦者としてルームにいたとき\n                rooms.delete(info.roomId);\n                // 観戦者ともう一方の対戦者も退出させる\n                socket.to(info.roomId).leave(info.roomId);\n                socket.to(info.roomId).emit('player discon', info.name);\n            }\n        }\n    });\n});\nvar port = process.env.PORT || 3000;\nserver.listen(port, function () {\n    console.log(\"listening on \" + port);\n});\n\n\n//# sourceURL=webpack://geister-online/./server.ts?");

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