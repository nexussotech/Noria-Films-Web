const jwt = require('jsonwebtoken')
const env  = require('./env')

const sign   = (payload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
const verify = (token)   => jwt.verify(token, env.JWT_SECRET)

module.exports = { sign, verify }
