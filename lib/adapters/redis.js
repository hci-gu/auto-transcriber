const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient()
const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)

module.exports = {
  get: async (id) => {
    console.log('get', id)
    const data = await get(id)
    console.log(data)
    return JSON.parse(data)
  },
  set: (key, data) => {
    return set(key, JSON.stringify(data))
  },
}
