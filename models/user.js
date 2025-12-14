const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true   // recommended for login systems
    }
});

// Correct: Apply plugin on schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
