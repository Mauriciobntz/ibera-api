import mysqlConnection from 'mysql2/promise'

const properties = {
    host: 'firebrick-weasel-544564.hostingersite.com',       // Host de la base de datos
    user: 'u872190053_iberaadmin',          
    password: 'Bera-1234',
    database: 'u872190053_ibera'
}

export const pool = mysqlConnection.createPool(properties);
