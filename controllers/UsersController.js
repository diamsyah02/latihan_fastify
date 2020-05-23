let response = require('../response');
let connection = require('../connection');
let sha1 = require('sha1');
let moment = require('moment');

async function getUsers(request, reply) {
    let sql = 'SELECT * FROM users';
    let data = await new Promise((resolve) => 
        connection.query(sql, function(error, rows) {
            if(error) {
                return response.badRequest('', `${error}`, reply)
            }

            return resolve({data: rows}) 
        })
    );
    return response.ok(data, 'get data users berhasil', reply);
}

async function getUser(request, reply) {
    let id = request.params.id;
    let sql = 'SELECT * FROM users WHERE id = ?';
    let data = await new Promise((resolve) => 
        connection.query(sql, [id], function(error, rows) {
            if(error) {
                return response.badRequest('', `${error}`, reply)
            }
            return resolve({data: rows[0]});
        })
    )
    return response.ok(data, 'get data users dengan id='+id+' berhasil', reply);
}

async function updateUsers(request, reply) {
    let id = request.params.id;
    let fullname = request.body.fullname;
    let email = request.body.email;
    let password = sha1(request.body.password);
    let now = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    let sql = 'UPDATE users SET fullname = ?, email = ?, password = ?, updated_at = ? WHERE id = ?';
    let data = await new Promise((resolve) =>
        connection.query(sql, [fullname, email, password, now, id], function(error, rows) {
            if(error) {
                return response.badRequest('', `${error}`, reply)
            }
            return resolve({fullname: fullname, email: email})
        })
    )
    return response.ok(data, 'Update data users dengan id='+id+' berhasil', reply);
}

async function deleteUsers(request, reply) {
    let id = request.params.id;
    let sql = 'DELETE FROM users WHERE id = ?';
    let data = await new Promise((resolve) =>
        connection.query(sql, [id], function(error, rows) {
            if(error) {
                return response.badRequest('', `${error}`, reply)
            }

            return resolve({delete: 'oke'})
        })
    )
    return response.ok('', 'Delete data users dengan id='+id+' berhasil', reply)
}

module.exports = {
    getUsers,
    getUser,
    updateUsers,
    deleteUsers
}