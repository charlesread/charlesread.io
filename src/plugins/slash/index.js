'use strict'

const address = require('ip').address()
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone')

module.exports = function (fastify, opts, next) {
  fastify.get('/', (req, reply) => {
    const payload = {}
    if (req.credentials) {
      payload.hey = req.credentials.sub
    }

    payload.message = 'welcome to charlesread.io'

    if (!req.credentials) {
      payload.login = 'https://www.charlesread.io/login'
    }

    payload.ifYoureCurious = {
      repo: 'https://github.com/charlesread/charlesread.io',
      image: 'https://hub.docker.com/r/charlesread/charlesread.io',
      containerAddress: address
    }

    if (req.cookies.token) {
      const tokenDecoded = jwt.decode(req.cookies.token, {complete: true})
      payload.jwtIssued = moment.tz(tokenDecoded.payload.iat * 1000, 'America/New_York').format('LLLL z')
      payload.jwtExpiration = moment.tz(tokenDecoded.payload.exp * 1000, 'America/New_York').format('LLLL z')
    }
    reply.view('/pages/slash/index', {payload})
    // reply.send(payload)
  })
  next()
}