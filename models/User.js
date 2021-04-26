class User {
    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    get id() {
        return this._id;
    }
    get register() {
        return this._register;
    }
    get name() {
        return this._name;
    }
    get gender() {
        return this._gender;
    }
    get birth() {
        return this._birth;
    }
    get country() {
        return this._country;
    }
    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    get photo() {
        return this._photo;
    }
    get admin() {
        return this._admin;
    }

    set photo(value) {
        this._photo = value;
    }

    loadFromJSON(json) {
        for (let name in json) {
            switch (name) {
                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
            }
        }
    }

    getNewId() {
        let usersId = parseInt(localStorage.getItem('usersId'));

        if (!usersId > 0) usersId = 0;

        usersId++;

        localStorage.setItem('usersId', usersId);

        return usersId;
    }

    save() {
        let users = User.getUserStorage();

        if (this.id > 0) {
            //map => Localiza uma informação e mapeia sua posição, se alterar dadps, substitui
            users.map(u => {
                if (u._id == this.id) {
                    Object.assign(u, this);
                }
                return u;
            })
        } else {
            this._id = this.getNewId();
            users.push(this);
        }
        //sessionStorage.setItem => permite gravar dados na sessão. se fechar o navegador, deixa de existir
        // sessionStorage.setItem('users', JSON.stringify(users));
        //LocalStorage recurso da API Web. Armazena dados no navegador do usuário
        localStorage.setItem('users', JSON.stringify(users));
    }

    static getUserStorage() {
        let users = [];

        if (localStorage.getItem("users")) {
            users = JSON.parse(localStorage.getItem("users"));
        }

        return users;
    }

    delete() {
        let users = User.getUserStorage();
        users.forEach((userData, index) => {
            if (this._id == userData._id) {
                //index a ser removido e qts items devem ser removidos
                users.splice(index, 1);
            }
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}