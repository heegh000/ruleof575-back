import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import crypto from 'crypto';
import { sql_grad_init, sql_grad_view, sql_grad_update } from '../utils/sql';
import { GradRecord, LecForGrad } from '../utils/interfaces';

const router : Router = Router();

router.get('/init', async(req : Request, res : Response) => {
    try {
        let content : {grads  : GradRecord[]} = {
            grads : [],
        };

        let stu_id : string = req.query.stu_id as string;
        stu_id = crypto.createHash('sha512').update(stu_id).digest("base64");
        console.log("Request grad init: " + stu_id);
        
        let sql : string = sql_grad_init(stu_id);
        content.grads = (await db.query(sql)).rows;

        res.send(content);
    } 
    catch (err) {
        if(err instanceof Error) {
            console.error("Error grad init: " + err);
        }
        else {
            console.log("Unknown Error grad init: " + err);
        }

        res.status(500).send("Fail");
    }
});

router.get('/view', async(req : Request, res : Response) => {
    try {
        let content : {list : LecForGrad[]} = {
            list : []
        }

        let stu_id : string = req.query.stu_id as string;
        stu_id = crypto.createHash('sha512').update(stu_id).digest("base64");
        console.log("Request grad view: " + stu_id);

        let sql : string = sql_grad_view(stu_id);

        content.list = (await db.query(sql)).rows;

        res.send(content);
    } 
    catch (err) {
        if(err instanceof Error) {
            console.error("Error grad view: " + err);
        }
        else {
            console.log("Unknown Error grad view: " + err);
        }

        res.status(500).send("Fail");
    }
});

router.post('/update', async(req : Request, res : Response) => {
    try {
        let stu_id : string = req.body.stu_id as string;
        stu_id = crypto.createHash('sha512').update(stu_id).digest("base64");
        console.log("Request grad update: " + stu_id)

        let list : GradRecord[] = req.body.list;

        console.log(list)

        if(list.length != 0) {
            let sql : string = sql_grad_update(stu_id, list);
            await db.query(sql)
        }
        res.send("Sueccess");

    }
    catch (err) {
        if(err instanceof Error) {
            console.error("Error grad update: " + err);
        }
        else {
            console.log("Unknown Error grad update: " + err);
        }

        res.status(500).send("Fail");
    }
});

export { router };