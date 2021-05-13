const mysql = require ('mysql');
const {promisify} = require ('util');
const {database} = require ('./keys');
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('La Coneccion Con La Base De Datos Se Cerró');
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La Base De Datos Tiene Muchas Conecciones');
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('La Coneccion Con La Base De Datos Fue Negada');
        }
    }
    if(connection) connection.release();
    console.log('Se Conecto Con La Base De Datos');
    return;
});

pool.query = promisify(pool.query);
module.exports = pool;