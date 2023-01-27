"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const db_1 = require("../database/db");
const crypto_1 = __importDefault(require("crypto"));
const sql_1 = require("../utils/sql");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/init', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stu_id = req.query.stu_id;
        stu_id = crypto_1.default.createHash('sha512').update(stu_id).digest("base64");
        let sql = (0, sql_1.sql_grad_init)(stu_id);
        let rows;
        let result = {
            grads: [],
        };
        console.log("Request: grad init after login: " + stu_id);
        rows = (yield db_1.db.query(sql)).rows;
        result.grads = rows;
        res.send(result);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("grad error: " + err);
        }
        else {
            console.log("Unknown grad error: " + err);
        }
        res.status(500).send("Error");
    }
}));
router.get('/view', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stu_id = req.query.stu_id;
        stu_id = crypto_1.default.createHash('sha512').update(stu_id).digest("base64");
        let sql = (0, sql_1.sql_grad_view)(stu_id);
        let rows;
        let result = {
            list: []
        };
        console.log("Request: current lecture list for grad: " + stu_id);
        rows = (yield db_1.db.query(sql)).rows;
        result.list = rows;
        res.send(result);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("grad error: " + err);
        }
        else {
            console.log("Unknown grad error: " + err);
        }
        res.status(500).send("Error");
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stu_id = req.body.stu_id;
        stu_id = crypto_1.default.createHash('sha512').update(stu_id).digest("base64");
        let list = req.body.list;
        console.log(list);
        let sql = (0, sql_1.sql_grad_update)(stu_id, list);
        console.log(sql);
        if (list.length != 0) {
            yield db_1.db.query(sql);
        }
        res.send("Sueccess grad update");
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("grad update error: " + err);
        }
        else {
            console.log("Unknown grad update error: " + err);
        }
        res.status(500).send("Error");
    }
}));
