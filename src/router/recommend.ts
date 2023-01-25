import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_recommend, sql_recommend_nt } from '../utils/sql';
import { get_intervals } from '../utils/util';

const router : Router = Router();

router.post('/', async(req : Request, res : Response) => {

    try {
        let time_blocks : any = req.body.time_blocks;
        let intervals : object = get_intervals(time_blocks);
        let lecs : any;
        let nt_lecs : any;
        let nt_lec : any;
        
        let sql : string = sql_recommend(intervals);
        lecs = (await db.query(sql)).rows;

        sql = sql_recommend_nt();
        nt_lecs = (await db.query(sql)).rows

        for(nt_lec of nt_lecs) {
            let idx : number = lecs.findIndex((l : any) => { return l.영역코드명 == nt_lec.영역코드명});
            if(idx == -1) {
                lecs.push(nt_lec)
            }
            else {
                lecs[idx].수업목록 = [].concat(lecs[idx].수업목록, nt_lec.수업목록)
            }
        }

        res.send(lecs);
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("recommend error " + err);
        }
        else {
            console.log("Unknwon recommend error: " + err);
        }

        res.status(500).send("Fail recommend");
    }
});
export { router };