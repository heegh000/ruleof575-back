import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { table_names as tables } from "../database/tables";
const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    let stu_id : any = req.query.stu_id;

    console.log("Request: look up graduation: " + stu_id);
    
    let sql : string =  `
                        SELECT 
                            "전공구분명",
                            "이수명",
                            "기준",
                            "이수" 
                        FROM ${tables.grad} 
                        WHERE "학번" = '${stu_id}';
                        `;

    try {
        let rows : object[] = (await db.query(sql)).rows;

        let result: {status : object[], list : object[]} = { status : [], list : []};

        result.status = rows;
        
        sql =   `
                SELECT * 
                FROM ${tables.grad} AS info
                JOIN ${tables.list} AS list
                ON list."수업번호" = info."수업번호" 
                    AND list."학번" = '${stu_id}'
                    AND list."상태" = 1;
                `;

        rows = (await db.query(sql)).rows;

        result.list = rows;

        res.send(result);
    } 
    catch (err) {
        if(err instanceof Error) {
            console.error("grad error" + err);
        }
        else {
            console.log("grad error" + err);
        }

        res.status(500).send("Error");
    }
});

export { router };