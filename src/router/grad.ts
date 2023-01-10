import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_grad } from '../utils/sql';
import { I_grad_res } from '../utils/interfaces';

const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    try {
        let stu_id : any = req.query.stu_id;
        let sql : string[] = sql_grad(stu_id);

        let rows : object[];
        let result: I_grad_res = {
            status: [],
            list: []
        };

        console.log("Request: look up graduation: " + stu_id);
        
        rows = (await db.query(sql[0])).rows;
        result.status = rows;
        
        rows = (await db.query(sql[1])).rows;
        result.list = rows;

        res.send(result);
    } 
    catch (err) {
        if(err instanceof Error) {
            console.error("grad error: " + err);
        }
        else {
            console.log("Unknown grad error: " + err);
        }

        res.status(500).send("Error");
    }
});

export { router };