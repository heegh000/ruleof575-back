import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_recommend } from '../utils/sql';
import { get_intervals, filed_order } from '../utils/util';

const router : Router = Router();

router.post('/', async(req : Request, res : Response) => {

    try {
        let time_blocks : any = req.body.time_blocks;
        let intervals : object = get_intervals(time_blocks);
        let sql : string = sql_recommend(intervals);

        let rows : object[];

        rows = (await db.query(sql)).rows;
        
        rows.sort((first: any, second : any) : number=> filed_order.indexOf(first.영역코드명) - filed_order.indexOf(second.영역코드명));

        res.send(rows);
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