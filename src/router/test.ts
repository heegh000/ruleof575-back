import { Router, Request, Response } from 'express';
import { db } from '../database/db';
const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
});

router.post('/', async(req : Request, res : Response) => {
    console.log("ASDSAD");
    console.log(req.body);
    res.send(req.body);
});

export { router };