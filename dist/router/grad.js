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
const tables_1 = require("../database/tables");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let stu_id = req.query.stu_id;
    console.log("Request: look up graduation: " + stu_id);
    let sql = `
                        SELECT 
                            "전공구분명",
                            "이수명",
                            "기준",
                            "이수" 
                        FROM ${tables_1.table_names.grad} 
                        WHERE "학번" = '${stu_id}';
                        `;
    try {
        let rows = (yield db_1.db.query(sql)).rows;
        let result = { status: [], list: [] };
        result.status = rows;
        sql = `
                SELECT * 
                FROM ${tables_1.table_names.grad} AS info
                JOIN ${tables_1.table_names.list} AS list
                ON list."수업번호" = info."수업번호" 
                    AND list."학번" = '${stu_id}'
                    AND list."상태" = 1;
                `;
        rows = (yield db_1.db.query(sql)).rows;
        result.list = rows;
        res.send(result);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("grad error" + err);
        }
        else {
            console.log("grad error" + err);
        }
        res.status(500).send("Error");
    }
}));
