let users = require('../controllers/UsersController');
let auth = require('../controllers/AuthController');
let middleware = require('../middleware/AuthMiddleware');

async function routes (fastify, options) {
    fastify.route({
        method: 'GET',
        url: '/',
        preHandler: async function (request, reply, done) {
            await middleware.check(request, reply);
            done()
        },
        handler: async function (request, reply) {
            reply.send({message: 'Hello world', code: 200})
        }
    })

    fastify.route({
        method: 'POST',
        url: '/register',
        handler: auth.register
    })

    fastify.route({
        method: 'POST',
        url: '/login',
        handler: auth.login
    })
    
    fastify.route({
        method: 'GET',
        url: '/users',
        preHandler: async function(request, reply, done) {
            await middleware.check(request, reply);
            done()
        },
        handler: users.getUsers
    })

    fastify.route({
        method: 'GET',
        url: '/users/:id',
        preHandler: async function(request, reply, done) {
            await middleware.check(request, reply);
            done()
        },
        handler: users.getUser
    })

    fastify.route({
        method: 'PUT',
        url: '/users/:id',
        preHandler: async function(request, reply, done) {
            await middleware.check(request, reply);
            done()
        },
        handler: users.updateUsers
    })

    fastify.route({
        method: 'DELETE',
        url: '/users/:id',
        preHandler: async function(request, reply, done) {
            await middleware.check(request, reply);
            done()
        },
        handler: users.deleteUsers
    })
}

module.exports = routes;