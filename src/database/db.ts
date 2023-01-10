import { Client } from 'pg';
import { readFileSync } from 'fs';

const db_info : string = readFileSync('./src/database/db_info.json', 'utf8');
const db_config : any = JSON.parse(db_info).db_config;

const db = new Client(db_config);

export { db };