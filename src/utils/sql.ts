import { table_names as tables } from "../database/tables";

const sql_details = (lec_num : number) : string[] => {
    return [
            `
            SELECT *
            FROM ${tables.lec_info} AS info
            JOIN ${tables.pp} as pp
            ON info."수업번호" = ${lec_num} 
                AND pp."수업번호" = info."수업번호" ;
            `,

            `
            SELECT * 
            FROM ${tables.depart_stu_num} AS depart
            JOIN 
                (SELECT pn.* 
                FROM ${tables.people_num} AS pn
                JOIN  ${tables.lec_info} AS info
                ON info."학수번호" = pn."학수번호"
                    AND info."설강소속코드" = pn."설강소속코드"
                    AND info."수업번호" = ${lec_num}) AS pn2
            ON depart."수업번호" = pn2."수업번호";
            `
    ];
};

const sql_grad_init = (stu_id : string) : string => {
    return  `
            SELECT 
                "전공구분명",
                "이수명",
                "기준",
                "이수" 
            FROM ${tables.grad} 
            WHERE "학번" = '${stu_id}';
            `;
};

const sql_grad_view = (stu_id : string) : string => {
    return  `
            SELECT
                "이수구분코드명",
                "영역코드명",
                "학점"::smallint,
                "특수수업구분",
                "이수단위"
            FROM ${tables.lec_info} AS info
            JOIN ${tables.list} AS list
            ON list."수업번호" = info."수업번호" 
                AND list."학번" = '${stu_id}'
                AND list."상태" = 1;
            `;
};

const sql_list_init = (stu_id : string) : string => {
    return  `
            SELECT 
                info."수업번호",
                info."과목명",
                info."대표교강사명",
                REPLACE(info."수업시간", ',', '<br />') AS "수업시간",
                list."상태" AS state
            FROM ${tables.list} AS list 
            JOIN ${tables.lec_info} AS info
            ON list."학번" = '${stu_id}' 
                AND list."상태" != -1
                AND list."수업번호" = info."수업번호"; 
            `;
};

const sql_list_old_list = (stu_id : string) : string => {
    return  `
            SELECT 
                list."수업번호",
                list."상태" AS state
            FROM ${tables.list} AS list
            WHERE list."학번" = '${stu_id}'
                AND list."상태" != -1;
            `;


}

const sql_list_update = (stu_id : string, arr_to_update : any) : string => {

    let sql = `INSERT INTO\n${tables.list} ("학번", "수업번호", "상태")\nVALUES\n`

    let rec : any;
    for (rec of arr_to_update) {
        sql += `('${stu_id}', ${rec.수업번호}, ${rec.state}),\n`;
    }

    sql = sql.slice(0, -2);
    sql += `\n`;
    sql += `ON CONFLICT ("수업번호")\nDO UPDATE \nSET "상태" = EXCLUDED."상태";`

    return sql;
}



export { 
    sql_details,
    sql_grad_init,
    sql_grad_view,
    sql_list_init,
    sql_list_old_list,
    sql_list_update 
};