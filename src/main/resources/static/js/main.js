// Получаем элементы модального окна и кнопок
let modal = $('#defaultModal'); // Модальное окно
let modalTitle = $('.modal-title'); // Заголовок модального окна
let modalBody = $('.modal-body'); // Тело модального окна
let modalFooter = $('.modal-footer'); // Футер модального окна

// Создаем кнопки для модального окна
let clearFormButton = $('<button type="reset" class="btn btn-secondary">Clear</button>'); // Кнопка "Очистить"
let primaryButton = $('<button type="button" class="btn btn-primary"></button>'); // Основная кнопка (например, "Сохранить")
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>'); // Кнопка закрытия модального окна
let dangerButton = $('<button type="button" class="btn btn-danger"></button>'); // Кнопка для опасных действий (например, "Удалить")

// Когда документ загружен, выполняем следующие действия
$(document).ready(function(){
    viewAllUsers(); // Загружаем и отображаем всех пользователей
    defaultModal(); // Инициализируем модальное окно
});

// Функция для настройки модального окна
function defaultModal() {
    modal.modal({
        keyboard: true, // Разрешить закрытие модального окна с помощью клавиши ESC
        backdrop: "static", // Запретить закрытие модального окна при клике вне его
        show: false, // Не показывать модальное окно при инициализации
    }).on("show.bs.modal", function(event){
        // Когда модальное окно открывается, определяем, какое действие нужно выполнить
        let button = $(event.relatedTarget); // Кнопка, которая вызвала открытие модального окна
        let id = button.data('id'); // Получаем ID объекта (например, книги или категории)
        let action = button.data('action'); // Получаем действие (например, просмотр, добавление, редактирование, удаление)

        // В зависимости от действия вызываем соответствующую функцию
        switch(action) {
            case 'viewUser':
                viewUser($(this), id); // Просмотр пользователя
                break;

            case 'addUser':
                addUser($(this)); // Добавление пользователя
                break;

            case 'editUser':
                editUser($(this), id); // Редактирование пользователя
                break;

            case 'deleteUser':
                deleteUser($(this), id); // Удаление пользователя
                break;
        }
    }).on('hidden.bs.modal', function(event){
        // Когда модальное окно закрывается, очищаем его содержимое
        $(this).find('.modal-title').html(''); // Очищаем заголовок
        $(this).find('.modal-body').html(''); // Очищаем тело
        $(this).find('.modal-footer').html(''); // Очищаем футер
    });
}

// Функция для отображения всех пользователей в таблице
async function viewAllUsers() {
    $('#userTable tbody').empty(); // Очищаем таблицу перед добавлением новых данных
    const usersResponse = await userService.findAll();
    const usersJson = await usersResponse.json();
    usersJson.forEach(user => {
        let userRow = `<tr>
            <th scope="row">${user.id}</th>
            <td>${user.username}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td class="text-center">
                <div class="btn-group" role="group" aria-label="Action Buttons">
                    <button class="btn btn-info btn-sm" data-id="${user.id}" data-action="viewUser" data-toggle="modal" data-target="#defaultModal"><i class="far fa-eye"></i></button>
                    <button class="btn btn-success btn-sm" data-id="${user.id}" data-action="editUser" data-toggle="modal" data-target="#defaultModal"><i class="far fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" data-id="${user.id}" data-action="deleteUser" data-toggle="modal" data-target="#defaultModal"><i class="far fa-trash-alt"></i></button>
                </div>
            </td>
        </tr>`;
        $('#userTable tbody').append(userRow);
    });
}

// Функция для добавления нового пользователя
function addUser(modalElement) {
    modalTitle.text('Add New User');
    modalBody.html($('.userForm').clone().show());
    primaryButton.text('Save').off('click').on('click', function() {
        let userData = {
            username: $('#username').val(),
            firstname: $('#firstname').val(),
            lastname: $('#lastname').val(),
            age: $('#age').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };
        userService.add(userData).then(() => {
            modalElement.modal('hide');
            viewAllUsers();
        });
    });
    modalFooter.empty().append(primaryButton, dismissButton);
}

// Функция для редактирования пользователя
function editUser(modalElement, id) {
    modalTitle.text('Edit User');
    modalBody.html($('.userForm').clone().show());
    userService.findById(id).then(response => response.json()).then(user => {
        $('#username').val(user.username);
        $('#firstname').val(user.firstname);
        $('#lastname').val(user.lastname);
        $('#age').val(user.age);
        $('#email').val(user.email);
        $('#password').val(user.password);
    });
    primaryButton.text('Update').off('click').on('click', function() {
        let userData = {
            username: $('#username').val(),
            firstname: $('#firstname').val(),
            lastname: $('#lastname').val(),
            age: $('#age').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };
        userService.update(id, userData).then(() => {
            modalElement.modal('hide');
            viewAllUsers();
        });
    });
    modalFooter.empty().append(primaryButton, dismissButton);
}

// Функция для удаления пользователя
function deleteUser(modalElement, id) {
    modalTitle.text('Delete User');
    modalBody.html('Are you sure you want to delete this user?');
    dangerButton.text('Delete').off('click').on('click', function() {
        userService.delete(id).then(() => {
            modalElement.modal('hide');
            viewAllUsers();
        });
    });
    modalFooter.empty().append(dangerButton, dismissButton);
}

const userService = {
    findAll: async () => {
        return await fetch('/api/users');
    },
    findById: async (id) => {
        return await fetch('/api/users/' + id);
    },
    add: async (data) => {
        return await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    },
    update: async (id, data) => {
        return await fetch('/api/users/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    },
    delete: async (id) => {
        return await fetch('/api/users/' + id, {
            method: 'DELETE'
        });
    },
};