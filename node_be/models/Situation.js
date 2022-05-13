const mongoose = require('mongoose');
const ContextAttributesSchema = require('./ContextAttributes');

const SituationSchema = mongoose.Schema({
    situation_name: {
        type: String,
        required: true
    },
    situation_description: {
        type: String,
        required: true
    },
    context_attributes: [ContextAttributesSchema],
});

module.exports = mongoose.model('Situations', SituationSchema);