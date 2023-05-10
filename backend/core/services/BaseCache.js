const { client } = require('~/config/redis')
const handleAsync = require('~/utils/handleAsync')
const handleError = require('~/utils/handleError')

class BaseCacheService {
  constructor(model, ttl) {
    this.cacheClient = client
    this.cacheKey = model.modelName
    this.cacheTTL = ttl || 600
  }

  async getCachedData() {
    console.log('GET REDIS WORKING')
    const data = await this.cacheClient.get(this.cacheKey)
    return data ? JSON.parse(data) : null
  }

  async setCachedData(data, ttl = this.cacheTTL) {
    console.log('SET REDIS WORKING')
    const cachedData = JSON.stringify(data)
    await this.cacheClient.setEx(this.cacheKey, ttl, cachedData)
  }

  async cachingLoad(fetchFromDatabase) {
    let [data, error] = await handleAsync(this.getCachedData(this.cacheKey))
    if (error) {
      handleError(error)
    }
    if (data === null) {
      console.log('FETCH FROM DATABASE AND WRITE REDIS')
      data = await fetchFromDatabase()
      await this.setCachedData(data)
    } else {
      console.log('LOAD FROM REDIS')
    }
    return data
  }

  async addToCache(data) {
    const [existingValues, error] = await handleAsync(this.getCachedData())
    if (error) {
      handleError(error)
    }
    const updatedValues = existingValues ? [...existingValues, data] : [data]
    await this.setCachedData(updatedValues)
  }

  async updateInCache(id, updatedData) {
    const [existingValues, error] = await handleAsync(this.getCachedData())
    if (error) {
      handleError(error)
    }

    const index = existingValues.findIndex(item => item._id && item._id.toString() === id)
    if (index === -1) return

    Object.assign(existingValues[index], updatedData)
    await this.setCachedData(existingValues)
  }

  async removeFromCache(id) {
    const [existingValues, error] = await handleAsync(this.getCachedData())
    if (error) {
      handleError(error)
    }

    const itemIndex = existingValues.findIndex(item => item._id && item._id.toString() === id)
    if (itemIndex === -1) return
    existingValues.splice(itemIndex, 1)

    await this.setCachedData(existingValues)
  }
}

module.exports = BaseCacheService
