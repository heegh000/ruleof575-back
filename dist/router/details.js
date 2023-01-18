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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let lec_num = req.query.lec_num;
        let sql = (0, sql_1.sql_details)(lec_num);
        let rows;
        let result = {
            lec_info: {},
            prev_infos: []
        };
        rows = (yield db_1.db.query(sql[0])).rows;
        result.lec_info = rows[0];
        rows = (yield db_1.db.query(sql[1])).rows;
        let save_num = -1;
        let save_idx = -1;
        for (let row of rows) {
            if (save_num != row.수업번호) {
                save_num = row.수업번호;
                save_idx++;
                result.prev_infos.push({
                    수업번호: row.수업번호,
                    제한인원: row.제한인원,
                    신청인원: row.신청인원,
                    다중전공배당인원: row.다중전공배당인원,
                    증원인원: row.증원인원,
                    희망수업등록인원: row.희망수업등록인원,
                    희망수업세부정보: []
                });
            }
            result.prev_infos[save_idx].희망수업세부정보.push({
                희망신청소속: row.희망신청소속,
                학생수: row.학생수
            });
        }
        res.send(result);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("details error: " + err.message);
        }
        else {
            console.log("Unknwon details error: " + err);
        }
        res.status(500).send("Error");
    }
}));
