import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_details } from '../utils/sql'
import { LecDetailsInfo, PrevLecDetailsInfo } from '../utils/interfaces';

const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    try {
        let content : {lec_info : LecDetailsInfo; prev_infos : PrevLecDetailsInfo[]} = {
            lec_info : {} as LecDetailsInfo,
            prev_infos : []
        };
        
        let lec_num : number = +(req.query.lec_num as string);
        let sql : string[] = sql_details(lec_num);

        console.log("Request details: " + lec_num);
        
        content.lec_info = (await db.query(sql[0])).rows[0];
        content.prev_infos = (await db.query(sql[1])).rows;

        if(content.prev_infos.length == 0) {
            content.prev_infos = (await db.query(sql[2])).rows
        }
        res.send(content);
    }   
    catch(err) {
        if(err instanceof Error) {
            console.error("Error details: " + err.message);
        }
        else {
            console.log("Unknwon Error details: " + err);
        }

        res.status(500).send("Fail");
    }
})

export { router };