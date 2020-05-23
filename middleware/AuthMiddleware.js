let response = require('../response');

async function check(request, reply){
    let key = process.env.KEY;
    let keyHeader = request.headers['diamsyah-key'];
    if(keyHeader == key){
        return true;
    }else{
        response.badRequest('', 'Token/key invalid !', reply);
    }
}

module.exports = {
    check
}