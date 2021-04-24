class UserController {

    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEditCancel();
    }

    onEditCancel() {
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {
            this.showPanelCreate();
        });
    }
    showPanelCreate() {
        document.querySelector('#box-user-create').style.display = "block";
        document.querySelector('#box-user-update').style.display = "none";
    }

    showPanelUpdate() {
        document.querySelector('#box-user-create').style.display = "none";
        document.querySelector('#box-user-update').style.display = "block";
    }

    onSubmit() {

        this.formEl.addEventListener("submit", event => {
            //Cancela o comando padrão que o evento teria
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type=submit]");
            btnSubmit.disabled = true;
            let values = this.getValues();

            if (!values) return false;

            this.getPhoto().then(content => {
                //recebe conteudo do arquivo
                values.photo = content;
                this.addLine(values);
                //Limpa formulário
                this.formEl.reset();
                btnSubmit.disabled = false;

            }, (e) => {
                console.log(e);
            });
        });
    }

    getPhoto() {
        //(Promisse) É uma intenção, uma promessa, executa uma ação assíncrona
        return new Promise((resolve, reject) => {
            // FileReader => Útil para ler e manipular arquivos e pastas
            let fileReader = new FileReader

            let elements = [...this.formEl.elements].filter(item => {
                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = elements[0].files[0]

            //callBack, função usada como retorno após a execução de uma rotina
            //ocorre depois do readAsDataURL, não se sabe quando
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = () => {
                reject(e);
            };

            file ? fileReader.readAsDataURL(file) : resolve('dist/img/boxed-bg.jpg');
        });
    }

    getValues() {

        let user = {};

        let isValid = true;

        //Spread expressão esperando múltiplos parâmetros
        // o uso das reticências significa que eu não preciso informar quantos indices existem
        [...this.formEl.elements].forEach(function (field, index) {
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }
            if (field.name == "gender" && field.checked) {
                user[field.name] = field.value;
            } else if (field.name == "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            return false;
        }
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }

    addLine(dataUser) {
        let tr = document.createElement('tr');

        //Serialização - Transformar um objeto em texto
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${dataUser.register.toLocaleDateString()}</td>
            <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        tr.querySelector(".btn-edit").addEventListener('click', e => {
            JSON.parse(tr.dataset.user);
            this.showPanelUpdate();
        });

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    updateCount() {
        //DataSet - faz parte da API Web permite leitura e escrita em elementos com data-

        let numberUsers = 0;
        let numberAdmins = 0;
        [...this.tableEl.children].forEach(tr => {
            numberUsers++;
            // Interpreta a string e formata para o formato real
            let user = JSON.parse(tr.dataset.user);
            if (user._admin) numberAdmins++;
        });
        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmins;
    }

}

//(Síncrono)Toda ação entre site e usuário ocorre em sincronia 

//(Assíncrono)Atividades e recursos do site não dependem da ação do usuário 

//Unix TimesStamp conta a quantd de segundos desde //01-01-1970
//Bug 2038

//Outra forma de fazer
//<td>${Utils.dateFormat(dataUser.register)}</td>