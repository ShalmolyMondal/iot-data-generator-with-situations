const mongoose = require('mongoose');
const DataValuesSchema = require('./DataValues');

const ContextAttributesSchema = mongoose.Schema({
    context_attribute_name: {
        type: String,
        required: true
    },
    context_attribute_description: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: false,
        default: null
    },
    data_values: [DataValuesSchema],
});

module.exports = ContextAttributesSchema;