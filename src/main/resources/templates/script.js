document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userTableBody = document.getElementById('userTableBody');

    // Загрузка списка пользователей при загрузке страницы
    loadUsers();

    // Обработка отправки формы (добавление/редактирование пользователя)
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const userId = document.getElementById('userId').value;
        const user = {
            username: document.getElementById('username').value,
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        if (userId) {
            updateUser(userId, user);
        } else {
            addUser(user);
        }
    });

    // Функция для загрузки списка пользователей
    function loadUsers() {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                userTableBody.innerHTML = '';
                users.forEach(user => {
                    addUserToTable(user);
                });
            });
    }

    // Функция для добавления пользователя в таблицу
    function addUserToTable(user) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    }

    // Функция для добавления нового пользователя
    function addUser(user) {
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(newUser => {
                addUserToTable(newUser);
                userForm.reset();
            });
    }

    // Функция для редактирования пользователя
    function editUser(id) {
        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('userId').value = user.id;
                document.getElementById('username').value = user.username;
                document.getElementById('firstname').value = user.firstname;
                document.getElementById('lastname').value = user.lastname;
                document.getElementById('age').value = user.age;
                document.getElementById('email').value = user.email;
                document.getElementById('password').value = '';
            });
    }

    // Функция для обновления пользователя
    function updateUser(id, user) {
        fetch(`/api/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...user, id })
        })
            .then(response => response.json())
            .then(updatedUser => {
                loadUsers();
                userForm.reset();
                document.getElementById('userId').value = '';
            });
    }

    // Функция для удаления пользователя
    function deleteUser(id) {
        fetch(`/api/users/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                loadUsers();
            });
    }
});