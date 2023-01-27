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
        let content = {
            list: []
        };
        let stu_id = req.query.stu_id;
        stu_id = crypto_1.default.createHash('sha512').update(stu_id).digest("base64");
        console.log("Request: list init after login: " + stu_id);
        let sql = (0, sql_1.sql_list_init)(stu_id);
        content.list = (yield db_1.db.query(sql)).rows;
        res.send(content.list);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("list init: " + err);
        }
        else {
            console.log("Unknwon list init: " + err);
        }
        res.status(500).send("Fali list init");
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stu_id = req.body.stu_id;
        stu_id = crypto_1.default.createHash('sha512').update(stu_id).digest("base64");
        let sql = (0, sql_1.sql_list_old_list)(stu_id);
        let old_list;
        old_list = (yield db_1.db.query(sql)).rows;
        let new_list = req.body.list;
        let new_lec;
        for (new_lec of new_list) {
            new_lec.state = new_lec.isInTable;
            delete new_lec.isInTable;
        }
        let lecs_to_del = old_list.filter((ele1) => !new_list.some((ele2) => ele1.수업번호 == ele2.수업번호));
        let lecs_to_update = new_list.filter((ele1) => !old_list.some((ele2) => ele1.수업번호 == ele2.수업번호 && ele1.state == ele2.state));
        let lec;
        for (lec of lecs_to_del) {
            lec.state = -1;
        }
        console.log("ASDSAD");
        lecs_to_update = lecs_to_update.concat(lecs_to_del);
        if (lecs_to_update.length != 0) {
            sql = (0, sql_1.sql_list_update)(stu_id, lecs_to_update);
            yield db_1.db.query(sql);
        }
        res.send("Sueccess list update");
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("list update error " + err);
        }
        else {
            console.log("Unknwon list update error: " + err);
        }
        res.status(500).send("Fail list update");
    }
}));
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let content = {
            list: []
        };
        let keyword = req.query.keyword;
        let sql = (0, sql_1.sql_list_search)(keyword);
        content.list = (yield db_1.db.query(sql)).rows;
        res.send(content.list);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("list search error " + err);
        }
        else {
            console.log("Unknwon list search error: " + err);
        }
        res.status(500).send("Fail list search");
    }
}));
