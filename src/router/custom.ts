import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { sql_custom_ge, sql_custom_ge_score, sql_custom_major, sql_custom_major_score } from '../utils/sql'
import { CustomRankingLec } from '../utils/interfaces';

const router : Router = Router();

router.get('/ge', async(req : Request, res : Response) => {
    try {
        let content : {hot : CustomRankingLec[], score : CustomRankingLec[], cold : CustomRankingLec[]} = {
            hot : [],
            score : [],
            cold : []
        };

        let field : string = req.query.field as string;
        let grade : number = +(req.query.grade as string);

        let sql : string = sql_custom_ge(field, grade);
        content.hot = (await db.query(sql)).rows

        console.log(sql)

        sql = sql_custom_ge_score(field)
        content.score = (await db.query(sql)).rows

        let temp : CustomRankingLec[] = []
        let idx 
        for(let i = Math.trunc(content.hot.length/2); i < content.hot.length; i++) {
            idx = content.score.findIndex(x => x.과목명 == content.hot[i].과목명)
            if(idx != -1) {
                content.hot[i].설강기준평점 = content.score[idx].설강기준평점;
                temp.push(content.hot[i])
            }
        }

        temp.sort((a, b) => content.score.findIndex(x => x.과목명 == a.과목명) - content.score.findIndex(x => x.과목명 == b.과목명))

        content.cold = temp;

        res.send(content)
    }
    catch (err) {
        if(err instanceof Error) {
            console.error("Error custom ge: " + err);
        }
        else {
            console.log("Unknwon Error custom ge: " + err);
        }
        res.status(500).send("Fail");

    }

});

router.get('/major', async(req : Request, res : Response) => {
    try {
        let content : {hot : CustomRankingLec[], score : CustomRankingLec[], cold : CustomRankingLec[]} = {
            hot : [],
            score : [],
            cold : []
        };

        let major : string = req.query.major as string;
        let grade : number = +(req.query.grade as string);

        console.log(major)
        console.log(grade)

        let sql : string= sql_custom_major(major, grade);
        content.hot = (await db.query(sql)).rows

        sql = sql_custom_major_score(major, grade);
        content.score = (await db.query(sql)).rows

        let temp : CustomRankingLec[] = []
        let idx 
        for(let i = Math.trunc(content.hot.length/2); i < content.hot.length; i++) {
            idx = content.score.findIndex(x => x.과목명 == content.hot[i].과목명)
            if(idx != -1) {
                content.hot[i].설강기준평점 = content.score[idx].설강기준평점;
                temp.push(content.hot[i])
            }
        }

        temp.sort((a, b) => content.score.findIndex(x => x.과목명 == a.과목명) - content.score.findIndex(x => x.과목명 == b.과목명))

        content.cold = temp;

        res.send(content)
    }
    catch (err) {
        if(err instanceof Error) {
            console.error("Error custom major: " + err);
        }
        else {
            console.log("Unknwon Error custom major: " + err);
        }
        res.status(500).send("Fail");

    }
});

export { router };