import sqlite3 from 'sqlite3';

const dbConn = sqlite3.verbose();

const dbConnection = new dbConn.Database('./data.db', (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Connected');
})

export default dbConnection;