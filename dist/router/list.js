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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const db_1 = require("../database/db");
const sql_1 = require("../utils/sql");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/init', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stu_id = req.query.stu_id;
        let sql = (0, sql_1.sql_list_init)(stu_id);
        let rows;
        console.log("Request: list init after login: " + stu_id);
        rows = (yield db_1.db.query(sql)).rows;
        res.send(rows);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("list init error: " + err);
        }
        else {
            console.log("Unknwon list init error: " + err);
        }
        res.status(500).send("Error");
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stu_id = req.body.stu_id;
        let new_list = req.body.list;
        let sql = (0, sql_1.sql_list_old_list)(stu_id);
        let old_list;
        let target;
        old_list = (yield db_1.db.query(sql)).rows;
        let to_delete = old_list.filter((ele1) => {
            !new_list.some((ele2) => {
                ele1.num == ele2.num && ele1.state == ele2.state;
            });
        });
        // for (target of to_delete) {
        //     sql = sql_list_to_delete(stu_id, target.수업번호);
        //     (await db.query(sql));
        // }
        let to_update = new_list.filter((ele1) => {
            !old_list.some((ele2) => {
                ele1.num == ele2.num && ele1.state == ele2.state;
            });
        });
        console.log(old_list);
        console.log(new_list);
        console.log(to_delete);
        console.log(to_update);
        // for (target of to_update) {
        //     sql = sql_list_to_update(stu_id, target.수업번호, target.state);
        //     (await db.query(sql));
        // }
        res.send({ to_del: to_delete, to_up: to_update });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("list update error " + err);
        }
        else {
            console.log("Unknwon list update error: " + err);
        }
        res.status(500).send("Error");
    }
}));
