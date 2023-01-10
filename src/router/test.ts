import { Router, Request, Response } from 'express';
const router : Router = Router();

router.get('/', async(req : Request, res : Response) => {
    console.log("get test");

    let temp =  {
                    test : "get test"
                };

    res.send(temp);
});

router.post('/', async(req : Request, res : Response) => 
{

    console.log("ASDSAD");

    let temp : any = req.body;

    console.log(temp);


    let t =  {
        test : "post test"
    };

    res.send(t);

});

export { router };