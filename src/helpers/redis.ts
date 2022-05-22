import * as redis from 'redis'
import config from '../config'

class Redis {
  client = redis.createClient({
    socket: {
      port: config.redisPort as unknown as number,
      host: config.redisHost,
    },
  })

  connect = (callback: any) => {
    this.client
      .connect()
      .then(() => {
        callback(true)
      })
      .catch((err) => {
        console.log(err)
        callback(false)
      })
  }

  set = async (key: any, value: any, age: number) => {
    try {
      this.client.setEx(key, age, value)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  get = async (key: any) => {
    try {
      const data = await this.client.get(key)
      console.log(data, key)
      return data || false
    } catch (error) {
      return false
    }
  }

  getKeyData = (key: any, callback: any) => {
    this.client
      .get(key)
      .then((data) => {
        callback(data)
      })
      .catch((err) => {
        callback(false)
      })
  }

  del = async (key: any) => {
    try {
      this.client.del(key)
    } catch (error) {
      return false
    }
  }

  flush = async () => {
    try {
      this.client.flushDb()
    } catch (error) {
      return false
    }
  }
}

export default new Redis()
