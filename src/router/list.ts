import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_list_init } from '../utils/sql'

const router : Router = Router();

router.get('/init', async(req : Request, res : Response) => {
    try {
        let stu_id : any = req.query.stu_id;
    
        console.log("Request: init list after login: " + stu_id);
        
        let sql : string = sql_list_init(stu_id);
        
        console.log(sql);

        let rows : object[] = (await db.query(sql)).rows;
        
        res.send(rows);
    }
    catch(err) {
        if(err instanceof Error) {
            console.error("list login error: " + err);
        }
        else {
            console.log("Unknwon list login error: " + err);
        }

        res.status(500).send("Error");
    }
});

router.post('/update', async(req : Request, res : Response) => {
    console.log("update");
    console.log(req.body);
    res.send("ASDSADSADAS");
})

export { router };