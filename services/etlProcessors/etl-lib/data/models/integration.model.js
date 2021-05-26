// todo: set base model object 
const baseModel = require("./base.model")

module.exports = mongoose => {
  let modelName = 'integrations'
  let schema = mongoose.Schema(
    {
      // todo: add schema here 
    },
    { 
      timestamps: true,
      strict: false,
      collection: modelName
    }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Integration = baseModel.getOrSetModel(mongoose, modelName, schema)
  return Integration;
};
