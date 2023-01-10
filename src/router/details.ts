import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_details } from '../utils/sql'
import { I_details_res } from '../utils/interfaces';

const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    try {
        let lec_num : any = req.query.lec_num;
        let sql : string[] = sql_details(lec_num);

        let rows : any;
        let result : I_details_res = {
            lec : {},
            pn : {},
            depart : []
        };
        
        rows = (await db.query(sql[0])).rows;
        result.lec = rows;

        rows = (await db.query(sql[1])).rows;
        if(rows.length != 0) {
            result.pn = {
                제한인원: rows[0].제한인원,
                신청인원: rows[0].신청인원,
                다중전공배당인원: rows[0].다중전공배당인원,
                증원인원: rows[0].증원인원,
                희망수업등록인원: rows[0].희망수업등록인원 
            };
            for(let row of rows) {
                result.depart.push({
                    희망신청소속: row.희망신청소속,
                    학생수: row.학생수
                });
            }
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