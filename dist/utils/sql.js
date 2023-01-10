"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql_list_init = exports.sql_grad = exports.sql_details = void 0;
const tables_1 = require("../database/tables");
const sql_details = (lec_num) => {
    return [
        `
            SELECT *
            FROM ${tables_1.table_names.lec_info} AS info
            JOIN ${tables_1.table_names.pp} as pp
            ON info."수업번호" = ${lec_num} 
                AND pp."수업번호" = info."수업번호" ;
            `,
        `
            SELECT * 
            FROM ${tables_1.table_names.depart_stu_num} as depart
            JOIN 
                (SELECT pn.* 
                FROM ${tables_1.table_names.people_num} as pn
                JOIN  ${tables_1.table_names.lec_info} AS info
                ON info."학수번호" = pn."학수번호"
                    AND info."설강소속코드" = pn."설강소속코드"
                    AND info."수업번호" = ${lec_num}) as pn2
            ON depart."수업번호" = pn2."수업번호";
            `
    ];
};
exports.sql_details = sql_details;
const sql_grad = (stu_id) => {
    return [
        `
            SELECT 
                "전공구분명",
                "이수명",
                "기준",
                "이수" 
            FROM ${tables_1.table_names.grad} 
            WHERE "학번" = '${stu_id}';
            `,
        `
            SELECT * 
            FROM ${tables_1.table_names.lec_info} AS info
            JOIN ${tables_1.table_names.list} AS list
            ON list."수업번호" = info."수업번호" 
                AND list."학번" = '${stu_id}'
                AND list."상태" = 1;
            `
    ];
};
exports.sql_grad = sql_grad;
const sql_list_init = (stu_id) => {
    return `
            SELECT 
                info."수업번호",
                info."과목명",
                info."대표교강사명",
                REPLACE(info."수업시간", ',', '<br />') AS "수업시간",
                CASE WHEN list."상태" = 1
                        THEN true :: boolean
                        ELSE false :: boolean
                END AS value
            FROM ${tables_1.table_names.list} AS list 
            JOIN ${tables_1.table_names.lec_info} AS info
            ON list."학번" = '${stu_id}' 
                AND list."상태" != -1
                AND list."수업번호" = info."수업번호"; 
            `;
};
exports.sql_list_init = sql_list_init;
