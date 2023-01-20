import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_list_init, sql_list_old_list, sql_list_update } from '../utils/sql'

const router : Router = Router();

router.get('/init', async(req : Request, res : Response) => {

    try {
        let stu_id : any = req.query.stu_id;
        let sql : string = sql_list_init(stu_id);
        
        let rows : object[];
        
        console.log("Request: list init after login: " + stu_id);
        
        rows= (await db.query(sql)).rows;

        res.send(rows);
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("list init error: " + err);
        }
        else {
            console.log("Unknwon list init error: " + err);
        }

        res.status(500).send("Fali list init");
    }
});

router.post('/update', async(req : Request, res : Response) => {
    try {
        let stu_id : string = req.body.stu_id;
        let new_list : object[] = req.body.list;
        let sql : string = sql_list_old_list(stu_id)
        let new_lec : any
        for(new_lec of new_list) {
            new_lec.state = new_lec.isInTable
            delete new_lec.isInTable
        }

        let old_list : object[];
        old_list = (await db.query(sql)).rows;

        let lecs_to_del : any = old_list.filter((ele1: any) => 
            !new_list.some((ele2: any) => ele1.수업번호 == ele2.수업번호)
        );

        let lecs_to_update : any = new_list.filter((ele1: any) => 
            !old_list.some((ele2: any) => ele1.수업번호 == ele2.수업번호 && ele1.state == ele2.state)
        );
        
        let lec : any;
        for (lec of lecs_to_del) {
            lec.state = -1;
        }
        lecs_to_update = lecs_to_update.concat(lecs_to_del);
        console.log(lecs_to_update)
        //sql = sql_list_update(stu_id, lecs_to_update);

        await db.query(sql);

        res.send("Sueccess list update");
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("list update error " + err);
        }
        else {
            console.log("Unknwon list update error: " + err);
        }

        res.status(500).send("Fail list update");
    }
})

export { router };