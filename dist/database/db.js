"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const fs_1 = require("fs");
const db_info = (0, fs_1.readFileSync)('./src/database/db_info.json', 'utf8');
const db_config = JSON.parse(db_info).db_config;
const db = new pg_1.Client(db_config);
exports.db = db;
