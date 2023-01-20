import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_grad_init, sql_grad_view } from '../utils/sql';

const router : Router = Router();

router.get('/init', async(req : Request, res : Response) => {
    try {
        let stu_id : any = req.query.stu_id;
        let sql : string = sql_grad_init(stu_id);

        let rows : object[];
        let result: {grads  : object[]} = {
            grads : [],
        };

        console.log("Request: grad init after login: " + stu_id);
        
        rows = (await db.query(sql)).rows;
        result.grads  = rows;

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

router.get('/view', async(req : Request, res : Response) => {
    try {
        let stu_id : any = req.query.stu_id;
        let sql : string = sql_grad_view(stu_id);

        let rows : object[];
        let result: { list : object[] } = {
            list: []
        };

        console.log("Request: current lecture list for grad: " + stu_id);
        
        rows = (await db.query(sql)).rows;
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