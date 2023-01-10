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
        console.log("Request: init list after login: " + stu_id);
        let sql = (0, sql_1.sql_list_init)(stu_id);
        // let sql : string =  `
        //                     SELECT 
        //                         info."수업번호",
        //                         info."과목명",
        //                         info."대표교강사명",
        //                         REPLACE(info."수업시간", ',', '<br />') AS "수업시간",
        //                         CASE WHEN list."상태" = 1
        //                              THEN true :: boolean
        //                              ELSE false :: boolean
        //                         END AS value
        //                     FROM ${tables.list} AS list 
        //                     JOIN ${tables.lec_info} AS info
        //                     ON list."학번" = '${stu_id}' 
        //                         AND list."상태" != -1
        //                         AND list."수업번호" = info."수업번호"; 
        //                     `;
        let rows = (yield db_1.db.query(sql)).rows;
        res.send(rows);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("list login error: " + err);
        }
        else {
            console.log("Unknwon list login error: " + err);
        }
        res.status(500).send("Error");
    }
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("update");
    console.log(req.body);
    res.send("ASDSADSADAS");
}));
