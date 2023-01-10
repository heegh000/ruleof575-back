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
        // let sql : string =  `
        //                     SELECT *
        //                     FROM ${tables.lec_info} AS info
        //                     JOIN ${tables.pp} as pp
        //                     ON info."수업번호" = ${lec_num} 
        //                         AND pp."수업번호" = info."수업번호" ;
        //                     `;
        let rows = (yield db_1.db.query(sql[0])).rows;
        let result = {
            lec: {},
            pn: {},
            depart: []
        };
        result.lec = rows;
        // sql =   `
        //         SELECT * 
        //         FROM ${tables.depart_stu_num} as depart
        //         JOIN 
        //             (SELECT pn.* 
        //             FROM ${tables.people_num} as pn
        //             JOIN  ${tables.lec_info} AS info
        //             ON info."학수번호" = pn."학수번호"
        //                 AND info."설강소속코드" = pn."설강소속코드"
        //                 AND info."수업번호" = ${lec_num}) as pn2
        //         ON depart."수업번호" = pn2."수업번호";
        //         `;
        rows = (yield db_1.db.query(sql[1])).rows;
        for (let i in rows) {
            if (+i == 0) {
                result.pn = {
                    제한인원: rows[i].제한인원,
                    신청인원: rows[i].신청인원,
                    다중전공배당인원: rows[i].다중전공배당인원,
                    증원인원: rows[i].증원인원,
                    희망수업등록인원: rows[i].희망수업등록인원
                };
            }
            result.depart.push({
                희망신청소속: rows[i].희망신청소속,
                학생수: rows[i].학생수
            });
        }
        res.send(result);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("details error: " + err);
        }
        else {
            console.log("Unknwon details error: " + err);
        }
        res.status(500).send("Error");
    }
}));
