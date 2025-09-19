const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dungcushop'
});

connection.connect((err)=>{
    if(err){
        console.error('Kết nối Mysql thất bại: ', err);
        return;
    }
    console.log('Kết nối Mysql thành công')
});
module.exports = connection;