import { Router, Request, Response } from 'express';
const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    console.log("get test");

    let temp = {
        test: "get test"
    };

    res.send(temp);
});

router.post('/', async(req : Request, res : Response) => {
    console.log("ASDSAD");
    console.log(req.body);
    res.send("post test");
});

export { router };

{

    미래창업: 0
    
}