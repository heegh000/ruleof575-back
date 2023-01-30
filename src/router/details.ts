import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_details_cur, sql_details_prev, sql_details_prev_not_same } from '../utils/sql'
import { LecDetailsInfo, PrevLecDetailsInfo } from '../utils/interfaces';

const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    try {
        let content : {lec_info : LecDetailsInfo; prev_infos : PrevLecDetailsInfo[]} = {
            lec_info : {} as LecDetailsInfo,
            prev_infos : []
        };
        
        let lec_num : number = +(req.query.lec_num as string);
        let sql : string = sql_details_cur(lec_num);
        let result : PrevLecDetailsInfo[];
        let pi_size : number = 0;
        let depart_idx

        console.log("Request details: " + lec_num);
        content.lec_info = (await db.query(sql)).rows[0];

        for(let i :number = 0; i < 2; i++) {
            sql = sql_details_prev(lec_num, i);
            result = (await db.query(sql)).rows;

            if(result.length != 0) {
                content.prev_infos.push(result[0])

                for(let j = 1; j < result.length; j++) {
                    content.prev_infos[pi_size].제한인원 += result[j].제한인원;
                    content.prev_infos[pi_size].신청인원 += result[j].신청인원;
                    content.prev_infos[pi_size].증원인원 += result[j].증원인원;
                    content.prev_infos[pi_size].전체취소 += result[j].전체취소;
                    content.prev_infos[pi_size].정정취소 += result[j].정정취소;
                    content.prev_infos[pi_size].순위1 += result[j].순위1;
                    content.prev_infos[pi_size].순위2 += result[j].순위2;
                    content.prev_infos[pi_size].순위3 += result[j].순위3;
                    content.prev_infos[pi_size].순위4 += result[j].순위4;
                    content.prev_infos[pi_size].순위5 += result[j].순위5;
                    content.prev_infos[pi_size].순위5초과 += result[j].순위5초과;
                    content.prev_infos[pi_size].희망수업등록인원 += result[j].희망수업등록인원;
                    content.prev_infos[pi_size].재수강인원 += result[j].재수강인원;
                    for(let k = 0; k < result[j].희망수업세부정보.length; k++) {
                        depart_idx = content.prev_infos[pi_size].희망수업세부정보.findIndex(w => w.희망신청소속 == result[j].희망수업세부정보[k].희망신청소속)
                        if(depart_idx == -1) {
                            content.prev_infos[pi_size].희망수업세부정보.push(result[j].희망수업세부정보[k]);
                        }
                        else {
                            content.prev_infos[pi_size].희망수업세부정보[depart_idx].학생수 += result[j].희망수업세부정보[k].학생수;
                        }
                    }


                }
                pi_size++;
            }

            // content.prev_infos = content.prev_infos.concat(result);
        }

        // if(content.prev_infos.length == 0) {
        //     sql = sql_details_prev_not_same(lec_num, 0);
        //     content.prev_infos = (await db.query(sql)).rows
        // }
        res.send(content);
    }   
    catch(err) {
        if(err instanceof Error) {
            console.error("Error details: " + err.message);
        }
        else {
            console.log("Unknwon Error details: " + err);
        }

        res.status(500).send("Fail");
    }
})

export { router };