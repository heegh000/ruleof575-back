import { db } from '../database/db';
import { table_names as tables } from "../database/tables";
import { LecToUpdate, Interval, IntervalsPerDays, GradRecord, Semester } from './interfaces';


const cur : Semester = {
    year : 2022,
    sem : 20
};

const prev : Semester[] = [
    {
        year : 2021,
        sem : 20
    },
    {
        year : 2022,
        sem : 10
    }
]

/* 
SQL Query for list
*/
const sql_list_init = (stu_id : string) : string => {
    return `
    SELECT 
        info."수업번호",
        info."과목명",
        info."대표교강사명",
        REPLACE(info."수업시간", ',', '') AS "수업시간",
        info."학점"::smallint,
        info."이수구분코드명",
        info."영역코드명",
        list."상태" AS "isInTable",
        list."순서" AS "order"
    FROM ${tables.lec_list} AS list
    JOIN ${tables.lec_info} AS info
    ON list."상태" != -1
        AND list."학번" = ${db.escapeLiteral(stu_id)}
        AND info."수업번호" = list."수업번호"
        AND info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem};
            `;
};

const sql_list_old_list = (stu_id : string) : string => {
    return  `
    SELECT 
        list."수업번호",
        list."상태" AS state
    FROM ${tables.lec_list} AS list
    WHERE list."학번" = ${db.escapeLiteral(stu_id)}
        AND list."상태" != -1;
            `;
}

const sql_list_update = (stu_id : string, lecs_to_update : LecToUpdate[]) : string => {

    let lec : LecToUpdate;

    let sql = `
    INSERT INTO
        ${tables.lec_list} ("학번", "수업번호", "상태", "순서")
    VALUES\n`

    for (lec of lecs_to_update) {

        sql += `        (${db.escapeLiteral(stu_id)}, ${db.escapeLiteral(lec.수업번호.toString())}, ${db.escapeLiteral((lec.state as number).toString())}, ${db.escapeLiteral((lec.order as number).toString())}),\n`;
    }

    sql = sql.slice(0, -2);
    sql += `
    ON CONFLICT 
        ("학번", "수업번호")
    DO UPDATE 
    SET "상태" = EXCLUDED."상태",
        "순서" = EXCLUDED."순서";    
        `
    return sql;
}

const sql_list_search = (keyword : string) : string => {

    keyword = "%" + keyword + "%";
    keyword = db.escapeLiteral(keyword);

    return  ` 
    SELECT
        info."수업번호",
        info."과목명",
        info."대표교강사명",
        REPLACE(info."수업시간", ',', '') AS "수업시간",
        info.학점::smallint,
        info.이수구분코드명,
        info."영역코드명",
        0 AS "isInTable",
        -1 AS "order"
    FROM
        ${tables.lec_info} AS info
    WHERE info."과목명" LIKE ${keyword}
        AND info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem};
            `
}



/* 
SQL Query for recommend
*/
const sql_recommend = (intervals : IntervalsPerDays) : string => { 
    let sql = `
    SELECT 
        recomm_info_list."영역코드명",
        ARRAY_agg(json_build_object(
            '수업번호', recomm_info_list."수업번호", 
            '과목명', recomm_info_list."과목명",
            '대표교강사명', recomm_info_list."대표교강사명",
            '수업시간', recomm_info_list."수업시간",
            '학점', recomm_info_list."학점"::smallint,
            '영역코드명', recomm_info_list."영역코드명",
            'isInTable', 0,
            'order', -1)
        ) AS "수업목록"
    FROM
        (
        SELECT
            info."수업번호",
            info."과목명",
            info."대표교강사명",
            REPLACE(info."수업시간", ',', '') AS "수업시간",
            info."학점",
            info."이수구분코드명",
            info."영역코드명"
        FROM
            (
            SELECT
                tp_check."수업번호"
            FROM
                (
                SELECT 
                    tp."수업번호",
                    COUNT(tp."수업번호") :: smallint AS cnt
                FROM 
                    ${tables.time_place} AS tp
                WHERE tp."수업년도" = ${cur.year} 
                    AND tp."수업학기" = ${cur.sem} 
                    AND (false\n`
                    let day : string;
                    let time : Interval;
                    for(day in intervals) {
                        for(time of intervals[day]) {
                            sql += `                    `;
                            sql += `OR (tp."요일" = ${db.escapeLiteral(day)} AND tp."시작시간" >= ${db.escapeLiteral(time.start as string)}::time AND tp."끝시간" <= ${db.escapeLiteral(time.end as string)}::time)\n`
                        }
                    }
                    sql+= `                    )`

                sql += `
                GROUP BY tp."수업번호"
                ) AS searched
            JOIN ${tables.time_place} AS tp_check	
            ON tp_check."수업번호" = searched."수업번호"
                AND tp_check."수업년도" = ${cur.year} 
                AND tp_check."수업학기" = ${cur.sem} 
                AND (tp_check."시작시간" IS NOT NULL AND "끝시간" IS NOT NULL)
            GROUP BY tp_check."수업번호", searched.cnt
            HAVING COUNT(tp_check."수업번호") = searched.cnt 
            ) AS recomm_lecs
        JOIN ${tables.lec_info} AS info
        ON info."수업번호" = recomm_lecs."수업번호"
            AND info."수업년도" = ${cur.year} 
            AND info."수업학기" = ${cur.sem} 
            AND (info."이수구분코드" = 711)
        ) AS recomm_info_list
    GROUP BY recomm_info_list."영역코드명"
            `;    
    
    return sql;
}

const sql_recommend_nt = () : string => {
    return `
    SELECT 
        recomm_info_list."영역코드명",
        ARRAY_AGG(json_build_object(
            '수업번호', recomm_info_list."수업번호", 
            '과목명', recomm_info_list."과목명",
            '대표교강사명', recomm_info_list."대표교강사명",
            '수업시간', recomm_info_list."수업시간",
            '학점', recomm_info_list."학점"::smallint,
            '이수구분코드명', recomm_info_list."이수구분코드명",
            '영역코드명', recomm_info_list."영역코드명",
            'isInTable', 0,
            'order', -1)
        ) AS "수업목록"
    FROM
        (
        SELECT
            info."수업번호",
            info."과목명",
            info."대표교강사명",
            REPLACE(info."수업시간", ',', '') AS "수업시간",
            info."학점",
            info."이수구분코드명",
            info."영역코드명"
        FROM
            (
            SELECT
                tp_check."수업번호"
            FROM
                (
                SELECT 
                    tp."수업번호",
                    COUNT(tp."수업번호") :: smallint AS cnt
                FROM 
                    ${tables.time_place} AS tp
                WHERE tp."수업년도" = ${cur.year}
                    AND tp."수업학기" = ${cur.sem}
                    AND (tp."요일" = '시간미지정강좌' OR tp."요일" = '집중수업')
                GROUP BY tp."수업번호"
                ) AS searched
            JOIN ${tables.time_place} AS tp_check
            ON tp_check."수업번호" = searched."수업번호"
                AND tp_check."수업년도" = ${cur.year} 
                AND tp_check."수업학기" = ${cur.sem} 
            GROUP BY tp_check."수업번호", searched.cnt
            HAVING COUNT(tp_check."수업번호") = searched.cnt
            ) AS recomm_lecs
        JOIN ${tables.lec_info} AS info
        ON info."수업번호" = recomm_lecs."수업번호"
            AND info."수업년도" = ${cur.year} 
            AND info."수업학기" = ${cur.sem}
            AND (info."이수구분코드" = 711)
        ) AS recomm_info_list
    GROUP BY recomm_info_list."영역코드명"
        `
}

/*
SQL Query for custom
*/

const sql_custom_ge = (field : string, grade :number) : string => {
    return `
    SELECT 
        prev_lecs."수업번호",
        prev_lecs."과목명",
        prev_lecs."대표교강사명",   
        prev_lecs."수업시간",
        ARRAY_AGG(json_build_object(
            '수업번호', info."수업번호",
            '과목명', info."과목명",
            '대표교강사명', info."대표교강사명",
            '수업시간', REPLACE(info."수업시간", ',', ''),
            '학점', info."학점"::smallint,
            '이수구분코드명', info."이수구분코드명",
            '영역코드명', info."영역코드명",
            'isInTable', 0,
            'order', -1)
        ) AS 개설예정수업목록
    FROM
        (
        SELECT
            prev_info."수업번호",
            prev_info."과목명",
            prev_info."대표교강사명",
            REPLACE(prev_info."수업시간", ',', '') AS "수업시간",
            prev_info."학수번호",
            prev_info."설강소속코드",
            service.cal_score(
                RANK() OVER (ORDER BY ranking."신청순서비_순위") ::smallint, 0.1, 
                RANK() OVER (ORDER BY ranking."도달시간_순위") ::smallint, 0.3, 
                RANK() OVER (ORDER BY ranking."기준시간내신청_순위") ::smallint, 0.3,
                RANK() OVER (ORDER BY ranking."희망비_순위") ::smallint, 0.3, 
                COUNT(*) OVER() ::smallint) AS "종합점수"
        FROM ${tables.lec_info} AS prev_info
        JOIN ${tables.ranking} AS ranking
        ON ranking."수업번호" = prev_info."수업번호"
            AND prev_info."영역코드명" = ${db.escapeLiteral(field)}
            AND ranking."학년" = ${db.escapeLiteral(grade.toString())}
            AND prev_info."수업년도" = ${prev[0].year}
            AND prev_info."수업학기" = ${prev[0].sem}
            AND ranking."수업년도"= ${prev[0].year}
            AND ranking."수업학기" = ${prev[0].sem}
        ) AS prev_lecs
    JOIN ${tables.lec_info} AS info
    ON info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem}
        AND info."학수번호" = prev_lecs."학수번호"
        AND info."설강소속코드" = prev_lecs."설강소속코드"
        AND (info."대표교강사명" = prev_lecs."대표교강사명" OR (info."대표교강사명" IS NULL AND prev_lecs."대표교강사명" IS NULL))
    GROUP BY prev_lecs."수업번호", prev_lecs."과목명", prev_lecs."대표교강사명", prev_lecs."수업시간", prev_lecs."종합점수"
    ORDER BY prev_lecs."종합점수" DESC;  
            `
}

const sql_custom_ge_score = (field : string) : string => {
    return `
    SELECT
        info."수업번호",
        info."과목명",
        info."대표교강사명",
        REPLACE(info."수업시간", ',', '') AS "수업시간",
        pp."설강기준평점",
        ARRAY_AGG(json_build_object(
            '수업번호', info."수업번호",
            '과목명', info."과목명",
            '대표교강사명', info."대표교강사명",
            '수업시간', info."수업시간",
            '학점', info."학점"::smallint,
            '이수구분코드명', info."이수구분코드명",
            '영역코드명', info."영역코드명",
            'isInTable', 0,
            'order', -1)
        ) AS 개설예정수업목록
    FROM ${tables.lec_info} AS info
    JOIN ${tables.pp} AS pp
    ON pp."수업번호" = info."수업번호"
        AND info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem}
        AND pp."수업년도" = ${cur.year}
        AND pp."수업학기" = ${cur.sem}
        AND pp."설강기준평점" != 0
        AND info."이수구분코드명" = '핵심교양'
        AND info."영역코드명" = ${db.escapeLiteral(field)}
        AND pp."전체인원" > 30
    GROUP BY info."수업번호", info."과목명", info."대표교강사명", info."수업시간", pp."설강기준평점"
    ORDER BY pp."설강기준평점" DESC;
        `

}

const sql_custom_major = (major : string, grade : number) : string => {
    return `
    SELECT 
        prev_lecs."수업번호",
        prev_lecs."과목명",
        prev_lecs."대표교강사명",
        prev_lecs."수업시간",
        ARRAY_AGG(json_build_object(
            '수업번호', info."수업번호",
            '과목명', info."과목명",
            '대표교강사명', info."대표교강사명",
            '수업시간', REPLACE(info."수업시간", ',', ''),
            '학점', info."학점"::smallint,
            '이수구분코드명', info."이수구분코드명",
            '영역코드명', info."영역코드명",
            'isInTable', 0,
            'order', -1)
        ) AS 개설예정수업목록
    FROM
        (
        SELECT
            prev_info."수업번호",
            prev_info."과목명",
            prev_info."대표교강사명",
            REPLACE(prev_info."수업시간", ',', '') AS "수업시간",
            prev_info."학수번호",
            prev_info."설강소속코드",
            service.cal_score(
                RANK() OVER (ORDER BY ranking."신청순서비_순위")::smallint, 0.1,
                RANK() OVER (ORDER BY ranking."도달시간_순위")::smallint, 0.3,
                RANK() OVER (ORDER BY ranking."기준시간내신청_순위")::smallint, 0.3,
                RANK() OVER (ORDER BY ranking."희망비_순위")::smallint, 0.3,
                COUNT(*) OVER() ::smallint ) AS "종합점수"
        FROM ${tables.lec_info} AS prev_info
        JOIN ${tables.department_grade} AS dg
        ON prev_info."수업번호" = dg."수업번호"
            AND prev_info."이수구분코드명" != '교양필수'
            AND dg."전공학과" = ${db.escapeLiteral(major)}
            AND dg."학년" = ${db.escapeLiteral(grade.toString())}
            AND dg."수업년도" = ${prev[0].year}
            AND dg."수업학기" = ${prev[0].sem}
            AND prev_info."수업년도" = ${prev[0].year}
            AND prev_info."수업학기" = ${prev[0].sem}
        JOIN ${tables.ranking} AS ranking
        ON ranking."수업번호" = prev_info."수업번호"
            AND ranking."학년" = ${db.escapeLiteral(grade.toString())}
            AND ranking."수업년도"= ${prev[0].year}
            AND ranking."수업학기" = ${prev[0].sem}
        ) AS prev_lecs
    JOIN ${tables.lec_info} AS info
    ON info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem}
        AND info."학수번호" = prev_lecs."학수번호"
        AND info."설강소속코드" = prev_lecs."설강소속코드"
        AND info."대표교강사명" = prev_lecs."대표교강사명"
    GROUP BY prev_lecs."수업번호", prev_lecs."과목명", prev_lecs."대표교강사명", prev_lecs."수업시간", prev_lecs."종합점수"
    ORDER BY prev_lecs."종합점수" DESC;
    `
}

const sql_custom_major_score = (major : string, grade : number) : string => {
    return `
    SELECT
        info."수업번호",
        info."과목명",
        info."대표교강사명",
        REPLACE(info."수업시간", ',', '') AS "수업시간",
        pp."설강기준평점",
        ARRAY_AGG(json_build_object(
            '수업번호', info."수업번호",
            '과목명', info."과목명",
            '대표교강사명', info."대표교강사명",
            '수업시간', info."수업시간",
            '학점', info."학점"::smallint,
            '이수구분코드명', info."이수구분코드명",
            '영역코드명', info."영역코드명",
            'isInTable', 0,
            'order', -1)
        ) AS 개설예정수업목록
    FROM ${tables.lec_info} AS info
    JOIN ${tables.department_grade} AS dg 
    ON dg."수업번호" = info."수업번호"
        AND dg."전공학과" = ${db.escapeLiteral(major)}
        AND dg."학년" = ${db.escapeLiteral(grade.toString())}
        AND dg."수업년도" = ${cur.year}
        AND dg."수업학기" = ${cur.sem}
        AND info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem}
    JOIN ${tables.pp} AS pp
    ON pp."수업번호" = info."수업번호"
        AND pp."설강기준평점" != 0
        AND info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem}
        AND pp."수업년도" = ${cur.year}
        AND pp."수업학기" = ${cur.sem}
    GROUP BY info."수업번호", info."과목명", info."대표교강사명", info."수업시간", pp."설강기준평점"
    ORDER BY pp."설강기준평점" DESC;
        `
    
}


/* 
SQL Query for details
*/

const sql_details_cur = (lec_num : number) : string => {
    return `
    SELECT
        info."수업번호",
        info."학수번호",
        info."과목명",
        info."이수구분코드명",
        info."학점"::smallint,
        info."이론"::smallint,
        info."실습"::smallint,
        info."대표교강사명",
        info."강좌유형",
        info."수업시간",
        info."강의실",
        info."특수수업구분",
        info."정원",
        pp."설강기준평점",
        pp."A+",
        pp."A0",
        pp."B+",
        pp."B0",
        pp."C+",
        pp."C0",
        pp."D+",
        pp."D0",
        pp."Pass",
        pp."F",
        pp."전체인원"
    FROM ${tables.lec_info} AS info
    JOIN ${tables.pp} as pp
    ON info."수업번호" = ${db.escapeLiteral(lec_num.toString())} 
        AND pp."수업번호" = info."수업번호"
        AND info."수업년도" = ${cur.year}
        AND info."수업학기" = ${cur.sem}
        AND pp."수업년도" = ${cur.year}
        AND pp."수업학기" = ${cur.sem};
            `
}

const sql_details_prev = (lec_num : number, idx : number) : string => {
    return `
    SELECT
        pn."수업번호",
        ${prev[idx].year} AS "수업년도",
        ${prev[idx].sem} AS "수업학기",
        w_per_lec.대표교강사명,
        pn."제한인원",
        pn."신청인원",
        pn."증원인원",
        pn."전체취소",                    
        pn."정정취소",
        pn."순위1",
        pn."순위2",
        pn."순위3",
        pn."순위4",
        pn."순위5",
        pn."순위5초과",
        pn."희망수업등록인원",
        pn."재수강인원",
        w_per_lec."희망수업세부정보"
    FROM
        (
        SELECT
            prev_lecs."수업번호",
            prev_lecs."대표교강사명",
            ARRAY_AGG(json_build_object(
                '희망신청소속', depart."희망신청소속", 
                '학생수', depart."학생수")
            ) AS "희망수업세부정보"
        FROM
            (
            SELECT 
                prev_info."수업번호",
                prev_info."대표교강사명"
            FROM
                (SELECT
                    info."학수번호",
                    info."설강소속코드",
                    info."대표교강사명"
                FROM ${tables.lec_info} AS info
                WHERE info."수업번호" = ${db.escapeLiteral(lec_num.toString())}
                    AND info."수업년도" = ${cur.year}
                    AND info."수업학기" = ${cur.sem}
                ) AS cur_lec
            JOIN ${tables.lec_info} AS prev_info
            ON prev_info."수업년도" = ${prev[idx].year}
                AND prev_info."수업학기" = ${prev[idx].sem}
                AND cur_lec."학수번호" = prev_info."학수번호"
                AND cur_lec."설강소속코드" = prev_info."설강소속코드"
                AND cur_lec."대표교강사명" = prev_info."대표교강사명"
            ) AS prev_lecs
        JOIN ${tables.wanteds_per_department} AS depart
        ON depart."수업번호" = prev_lecs."수업번호"
            AND depart."수업년도" = ${prev[idx].year}
            AND depart."수업학기" = ${prev[idx].sem}
        GROUP BY prev_lecs."수업번호", prev_lecs."대표교강사명"
        ) AS w_per_lec
    JOIN ${tables.people_num_info} AS pn
    ON pn."수업번호" = w_per_lec."수업번호"
        AND pn."수업년도" = ${prev[idx].year}
        AND pn."수업학기" = ${prev[idx].sem}
    ORDER BY pn."수업번호";
            `
};

const sql_details_prev_not_same = (lec_num : number, idx : number) : string => {
    return `
    SELECT
        pn."수업번호",
        ${prev[idx].year} AS "수업년도",
        ${prev[idx].sem} AS "수업학기",
        w_per_lec.대표교강사명,
        pn."제한인원",
        pn."신청인원",
        pn."증원인원",
        pn."전체취소",                    
        pn."정정취소",
        pn."순위1",
        pn."순위2",
        pn."순위3",
        pn."순위4",
        pn."순위5",
        pn."순위5초과",
        pn."희망수업등록인원",
        pn."재수강인원",
        w_per_lec."희망수업세부정보"
    FROM
        (
        SELECT
            prev_lecs."수업번호",
            prev_lecs."대표교강사명",
            ARRAY_AGG(json_build_object(
                '희망신청소속', depart."희망신청소속", 
                '학생수', depart."학생수")
            ) AS "희망수업세부정보"
        FROM
            (
            SELECT 
                prev_info."수업번호",
                prev_info."대표교강사명"
            FROM
                (SELECT
                    info."학수번호",
                    info."설강소속코드",
                    info."대표교강사명"
                FROM ${tables.lec_info} AS info
                WHERE info."수업번호" = ${db.escapeLiteral(lec_num.toString())}
                    AND info."수업년도" = ${cur.year}
                    AND info."수업학기" = ${cur.sem}
                ) AS cur_lec
            JOIN ${tables.lec_info} AS prev_info
            ON prev_info."수업년도" = ${prev[idx].year}
                AND prev_info."수업학기" = ${prev[idx].sem}
                AND cur_lec."학수번호" = prev_info."학수번호"
                AND cur_lec."설강소속코드" = prev_info."설강소속코드"
                AND cur_lec."대표교강사명" = prev_info."대표교강사명"
            ) AS prev_lecs
        JOIN ${tables.wanteds_per_department} AS depart
        ON depart."수업번호" = prev_lecs."수업번호"
            AND depart."수업년도" = ${prev[idx].year}
            AND depart."수업학기" = ${prev[idx].sem}
        GROUP BY prev_lecs."수업번호", prev_lecs."대표교강사명"
        ) AS w_per_lec
    JOIN ${tables.people_num_info} AS pn
    ON pn."수업번호" = w_per_lec."수업번호"
        AND pn."수업년도" = ${prev[idx].year}
        AND pn."수업학기" = ${prev[idx].sem}
    ORDER BY pn."수업번호";
            `
};


/* 
SQL Query for grad
*/
const sql_grad_init = (stu_id : string) : string => {
    return  `
    SELECT 
        "이수명",
        "기준"::smallint,
        "이수"::smallint,
        "이수여부"
    FROM ${tables.grad_list} 
    WHERE "학번" = ${db.escapeLiteral(stu_id)};
            `;
};

const sql_grad_view = (stu_id : string) : string => {
    return  `
    SELECT
        "이수구분코드명",
        "영역코드명",
        "학점"::smallint,
        "특수수업구분"
    FROM ${tables.lec_info} AS info
    JOIN ${tables.lec_list} AS list
    ON info."수업번호" = list."수업번호"
        AND info."수업년도" = ${cur.year} 
        AND info."수업학기" = ${cur.sem} 
        AND list."학번" = ${db.escapeLiteral(stu_id)}
        AND list."상태" = 1;
            `;
};

const sql_grad_update = (stu_id : string, grad_list : GradRecord[]) : string => {
    let grad : GradRecord;
    let sql = `
    INSERT INTO
        ${tables.grad_list} ("학번", "이수명", "기준", "이수", "이수여부")
    VALUES\n`

    for (grad of grad_list) {
        sql += `        (${db.escapeLiteral(stu_id)}, ${db.escapeLiteral(grad.이수명)}, ${db.escapeLiteral(grad.기준.toString())}, ${db.escapeLiteral(grad.이수.toString())}, ${db.escapeLiteral(grad.이수여부)}),\n`;
    }

    sql = sql.slice(0, -2);
    sql += `
    ON CONFLICT 
        ("학번", "이수명")
    DO UPDATE SET 
        "기준" = EXCLUDED."기준",
        "이수" = EXCLUDED."이수";
            `

    return sql;
}

export { 
    sql_list_init,
    sql_list_old_list,
    sql_list_update,
    sql_list_search,
    sql_recommend,
    sql_recommend_nt,
    sql_custom_ge,
    sql_custom_ge_score,
    sql_custom_major,
    sql_custom_major_score,
    sql_details_cur,
    sql_details_prev,
    sql_details_prev_not_same,
    sql_grad_init,
    sql_grad_view,
    sql_grad_update
};