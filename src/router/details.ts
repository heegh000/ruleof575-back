import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_details } from '../utils/sql'

const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    try {
        let lec_num : any = req.query.lec_num;
        let sql : string[] = sql_details(lec_num);

        let rows : any;
        let result : any = {
            lec_info : {},
            prev_infos : []
        };
        
        rows = (await db.query(sql[0])).rows;
        result.lec_info = rows[0];
        
        rows = (await db.query(sql[1])).rows;

        let save_num = -1;
        let save_idx = -1;

        for(let row of rows) {
            if(save_num != row.수업번호) {
                save_num = row.수업번호
                save_idx++;
                result.prev_infos.push({
                        수업번호 : row.수업번호,
                        제한인원 : row.제한인원,
                        신청인원 : row.신청인원,
                        다중전공배당인원 : row.다중전공배당인원,
                        증원인원 : row.증원인원,
                        희망수업등록인원 : row.희망수업등록인원,
                        '순위1' : row['1순위'],
                        '순위2' : row['2순위'],
                        '순위3' : row['3순위'],
                        '순위4' : row['4순위'],
                        '순위5' : row['5순위'],
                        '순위5초과' : row['6순위'],
                        전체취소 : row.전체취소,
                        정정취소 : row.정정취소,
                        희망수업세부정보 : []
                });
            }

            result.prev_infos[save_idx].희망수업세부정보.push({
                희망신청소속: row.희망신청소속,
                학생수 : row.학생수
            });
        }
        res.send(result);
    }   
    catch(err) {
        if(err instanceof Error) {
            console.error("details error: " + err.message);
        }
        else {
            console.log("Unknwon details error: " + err);
        }

        res.status(500).send("Error");
    }
})

export { router };