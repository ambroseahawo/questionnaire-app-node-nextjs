const mongoose = require('mongoose');

// Schemas
const exampleSchema = new mongoose.Schema(
  {
    attribute1: { type: String, required: true }
  }
);

const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;