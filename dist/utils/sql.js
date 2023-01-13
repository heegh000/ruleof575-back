"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql_recommend = exports.sql_list_update = exports.sql_list_old_list = exports.sql_list_init = exports.sql_grad_view = exports.sql_grad_init = exports.sql_details = void 0;
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
            SELECT 
                prev_lecs."수업번호",
                prev_lecs."제한인원",
                prev_lecs."신청인원",
                prev_lecs."다중전공배당인원",
                prev_lecs."증원인원",
                prev_lecs."희망수업등록인원",
                depart."희망신청소속",
                depart."학생수"
            FROM 
                (SELECT
                    pn."수업번호",
                    pn."제한인원",
                    pn."신청인원",
                    pn."다중전공배당인원",
                    pn."증원인원",
                    pn."희망수업등록인원"
                FROM	
                    (SELECT 
                        "학수번호",
                        "설강소속코드"
                    FROM ${tables_1.table_names.lec_info}
                    WHERE "수업번호" = ${lec_num} ) AS lec
                JOIN ${tables_1.table_names.people_num} AS pn
                ON pn."학수번호" = lec."학수번호"
                    AND pn."설강소속코드" = lec."설강소속코드") AS prev_lecs
            JOIN ${tables_1.table_names.depart_stu_num} AS depart
            ON depart."수업번호" = prev_lecs."수업번호"
            ORDER BY prev_lecs."수업번호";
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
                tp_list."요일",
                tp_list."시작시간",
                tp_list."끝시간",
                tp_list."상태" AS state
            FROM 
                (SELECT
                    list."수업번호",
                    list."상태",
                    ARRAY_AGG(tp."요일") AS "요일",
                    ARRAY_AGG(tp."시작시간") AS "시작시간",
                    ARRAY_AGG(tp."끝시간") AS "끝시간"
                FROM ${tables_1.table_names.list} AS list
                JOIN ${tables_1.table_names.time_place} AS tp
                ON list."상태" != -1
                    AND list."학번" = '${stu_id}'
                    AND list."수업번호" = tp."수업번호"
                    AND (tp."요일" = '시간미지정강좌' OR tp."시작시간" IS NOT NULL)
                GROUP BY list."수업번호", list."상태") AS tp_list
            JOIN ${tables_1.table_names.lec_info} AS info
            ON info."수업번호" = tp_list."수업번호";
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
const sql_list_update = (stu_id, lecs_to_update) => {
    let sql = `
            INSERT INTO
                ${tables_1.table_names.list} ("학번", "수업번호", "상태")
            VALUES\n`;
    let lec;
    for (lec of lecs_to_update) {
        sql += `                ('${stu_id}', ${lec.수업번호}, ${lec.state}),\n`;
    }
    sql = sql.slice(0, -2);
    sql += `
            ON CONFLICT 
                ("수업번호")
            DO UPDATE SET "상태" = EXCLUDED."상태";`;
    return sql;
};
exports.sql_list_update = sql_list_update;
const sql_recommend = (intervals) => {
    let sql = `
            SELECT 
                recom_info_list."영역코드명",
                ARRAY_agg(json_build_object(
                    '수업번호', recom_info_list."수업번호", 
                    '과목명', recom_info_list."과목명",
                    '대표교강사명', recom_info_list."대표교강사명",
                    '수업시간', recom_info_list."수업시간",
                    '요일', recom_info_list."요일",
                    '시작시간', recom_info_list."시작시간",
                    '끝시간', recom_info_list."끝시간" 
                )) AS "수업목록"
            FROM
                (SELECT
                    info."수업번호",
                    info."과목명",
                    info."대표교강사명",
                    REPLACE(info."수업시간", ',', '<br />') AS "수업시간",
                    info."이수구분코드명",
                    info."영역코드명",
                    recom."요일",
                    recom."시작시간",
                    recom."끝시간"
                FROM
                    (SELECT
                        tp."수업번호",
                        ARRAY_AGG(tp."요일") AS "요일",
                        ARRAY_AGG(tp."시작시간") AS "시작시간",
                        ARRAY_AGG(tp."끝시간") AS "끝시간"
                    FROM
                        (SELECT 
                            "수업번호",
                            COUNT("수업번호") :: smallint AS cnt
                        FROM 
                            ${tables_1.table_names.time_place}
                        WHERE false\n`;
    let day;
    let time;
    for (day in intervals) {
        for (time of intervals[day]) {
            sql += `                            `;
            sql += `OR ("요일" = '${day}' AND "시작시간" >= '${time.start}'::time AND "끝시간" <= '${time.end}'::time)\n`;
        }
    }
    sql += `
                        GROUP BY "수업번호") AS searched
                    JOIN ${tables_1.table_names.time_place} AS tp	
                    ON tp."수업번호" = searched."수업번호"
                        AND (tp."시작시간" IS NOT NULL AND "끝시간" IS NOT NULL)
                    GROUP BY tp."수업번호", searched.cnt
                    HAVING COUNT(tp."수업번호") = searched.cnt) AS recom
                JOIN ${tables_1.table_names.lec_info} AS info
                ON info."수업번호" = recom."수업번호"
                    AND (info."이수구분코드" = 111 OR info."이수구분코드" = 711)) AS recom_info_list
            GROUP BY recom_info_list."영역코드명"
            ORDER BY recom_info_list."영역코드명"
            `;
    return sql;
};
exports.sql_recommend = sql_recommend;
