
module.exports = {
  getOrSetModel: (mongoose, model_name, schema) => mongoose.models[model_name] ? mongoose.models[model_name] : mongoose.model(model_name, schema)
}
