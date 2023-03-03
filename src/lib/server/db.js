import mariadb from 'mariadb';

import {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_BD,
    PRODUCCION
} from '$env/static/private';

console.log('PRODUCCION:', PRODUCCION);

const pool = mariadb.createPool({
    host: DATABASE_HOST, /* process.env.DB_HOST, */
    user: DATABASE_USER, /* process.env.DB_USER, */
    port: parseInt(DATABASE_PORT),
    password: DATABASE_PASSWORD,
    database: DATABASE_BD,
    connectionLimit: 5,
    bigIntAsNumber: true

});

async function dbSelect(sql, param) {
    let conn;
    try {

        conn = await pool.getConnection();
        const rows = await conn.query(sql, param);
        // rows: [ {val: 1}, meta: ... ]
        return rows;

    } finally {
        if (conn) conn.release(); //release to pool
    }
}

async function dbAction(sql, param) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sql, param);
        // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
        const { affectedRows, warningStatus } = res;
        return { error: false, affectedRows, warningStatus };
    } catch (e) {
        return { error: true, mensaje: e.message }
    } finally {
        if (conn) conn.release(); //release to pool
    }
}

export { dbSelect, dbAction }