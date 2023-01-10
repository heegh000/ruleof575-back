"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.table_names = void 0;
const fs_1 = require("fs");
const db_info = (0, fs_1.readFileSync)('./src/database/db_info.json', 'utf8');
const table_names = JSON.parse(db_info).table_names;
exports.table_names = table_names;
