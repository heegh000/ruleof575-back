import { table } from 'console';
import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { table_names as tables } from "../database/tables";
const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    let lec_num : any = req.query.lec_num;

    console.log(lec_num);

    let sql : string =  `
                        SELECT * 
                        FROM ${tables.lec_info} AS info
                        JOIN ${tables.pp} as pp
                        ON info."수업번호" = ${lec_num} 
                            AND pp."수업번호" = info."수업번호" ;
                        `;
    
    try {
        let rows : any = (await db.query(sql)).rows;
        
        let result : any = {};
        result.lec = rows;
        

        sql =   `
                SELECT * 
                FROM ${tables.depart_stu_num} as dep
                JOIN 
                    (SELECT pn.* 
                    FROM ${tables.people_num} as pn
                    JOIN  ${tables.lec_info} AS info
                    ON info."학수번호" = pn."학수번호"
                        AND info."설강소속코드" = pn."설강소속코드"
                        AND info."수업번호" = ${lec_num}) as pn
                ON dep."수업번호" = pn."수업번호";
                `;
                    
        rows = (await db.query(sql)).rows;

        result.pn = {};
        result.dep = [];

        for(let i in rows) {
            if(+i == 0) {
                result.pn = {
                                제한인원: rows[i].제한인원,
                                신청인원: rows[i].신청인원,
                                다중전공배당인원: rows[i].다중전공배당인원,
                                증원인원: rows[i].증원인원,
                                희망수업등록인원: rows[i].희망수업등록인원 
                            };
            }

            result.dep.push({
                                희망신청소속: rows[i].희망신청소속,
                                학생수: rows[i].학생수
                            });
        }
                    
        res.send(result);
    }   
    catch(err) {
        if(err instanceof Error) {
            console.error("details error" + err);
        }
        else {
            console.log("details error" + err);
        }

        res.status(500).send("Error");
    }
})

export { router };