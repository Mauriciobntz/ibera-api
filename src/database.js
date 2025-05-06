import mysqlConnection from 'mysql2/promise'

const properties = {
    host: 'localhost',       // Host de la base de datos
    user: 'root',          
    password: '',
    database: 'ibera'
}

export const pool = mysqlConnection.createPool(properties);