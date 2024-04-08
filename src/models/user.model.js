const { Schema, model } = require('mongoose');

const userSchema = new Schema ({
    name: String,
    email: {
        type: String,
        required: true,
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'regular'],
        default: 'regular'
    },
    cart: [{ type:Schema.Types.ObjectId, ref: 'product' }]
}, { versionKey: false, timestamps: true});

module.exports = model('user', userSchema);