const bcrypt = require("bcrypt");

class Encrypter {
    static hash(password) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
    static compare(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}

module.exports = Encrypter;