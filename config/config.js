
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';


const caPath = path.resolve(process.cwd(), 'certs', 'ca.pem');
console.log('Resolved CA cert path:', caPath);

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  ssl: {
    ca: fs.readFileSync(caPath),
  },
};


const pool = mysql.createPool(dbConfig);

export default pool;
