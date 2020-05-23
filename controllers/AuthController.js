let response = require('../response');
let connection = require('../connection');
let sha1 = require('sha1');
let moment = require('moment');

async function register (request, reply) {

    let now = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    let fullname = request.body.fullname;
    let email = request.body.email;
    let password = sha1(request.body.password);
    let created_at = now;
    let updated_at = now;

    let sql = `INSERT INTO users (fullname, email, password, created_at, updated_at)
      values(?, ?, ?, ?, ?)`;

    //Menggunakan promise apabila membutuhkan data yang akan dikembalikan setelah callback
    let data = await new Promise((resolve) =>
        connection.query(sql,
            [fullname, email, password, created_at, updated_at], function (error, rows) {
            if(error){
                //Jika bukan duplicate entry maka cetak error yang terjadi.
                return response.badRequest('', `${error}`, reply)
            }

            return resolve({ fullname: fullname, email: email});
        })
    );

    return response.ok(data, `Berhasil registrasi pengguna baru - ${email}`, reply);
}

async function login(request, reply) {
    let email = request.body.email;
    let password = request.body.password;
    let sql = 'SELECT * FROM users WHERE email = ?';
    let data = await new Promise((resolve) =>
        connection.query(sql, [email], function (error, rows) {
                if(error){
                    return response.badRequest('', `${error}`, reply)
                }

                if(rows.length > 0){
                    let verify = sha1(password) === rows[0].password;

                    let data = {
                        name: rows[0].name,
                        email: rows[0].email,
                        token: process.env.KEY
                    };

                    return verify ? resolve(data) : resolve(false);
                }
                else{
                    return resolve(false);
                }
            })
    );

    if(!data){
        return response.badRequest('','Email atau password yang anda masukkan salah!', reply)
    }

    return response.ok(data, `Berhasil login!`, reply);
}
module.exports = {
    register,
    login
};