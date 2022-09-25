const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique : true },
    password: { type: String, required: true },
});

//On applique le plugin mongoose au schéma User
//le package mongoose-unique-validator permet de s'assurer que une adresse mail ne peut etre utilisée d'une fois
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

