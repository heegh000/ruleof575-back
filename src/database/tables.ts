import { readFileSync } from 'fs';

const db_info : string = readFileSync('./src/database/db_info.json', 'utf8');
const table_names : any = JSON.parse(db_info).table_names;

export { table_names };