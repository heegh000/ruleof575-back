import express, { Express, Request, Response, NextFunction, application} from 'express';
import { db } from './database/db';
import { router as list }  from './router/list';
import { router as recommend } from './router/recommend';
import { router as custom } from './router/custom';
import { router as details } from './router/details';
import { router as grad }  from './router/grad';
import { router as test } from './router/test';
import cors from 'cors';

const app : Express = express();
const port : number = 1324;

//db 연결
db.connect();

//CORS 설정
app.use(cors<Request>());

//POST 요청 처리를 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({extended : false }));

//라우터 연결
app.use('/list', list);
app.use('/recommend', recommend);
app.use('/custom', custom);
app.use('/details', details);
app.use('/grad', grad);

//테스팅 라우터
app.use('/test', test);

//에러 처리
app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    console.error(err);
    res.status(500).send('Unknown Error');
});

app.listen(port, () => {
    console.log("Server Start");
});