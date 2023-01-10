import express, { Express, Request, Response, NextFunction} from 'express';
import { db } from './database/db';
import { router as grad }  from './router/grad';
import { router as details } from './router/details';
import { router as list }  from './router/list';
import { router as recommend } from './router/recommend';
import { router as test } from './router/test';
import cors from 'cors';

const app : Express = express();
const port : number = 1324;

//db 연결
db.connect();

app.use(express.json());
app.use(express.urlencoded( {extended : false } ));


//CORS 설정
app.use(cors<Request>());


//라우터 연결
app.use('/grad', grad);
app.use('/details', details);
app.use('/list', list);
app.use('/recommend', recommend);

//테스팅
app.use('/test', test);

//에러 처리
app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    console.error(err);
    res.status(500).send('Unknown Error');
})


app.listen(port, () => {
    console.log("Server Start");
});