import { Router, Request, Response } from 'express';
import { db } from '../database/db';
// import { table_names as tables } from "../database/tables";
import { I_details_res } from '../utils/interfaces';
import { sql_details } from '../utils/sql'

const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    try {
        let lec_num : any = req.query.lec_num;
        let sql : string[] = sql_details(lec_num);

        // let sql : string =  `
        //                     SELECT *
        //                     FROM ${tables.lec_info} AS info
        //                     JOIN ${tables.pp} as pp
        //                     ON info."수업번호" = ${lec_num} 
        //                         AND pp."수업번호" = info."수업번호" ;
        //                     `;

        let rows : any = (await db.query(sql[0])).rows;
        
        let result : I_details_res = {
                                        lec : {},
                                        pn : {},
                                        depart : []
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
                    
        rows = (await db.query(sql[1])).rows;

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

            result.depart.push({
                                희망신청소속: rows[i].희망신청소속,
                                학생수: rows[i].학생수
                               });
        }
                    
        res.send(result);
    }   
    catch(err) {
        if(err instanceof Error) {
            console.error("details error: " + err);
        }
        else {
            console.log("Unknwon details error: " + err);
        }

        res.status(500).send("Error");
    }
})

export { router };