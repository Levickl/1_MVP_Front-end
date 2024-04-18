// Função para criar a tabela de dados do banco.
const getList = async () => {
    let url = 'http://127.0.0.1:5000/users';
    fetch(url, {
        method: 'get',
    })
    .then ((response) => response.json())
    .then((data)=>{
        console.log(data);
        data.Users.forEach(item => insertList(item.id, item.nome, item.email, item.genero))
    })
    .catch((error) =>{
        console.error('Error:', error);
    });
}
getList(); //executando assim que inciar o html.

//Função para criar as linhas da tabela
const insertList = (id, name, email, genero) => {
    var tabela = document.getElementById('listUsers');
    var novaLinha = tabela.insertRow();

    // Criando as células com os mesmos IDs e classes da primeira linha
    var checkboxCell = novaLinha.insertCell(0);
    checkboxCell.className = 'custom-chackbox';
    checkboxCell.innerHTML = 
    `<input type="checkbox" onchange="verif()" id="checkbox_${id}"/>
    <label for="checkbox_${id}"></label>`;

    var nameCell = novaLinha.insertCell(1);
    nameCell.textContent = name;

    var emailCell = novaLinha.insertCell(2);
    emailCell.textContent = email;

    var genderCell = novaLinha.insertCell(3);
    genderCell.textContent = genero;

    var actionsCell = novaLinha.insertCell(4);
    actionsCell.innerHTML = `<button onclick="editUser(${id})"></button>`;
}

//Função do botão adicionar 
function adicionarUser(event){
    event.preventDefault();

    //Abrindo a modal de criação
    var createModal = document.getElementById('createModal');

    //regastando os valores dos elementos do modal
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var genero = document.getElementById('genero').value;
    var cpf = document.getElementById('cpf').value;
    var datansc = document.getElementById('data').value;
    var celular = document.getElementById('numero').value;
    var senha = document.getElementById('senha').value;

    // Incluindo eles em um form
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('genero', genero);
    formData.append('cpf', cpf);
    formData.append('datansc', datansc);
    formData.append('celular', celular);
    formData.append('senha', senha);

    
    let chave = true;

    //Vereficando se a data esta vazia.
    for (let value of formData.values()) {
        if (value === "") {
            chave = false;
            break;
        }
    }

    if(chave) {
        // Convertendo o valor do genero para M ou F
        formData.set('genero', genero == '0' ? 'M' : 'F');
        fetch('http://127.0.0.1:5000/user',{
            method:'post',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);

        // Fechar a modal após a criação e recarregar a tela
        createModal.close();
        window.location.href = window.location.href;
        })
        .catch((error) => {
        console.error('Erro ao criar o usuário:', error);
        });
    }else{
        alert("Há dados faltando!\nPreencha todos os campos!");
    }
    
}

// Função para lidar com o botao/icone de editar da tabela
function editUser(userId) {

    // Abrindo a modal de edição
    var editModal = document.getElementById('editModal');
    editModal.showModal();

    // Fazendo uma solicitação à API para obter os dados do usuário com base no ID fornecido
    fetch('http://127.0.0.1:5000/user/?id=' + userId, {
        method: 'get',
    })
    .then(response => response.json())
    .then(data => {

        // Preencher os campos da modal com os dados do usuário obtidos da API
        document.getElementById('userId').value = data.id;
        document.getElementById('nomeEdit').value = data.nome;
        document.getElementById('emailEdit').value = data.email;
        var genero = data.genero.toUpperCase() == 'M' ? '0' : '1';
        document.getElementById('generoEdit').value = genero;
        document.getElementById('cpfEdit').value = data.cpf;
        document.getElementById('dataEdit').value = data.datansc;
        document.getElementById('numeroEdit').value = data.celular;
        document.getElementById('senhaEdit').value = data.senha;
    })
    .catch(error => {
        console.error('Erro ao obter dados do usuário:', error);
    });
}

// Função para lidar com o botão "Salvar" da tabela
function salvarEdicao(event) {
    event.preventDefault();

    // Obtendo os valores dos campos da modal
    var userId = parseInt(document.getElementById('userId').value);
    var nome = document.getElementById('nomeEdit').value;
    var email = document.getElementById('emailEdit').value;
    var genero = document.getElementById('generoEdit').value == '0' ? 'M' : 'F';
    var cpf = document.getElementById('cpfEdit').value;
    var datansc = document.getElementById('dataEdit').value;
    var celular = document.getElementById('numeroEdit').value;
    var senha = document.getElementById('senhaEdit').value;

    // Incluindo eles em um form
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('genero', genero);
    formData.append('cpf', cpf);
    formData.append('datansc', datansc);
    formData.append('celular', celular);
    formData.append('senha', senha);

    let chave = true;
    for (let value of formData.values()) {
        if (value === "") {
            chave = false;
            break;
        }
    }

    if (chave) {
        let url = 'http://127.0.0.1:5000/user';
        fetch(url, {
            method: 'PUT',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
        console.log('Dados atualizados:', data);

        // Fechar a modal após a atualização e recarregar a tela
        var editModal = document.getElementById('editModal');
        editModal.close();
        window.location.href = window.location.href;
        })
        .catch((error) => {
        console.error('Erro ao atualizar usuário:', error);
        });
    }else{
        alert("Há dados faltando!\nPreencha todos os campos!");
    }
    
}

//Função para lidar com a checkbox do id "Todos"
function checkAll(source) {
    // Resgata todos os elementos checkbox do codigo 
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Deixa todos os elementos com o atributo checked
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
}

//Função para contar a quantidade de Checkbox estão selecionadas
function contChecks(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

     // Filtrar os checkboxes para excluir o checkbox "Todos" da contagem
    const checkboxesFiltered = Array.from(checkboxes).filter(checkbox => checkbox.id !== 'todos');
    // Número selecionado após filtragem
    const numSelected = checkboxesFiltered.length;
    return numSelected;
}

// Para verificar se há 0 checkbox's selecionadas e desativar a "todos" caso, entao
function verif(){
    const numSelec = contChecks();
    const checkbox = document.getElementById('todos');
    if (numSelec === 0) {
        checkbox.checked = false;
    }
}

// Função para lidar com a mostragem da modal de deletar users
function modalRemove(){
    x = document.getElementById('deleteModal');
    x.showModal();
    document.getElementById('numSelectedText').textContent = contChecks();
}

//Função para lidar com o botão "Cancelar" de qualquer modal
function btnCancel(idBtn){
        // Obtém o elemento pai do botão "cancelar"
        //console.log(idbtn)
        var parentDialog = idBtn.closest('dialog');
        
        // Fecha o dialog associado
        if (parentDialog.showModal) {
            parentDialog.close();
        }
}

// Função para lidar com o botão de deletar
function deleteSelect() {

    // Verifica se tem pelo menos um selecionado
    const numSelected = contChecks();
    if (numSelected === 0) {
        alert("Selecione pelo menos um usuário para excluir.");
        return;
    }

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Filtrar os checkboxes para excluir o checkbox "todos" da contagem e da lista de IDs
    const checkboxesFiltered = Array.from(checkboxes).filter(checkbox => checkbox.id !== 'todos');

    // Extração dos IDs apenas dos checkboxes selecionados (sem o checkbox "todos")
    const ids = checkboxesFiltered.map(checkbox => checkbox.id.split('_')[1]);
    const idsString = ids.join(","); // Convertendo a lista de IDs para uma separada por vírgula

    const url = 'http://127.0.0.1:5000/users?ids=' + idsString;
    fetch(url, {
        method: 'delete',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir os usuários.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Usuários excluídos com sucesso:', data);

        // Fechar a modal após a exclusão e recarrega a tela
        x = document.getElementById('deleteModal');
        x.close();
        window.location.href = window.location.href;
    })
    .catch(error => {
        console.error('Erro ao excluir os usuários:', error);
    });
}
