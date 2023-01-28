import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_details_cur, sql_details_prev, sql_details_prev_not_same } from '../utils/sql'
import { LecDetailsInfo, PrevLecDetailsInfo } from '../utils/interfaces';

const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    try {
        let content : {lec_info : LecDetailsInfo; prev_infos : PrevLecDetailsInfo[]} = {
            lec_info : {} as LecDetailsInfo,
            prev_infos : []
        };
        
        let lec_num : number = +(req.query.lec_num as string);
        let sql : string = sql_details_cur(lec_num);
        let temp : PrevLecDetailsInfo[];

        console.log("Request details: " + lec_num);
        content.lec_info = (await db.query(sql)).rows[0];

        for(let i :number = 0; i < 2; i++) {
            sql = sql_details_prev(lec_num, i);
            temp = (await db.query(sql)).rows;
            content.prev_infos = content.prev_infos.concat(temp);
        }

        if(content.prev_infos.length == 0) {
            sql = sql_details_prev_not_same(lec_num, 0);
            content.prev_infos = (await db.query(sql)).rows
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