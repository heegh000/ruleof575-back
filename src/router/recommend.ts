import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_recommend, sql_recommend_nt } from '../utils/sql';
import { get_intervals } from '../utils/util';
import { RecommLecs, IntervalsPerDays } from '../utils/interfaces';

const router : Router = Router();

router.post('/', async(req : Request, res : Response) => {

    try {
        let content : RecommLecs[] = [];

        let time_blocks : IntervalsPerDays = req.body.time_blocks;

        let intervals : IntervalsPerDays = get_intervals(time_blocks);

        let lecs : RecommLecs[] = [];
        let nt_lecs : RecommLecs[] = [];

        console.log("Request recommend")
        
        let sql : string = sql_recommend(intervals);
        lecs = (await db.query(sql)).rows;
        
        sql = sql_recommend_nt();
        nt_lecs = (await db.query(sql)).rows
        
        let nt_lec : RecommLecs;
        for(nt_lec of nt_lecs) {
            let idx : number = lecs.findIndex((l : RecommLecs) => { return l.영역코드명 == nt_lec.영역코드명});
            if(idx == -1) {
                lecs.push(nt_lec)
            }
            else {
                lecs[idx].수업목록 = lecs[idx].수업목록.concat(nt_lec.수업목록)
            }
        }

        content = lecs;

        console.log(content)

        res.send(content);
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("Error recommend: " + err);
        }
        else {
            console.log("Unknwon Error recommend: " + err);
        }

        res.status(500).send("Fail");
    }
});
export { router };