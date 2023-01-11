"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql_list_to_update = exports.sql_list_to_delete = exports.sql_list_old_list = exports.sql_list_init = exports.sql_grad_view = exports.sql_grad_init = exports.sql_details = void 0;
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
            FROM ${tables_1.table_names.depart_stu_num} AS depart
            JOIN 
                (SELECT pn.* 
                FROM ${tables_1.table_names.people_num} AS pn
                JOIN  ${tables_1.table_names.lec_info} AS info
                ON info."학수번호" = pn."학수번호"
                    AND info."설강소속코드" = pn."설강소속코드"
                    AND info."수업번호" = ${lec_num}) AS pn2
            ON depart."수업번호" = pn2."수업번호";
            `
    ];
};
exports.sql_details = sql_details;
const sql_grad_init = (stu_id) => {
    return `
            SELECT 
                "전공구분명",
                "이수명",
                "기준",
                "이수" 
            FROM ${tables_1.table_names.grad} 
            WHERE "학번" = '${stu_id}';
            `;
};
exports.sql_grad_init = sql_grad_init;
const sql_grad_view = (stu_id) => {
    return `
            SELECT
                "이수구분코드명",
                "영역코드명",
                "학점"::smallint,
                "특수수업구분",
                "이수단위"
            FROM ${tables_1.table_names.lec_info} AS info
            JOIN ${tables_1.table_names.list} AS list
            ON list."수업번호" = info."수업번호" 
                AND list."학번" = '${stu_id}'
                AND list."상태" = 1;
            `;
};
exports.sql_grad_view = sql_grad_view;
const sql_list_init = (stu_id) => {
    return `
            SELECT 
                info."수업번호",
                info."과목명",
                info."대표교강사명",
                REPLACE(info."수업시간", ',', '<br />') AS "수업시간",
                list."상태" AS state
            FROM ${tables_1.table_names.list} AS list 
            JOIN ${tables_1.table_names.lec_info} AS info
            ON list."학번" = '${stu_id}' 
                AND list."상태" != -1
                AND list."수업번호" = info."수업번호"; 
            `;
};
exports.sql_list_init = sql_list_init;
const sql_list_old_list = (stu_id) => {
    return `
            SELECT 
                list."수업번호",
                list."상태" AS state
            FROM ${tables_1.table_names.list} AS list
            WHERE list."학번" = '${stu_id}'
                AND list."상태" != -1;
            `;
};
exports.sql_list_old_list = sql_list_old_list;
const sql_list_to_delete = (stu_id, lec_num) => {
    return `
            UPDATE 
                ${tables_1.table_names.list} AS list
            SET
                list."상태" = -1;
            WHERE 
                list."학번" = '${stu_id}'
                AND list."수업번호" = ${lec_num};
            `;
};
exports.sql_list_to_delete = sql_list_to_delete;
const sql_list_to_update = (stu_id, lec_num, state) => {
    return `
            INSERT 
                ${tables_1.table_names.list} AS list
            VALUE 
                (${stu_id}, ${lec_num}, ${state})
            ON CONFLIT (list."수업번호")
            DO  UPDATE
                SET list."상태" = ${state};
            `;
};
exports.sql_list_to_update = sql_list_to_update;
