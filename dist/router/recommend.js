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
const util_1 = require("../utils/util");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let time_blocks = req.body.time_blocks;
        let intervals = (0, util_1.get_intervals)(time_blocks);
        let lecs;
        let nt_lecs;
        let nt_lec;
        let sql = (0, sql_1.sql_recommend)(intervals);
        lecs = (yield db_1.db.query(sql)).rows;
        sql = (0, sql_1.sql_recommend_nt)();
        nt_lecs = (yield db_1.db.query(sql)).rows;
        for (nt_lec of nt_lecs) {
            let idx = lecs.findIndex((l) => { return l.영역코드명 == nt_lec.영역코드명; });
            if (idx == -1) {
                lecs.push(nt_lec);
            }
            else {
                lecs[idx].수업목록 = [].concat(lecs[idx].수업목록, nt_lec.수업목록);
            }
        }
        res.send(lecs);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("recommend error " + err);
        }
        else {
            console.log("Unknwon recommend error: " + err);
        }
        res.status(500).send("Fail recommend");
    }
}));
