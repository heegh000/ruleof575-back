import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import crypto from 'crypto';
import { sql_list_init, sql_list_old_list, sql_list_update, sql_list_search } from '../utils/sql'
import { LecToSend, LecNumState } from '../utils/interfaces'

const router : Router = Router();

router.get('/init', async(req : Request, res : Response) => {

    try {
        let content : { list : LecToSend[] } = {
            list : []
        };
        
        let stu_id : string = req.query.stu_id as string;
        stu_id = crypto.createHash('sha512').update(stu_id).digest("base64");

        console.log("Request list init: " + stu_id);
        
        let sql : string = sql_list_init(stu_id);
        content.list = (await db.query(sql)).rows;

        res.send(content);
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("Error list init: " + err);
        }
        else {
            console.log("Unknwon Error list init: " + err);
        }
        res.status(500).send("Fail");
    }
});

router.post('/update', async(req : Request, res : Response) => {
    try {
        let stu_id : string = req.body.stu_id as string;
        stu_id = crypto.createHash('sha512').update(stu_id).digest("base64");

        console.log("Request list update: " + stu_id);
        
        let sql : string = sql_list_old_list(stu_id);

        let old_list : LecNumState[];
        old_list = (await db.query(sql)).rows;

        let new_list : LecNumState[] = req.body.list;
        let new_lec : LecNumState;

        for(new_lec of new_list) {
            new_lec.state = new_lec.isInTable
            delete new_lec.isInTable
        }

        let lecs_to_del : LecNumState[] = old_list.filter((ele1: LecNumState) => 
            !new_list.some((ele2: LecNumState) => ele1.수업번호 == ele2.수업번호)
        );
        let lecs_to_update : LecNumState[] = new_list.filter((ele1: LecNumState) => 
            !old_list.some((ele2: LecNumState) => ele1.수업번호 == ele2.수업번호 && ele1.state == ele2.state)
        );
        
        let lec : LecNumState;
        for (lec of lecs_to_del) {
            lec.state = -1;
        }

        lecs_to_update = lecs_to_update.concat(lecs_to_del);

        if(lecs_to_update.length != 0) {
            sql = sql_list_update(stu_id, lecs_to_update);
            await db.query(sql);
        }

        res.send("Sueccess");
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("Error list update: " + err);
        }
        else {
            console.log("Unknwon Error list update: " + err);
        }

        res.status(500).send("Fail");
    }
})

router.get('/search', async(req : Request, res : Response) => { 
    try {
        let content : { list : LecToSend[] } = {
            list : []
        };

        let keyword : string = req.query.keyword as string;
        let sql : string = sql_list_search(keyword);

        console.log("Request list searh: " + keyword);

        content.list = (await db.query(sql)).rows;
        res.send(content)

    } 
    catch (err) {
        if(err instanceof Error) {
            console.error("Error list search: " + err);
        }
        else {
            console.log("Unknwon Error list search: " + err);
        }

        res.status(500).send("Fail");
    }
})

export { router };