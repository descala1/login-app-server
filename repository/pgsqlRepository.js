NODE_TLS_REJECT_UNAUTHORIZED=0

const { Client } = require('pg');
const path = require('path');
const db = require(path.resolve('config.json')).pgsql;

const client = new Client({
  user: db.user,
  host: db.host,
  database: db.database,
  password: db.password,
  port: db.port,
  ssl: { rejectUnauthorized: false }
});

let login = async(un) => {
    if(client._connected == false)
        await client.connect();

    let query = `
            SELECT password
            FROM Users
            WHERE username = $1
        `;
    
    const res = await client.query(query, [un]);
    console.log(res);
    //await client.end();
    if(res.rows.length > 0) return res.rows[0].password;
    else return null;
}

let register = async(name, un, email, pw) => {
    if(client._connected == false) {
        try {
            await client.connect();
        }catch(err) {
            console.log(err);
        }
    }

    let query = `
           INSERT INTO Users(name, username, email, password)
           VALUES($1, $2, $3, $4)
        `;

    const res = await client.query(query, [name, un, email, pw]);
    console.log(res.rowCount);
    //await client.end();
    return res.rowCount;
}

module.exports = {
    login: login,
    register: register
}