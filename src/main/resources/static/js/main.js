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
    viewAllUsers(); // Загружаем и отображаем все книги
    viewAllCategories(); // Загружаем и отображаем все категории
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
            case 'viewBook':
                viewBook($(this), id); // Просмотр книги
                break;

            case 'addBook':
                addBook($(this)); // Добавление книги
                break;

            case 'editBook':
                editBook($(this), id); // Редактирование книги
                break;

            case 'deleteBook':
                deleteBook($(this), id); // Удаление книги
                break;

            case 'viewCategory':
                viewCategory($(this), id); // Просмотр категории
                break;

            case 'addCategory':
                addCategory($(this)); // Добавление категории
                break;

            case 'editCategory':
                editCategory($(this), id); // Редактирование категории
                break;
        }
    }).on('hidden.bs.modal', function(event){
        // Когда модальное окно закрывается, очищаем его содержимое
        $(this).find('.modal-title').html(''); // Очищаем заголовок
        $(this).find('.modal-body').html(''); // Очищаем тело
        $(this).find('.modal-footer').html(''); // Очищаем футер
    });
}

// Функция для отображения всех книг в таблице
$(document).ready(function(){
    viewAllUsers();
    defaultModal();
});

function defaultModal() {
    modal.modal({
        keyboard: true,
        backdrop: "static",
        show: false,
    }).on("show.bs.modal", function(event){
        let button = $(event.relatedTarget);
        let id = button.data('id');
        let action = button.data('action');

        switch(action) {
            case 'viewUser':
                viewUser($(this), id);
                break;

            case 'addUser':
                addUser($(this));
                break;

            case 'editUser':
                editUser($(this), id);
                break;

            case 'deleteUser':
                deleteUser($(this), id);
                break;
        }
    }).on('hidden.bs.modal', function(event){
        $(this).find('.modal-title').html('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });
}

async function viewAllUsers() {
    $('#userTable tbody').empty();
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