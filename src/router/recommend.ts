import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { table_names as tables } from "../database/tables";
const router : Router = Router();

export { router };