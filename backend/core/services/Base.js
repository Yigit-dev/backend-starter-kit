class BaseService {
  constructor(model) {
    this.model = model
  }

  async save(objects) {
    return this.model.insertMany(objects)
  }

  async load() {
    return this.model.find().lean()
  }

  async insert(object) {
    return this.model.create(object)
  }

  async removeBy(property, value) {
    return this.model.deleteOne({ [property]: value })
  }

  async update(id, object) {
    return this.model.findByIdAndUpdate(id, object, { new: true })
  }

  async findOneAndUpdate(condition, update) {
    return this.model.findOneAndUpdate(condition, update), { new: true }
  }

  async find(id) {
    return this.model.findById(id)
  }

  async findOne(value) {
    return this.model.findOne(value)
  }

  async query(obj) {
    return this.model.find(obj)
  }

  async findBy(property, value) {
    return this.model.find({ [property]: value })
  }
}

module.exports = BaseService
