"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./database/db");
const grad_1 = require("./router/grad");
const details_1 = require("./router/details");
const list_1 = require("./router/list");
const recommend_1 = require("./router/recommend");
const test_1 = require("./router/test");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 1324;
//db 연결
db_1.db.connect();
//CORS 설정
app.use((0, cors_1.default)());
//POST 요청 처리를 위한 미들웨어
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//라우터 연결
app.use('/details', details_1.router);
app.use('/grad', grad_1.router);
app.use('/list', list_1.router);
app.use('/recommend', recommend_1.router);
//테스팅 라우터
app.use('/test', test_1.router);
//에러 처리
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Unknown Error');
});
app.listen(port, () => {
    console.log("Server Start");
});
