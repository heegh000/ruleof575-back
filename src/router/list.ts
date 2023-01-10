import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { table_names as tables } from "../database/tables";
const router : Router = Router();

router.get('/login', async(req : Request, res : Response) => {
    let stu_id : any = req.query.stu_id;

    console.log("Request: init list after login: " + stu_id);

        
    let sql : string =  `
                        SELECT 
                            info."수업번호",
                            info."과목명",
                            info."대표교강사명",
                            info."수업시간",
                            CASE WHEN list."상태" = 1
                                 THEN true :: boolean
                                 ELSE false :: boolean
                            END AS value
                        FROM ${tables.list} AS list 
                        JOIN ${tables.lec_info} AS info
                        ON list."학번" = '${stu_id}' 
                            AND list."상태" != -1
                            AND list."수업번호" = info."수업번호"; 
                        `;

    try {
        let rows = (await db.query(sql)).rows;

        res.send(rows);
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("list login error" + err);
        }
        else {
            console.log("list login error" + err);
        }

        res.status(500).send("Error");
    }



});

export { router };