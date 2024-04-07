
// FIRST ENTRY WITHOUT LOGIN
class Guest {
    constructor(id, name, commands) {
        this.id = id
        this.name = name
        this.commands = commands
    }
}

// NORMAL USER
class User {
    constructor(id, name, email, password, commands) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        this.commands = commands
    }
}

// ADMINISTRATOR USER
class Root {
    constructor(sudo, id, name, email, password, commands) {
        this.sudo = sudo
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        this.commands = commands
    }
}

export {
    Guest,
    User,
    Root
}