/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_1__);\nvar __values = (undefined && undefined.__values) || function(o) {\r\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === \"number\") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\r\n};\r\nvar __read = (undefined && undefined.__read) || function (o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n};\r\nvar __spread = (undefined && undefined.__spread) || function () {\r\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n};\r\n\r\n\r\nvar app = express__WEBPACK_IMPORTED_MODULE_0__();\r\napp.use(express__WEBPACK_IMPORTED_MODULE_0__.static(process.cwd() + '/public'));\r\nvar server = http__WEBPACK_IMPORTED_MODULE_1__.createServer(app);\r\nvar io = __webpack_require__(/*! socket.io */ \"socket.io\")(server, {\r\n    cors: {\r\n        origin: 'https://geister-online.netlify.app',\r\n        methods: ['GET', 'POST']\r\n    }\r\n});\r\napp.get('/', function (req, res) {\r\n    res.sendFile(process.cwd() + '/public/ja/index.html');\r\n});\r\n/** 部屋番号と部屋のデータの Map\r\n * @property players 先に入室したプレイヤー、後から入室したプレイヤー\r\n * @property state 部屋の状態\r\n * @property ready 駒の配置の準備が完了したプレイヤー数\r\n * @property orders 先手、後手の初期配置\r\n * @property boards 先手、後手から見た盤面\r\n * @property curTurn 現在のターン\r\n * @property takenPieces それぞれが取った駒の色と数\r\n * @property winner 勝者 0 - 先手, 1 - 後手\r\n*/\r\nvar rooms = new Map();\r\n/** 先手の初期配置 */\r\n//let order1: Map<string, 'R' | 'B'>;\r\n/** 後手の初期配置 */\r\n//let order2: Map<string, 'R' | 'B'>;\r\n/** 先手から見た盤面 */\r\n//let board1: Map<string, {color: 'R' | 'B', turn: 0 | 1}>;\r\n/** 後手から見た盤面 */\r\n//let board2: Map<string, {color: 'R' | 'B', turn: 0 | 1}>;\r\n/** 現在のターン */\r\n//let curTurn: 0 | 1 = 0;\r\n/** 勝者 0 - 先手, 1 - 後手 */\r\n//let winner: 0 | 1;\r\n/**\r\n * 初期盤面を生成する\r\n * @param order1 先手の初期配置\r\n * @param order2 後手の初期配置\r\n * @param turn どちら目線か\r\n * @returns クライアントへの転送のためシリアライズされた Map\r\n */\r\nvar initBoard = function (order1, order2, turn) {\r\n    var e_1, _a, e_2, _b;\r\n    var m = new Map();\r\n    try {\r\n        for (var order1_1 = __values(order1), order1_1_1 = order1_1.next(); !order1_1_1.done; order1_1_1 = order1_1.next()) {\r\n            var _c = __read(order1_1_1.value, 2), k = _c[0], v = _c[1];\r\n            var _d = __read(k.split(',').map(function (e) { return +e; }), 2), x = _d[0], y = _d[1];\r\n            if (turn === 0) {\r\n                m.set(x + \",\" + (y + 2), { color: v, turn: 0 });\r\n            }\r\n            else {\r\n                m.set(5 - x + \",\" + (3 - y), { color: v, turn: 0 });\r\n            }\r\n        }\r\n    }\r\n    catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n    finally {\r\n        try {\r\n            if (order1_1_1 && !order1_1_1.done && (_a = order1_1.return)) _a.call(order1_1);\r\n        }\r\n        finally { if (e_1) throw e_1.error; }\r\n    }\r\n    try {\r\n        for (var order2_1 = __values(order2), order2_1_1 = order2_1.next(); !order2_1_1.done; order2_1_1 = order2_1.next()) {\r\n            var _e = __read(order2_1_1.value, 2), k = _e[0], v = _e[1];\r\n            var _f = __read(k.split(',').map(function (e) { return +e; }), 2), x = _f[0], y = _f[1];\r\n            if (turn === 0) {\r\n                m.set(5 - x + \",\" + (3 - y), { color: v, turn: 1 });\r\n            }\r\n            else {\r\n                m.set(x + \",\" + (y + 2), { color: v, turn: 1 });\r\n            }\r\n        }\r\n    }\r\n    catch (e_2_1) { e_2 = { error: e_2_1 }; }\r\n    finally {\r\n        try {\r\n            if (order2_1_1 && !order2_1_1.done && (_b = order2_1.return)) _b.call(order2_1);\r\n        }\r\n        finally { if (e_2) throw e_2.error; }\r\n    }\r\n    return __spread(m);\r\n};\r\n/**\r\n * side が勝利条件を満たすか\r\n * @param taken それぞれが取った駒の色と数\r\n * @param posOnBoard 盤面上にある駒の位置リスト\r\n * @param side 先手か後手か\r\n * @param moved side が今駒を動かしたか\r\n */\r\nvar winReq = function (taken, posOnBoard, side, moved) {\r\n    if (moved) {\r\n        // 青を4つ取った\r\n        // or 青が盤面に出た\r\n        return (taken[side]['B'] === 4\r\n            || (posOnBoard.indexOf('0,-1') !== -1\r\n                || posOnBoard.indexOf('5,-1') !== -1));\r\n    }\r\n    else {\r\n        // 赤を4つ取らせた\r\n        return taken[(side + 1) % 2]['R'] === 4;\r\n    }\r\n};\r\nio.on('connection', function (socket) {\r\n    socket.on('enter room', \r\n    /**\r\n     * 入室したときのサーバ側の処理\r\n     * @param info 入室者のデータ\r\n     */\r\n    function (info) {\r\n        socket.info = info;\r\n        var room = rooms.get(info.roomId);\r\n        if (info.role === 'play') {\r\n            // 対戦者として参加\r\n            if (room) {\r\n                // 指定のルームに対戦者がいたとき\r\n                if (room.state === 'waiting opponent') {\r\n                    // 対戦者が1人待機している\r\n                    room.players[1] = {\r\n                        id: socket.id,\r\n                        name: info.name\r\n                    };\r\n                    room.state = 'waiting placing';\r\n                    socket.join(info.roomId);\r\n                    io.to(info.roomId).emit('wait placing');\r\n                    io.to(room.players[0].id).emit('place pieces');\r\n                    io.to(room.players[1].id).emit('place pieces');\r\n                }\r\n                else {\r\n                    // 対戦者がすでに2人いる\r\n                    socket.emit('room full', info.roomId);\r\n                    socket.info.role = 'watch';\r\n                }\r\n            }\r\n            else {\r\n                // 新たにルームを作成する\r\n                rooms.set(info.roomId, {\r\n                    players: [\r\n                        {\r\n                            id: socket.id,\r\n                            name: info.name\r\n                        },\r\n                        {\r\n                            id: '',\r\n                            name: ''\r\n                        }\r\n                    ],\r\n                    state: 'waiting opponent',\r\n                    ready: 0,\r\n                    orders: [new Map(), new Map()],\r\n                    boards: [new Map(), new Map()],\r\n                    curTurn: 0,\r\n                    takenPieces: [{ 'R': 0, 'B': 0 }, { 'R': 0, 'B': 0 }],\r\n                    winner: null\r\n                });\r\n                socket.join(info.roomId);\r\n                socket.emit('wait opponent');\r\n            }\r\n        }\r\n        else {\r\n            // 観戦者として参加\r\n            if (room) {\r\n                // 指定のルームが存在するとき\r\n                socket.join(info.roomId);\r\n                if (room.state === 'waiting opponent') {\r\n                    // 対戦者が1人待機している\r\n                    socket.emit('wait opponent');\r\n                }\r\n                else if (room.state === 'waiting placing') {\r\n                    // 対戦者が駒の配置を決めている\r\n                    socket.emit('wait placing');\r\n                }\r\n                else {\r\n                    // 対戦者がすでに2人いて対戦中\r\n                    socket.emit('watch', __spread(room.boards[0]), room.players[0].name, room.players[1].name, room.curTurn, room.takenPieces);\r\n                    if (room.winner === 0 || room.winner === 1) {\r\n                        socket.emit('tell winner to audience and first', [room.players[0].name, room.players[1].name][room.winner], __spread(room.boards[0]), room.players[0].name, room.players[1].name, room.takenPieces);\r\n                    }\r\n                }\r\n            }\r\n            else {\r\n                // 指定したルームがないとき\r\n                socket.emit('no room', info.roomId);\r\n            }\r\n        }\r\n    });\r\n    socket.on('decided place', \r\n    /**\r\n     * 駒の配置を決定したときのサーバ側の処理\r\n     * @param poslist どこにどの色の駒を配置したかを表すリスト\r\n     */\r\n    function (poslist) {\r\n        var roomId = socket.info.roomId;\r\n        var posmap = new Map(poslist);\r\n        var room = rooms.get(roomId);\r\n        room.ready = room.ready + 1;\r\n        if (room.ready === 1) {\r\n            // 先手\r\n            room.orders[0] = posmap;\r\n            if (room.players[0].id === socket.id) {\r\n                io.to(room.players[0].id).emit('wait placing');\r\n            }\r\n            else {\r\n                io.to(room.players[1].id).emit('wait placing');\r\n            }\r\n        }\r\n        else if (room.ready === 2) {\r\n            // 後手\r\n            room.orders[1] = posmap;\r\n            if (room.players[0].id === socket.id) {\r\n                room.players.reverse();\r\n            }\r\n            room.state = 'playing';\r\n            room.boards[0] = new Map(initBoard(room.orders[0], room.orders[1], 0));\r\n            room.boards[1] = new Map(initBoard(room.orders[0], room.orders[1], 1));\r\n            io.to(roomId).emit('watch', __spread(room.boards[0]), room.players[0].name, room.players[1].name, room.curTurn, room.takenPieces);\r\n            io.to(room.players[0].id).emit('game', __spread(room.boards[0]), 0, true, room.players[0].name, room.players[1].name, room.takenPieces);\r\n            io.to(room.players[1].id).emit('game', __spread(room.boards[1]), 1, false, room.players[0].name, room.players[1].name, room.takenPieces);\r\n        }\r\n    });\r\n    socket.on('move piece', \r\n    /**\r\n     * 駒を動かしたときのサーバ側の処理\r\n     * @param turn 動かした人が先手か後手か\r\n     * @param origin 駒の移動元の位置。ゲーム内座標\r\n     * @param dest 駒の移動先の位置。ゲーム内座標\r\n     */\r\n    function (turn, origin, dest) {\r\n        var roomId = socket.info.roomId;\r\n        var room = rooms.get(roomId);\r\n        var board = [room.boards[0], room.boards[1]][turn];\r\n        var another = [room.boards[0], room.boards[1]][(turn + 1) % 2];\r\n        // 相手の駒を取ったとき\r\n        if (board.has(String(dest)) && board.get(String(dest)).turn !== turn) {\r\n            // 取った駒の色を記録する\r\n            room.takenPieces[turn][board.get(String(dest)).color] += 1;\r\n        }\r\n        var takenPieces = room.takenPieces;\r\n        // turn 目線のボードを更新する\r\n        board.set(String(dest), board.get(String(origin)));\r\n        board.delete(String(origin));\r\n        // 座標変換\r\n        origin = origin.map(function (x) { return 5 - x; });\r\n        dest = dest.map(function (x) { return 5 - x; });\r\n        // 相手目線のボードを更新する\r\n        another.set(String(dest), another.get(String(origin)));\r\n        another.delete(String(origin));\r\n        // ターン交代\r\n        room.curTurn = (room.curTurn + 1) % 2;\r\n        // 勝敗判定\r\n        if (winReq(takenPieces, Array.from(board.keys()), turn, true)) {\r\n            room.winner = turn;\r\n        }\r\n        else if (winReq(takenPieces, Array.from(board.keys()), (turn + 1) % 2, false)) {\r\n            room.winner = (turn + 1) % 2;\r\n        }\r\n        var winner = room.winner;\r\n        // 盤面データをクライアントへ\r\n        io.to(roomId).emit('watch', __spread(room.boards[0]), room.players[0].name, room.players[1].name, room.curTurn, takenPieces);\r\n        io.to(room.players[0].id).emit('game', __spread(room.boards[0]), 0, room.curTurn === 0, room.players[0].name, room.players[1].name, takenPieces);\r\n        io.to(room.players[1].id).emit('game', __spread(room.boards[1]), 1, room.curTurn === 1, room.players[0].name, room.players[1].name, takenPieces);\r\n        // 勝者を通知する\r\n        if (winner === 0 || winner === 1) {\r\n            io.to(roomId).emit('tell winner to audience and first', [room.players[0].name, room.players[1].name][winner], __spread(room.boards[0]), room.players[0].name, room.players[1].name, takenPieces);\r\n            io.to(room.players[1].id).emit('tell winner to second', [room.players[0].name, room.players[1].name][winner], __spread(room.boards[1]), room.players[0].name, room.players[1].name, takenPieces);\r\n        }\r\n    });\r\n    socket.on('chat message', function (msg) {\r\n        io.to(socket.info.roomId).emit('chat message', msg, socket.info.role === 'play', socket.info.name);\r\n    });\r\n    socket.on('disconnect', function () {\r\n        var info = socket.info;\r\n        // 接続が切れたとき\r\n        if (info) {\r\n            // ルームに入っていたとき\r\n            if (info.role === 'play') {\r\n                // 対戦者としてルームにいたとき\r\n                rooms.delete(info.roomId);\r\n                // 観戦者ともう一方の対戦者も退出させる\r\n                socket.to(info.roomId).leave(info.roomId);\r\n                socket.to(info.roomId).emit('player discon', info.name);\r\n            }\r\n        }\r\n    });\r\n});\r\nserver.listen(process.env.PORT || 3000);\r\n\n\n//# sourceURL=webpack://geister-online/./server.ts?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");;

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");;

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