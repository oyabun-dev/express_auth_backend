const bcrypt = require("bcrypt");

class Encrypter {
    constructor() {
        this.salt = bcrypt.genSaltSync(10);
    }
    hash(password) {
        return bcrypt.hashSync(password, this.salt);
    }
    compare(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}

module.exports = Encrypter;