const API_KEY = 'cb1a13-9e96f7-bd95e1-7e07ab-beff4a';
const API_BASE_URL = 'https://cse204.work/todos';

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
};

document.addEventListener('DOMContentLoaded', function() {
    loadTodos();

    document.getElementById('todo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newTaskInput = document.getElementById('new-task');
        addTask(newTaskInput.value);
    });
});

function loadTodos() {
    fetch(API_BASE_URL, { headers })
        .then(response => response.json())
        .then(todos => displayTodos(todos))
        .catch(error => console.error('Error fetching todos:', error));
}

function displayTodos(todos) {
    const todoListElement = document.querySelector('.task-box');
    todoListElement.innerHTML = '';

    todos.forEach(todo => {
        const item = document.createElement('li');
        
        const customCheckbox = document.createElement('label');
        customCheckbox.classList.add('custom-checkbox');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => updateTodo(todo.id, checkbox.checked));
        const checkmark = document.createElement('span');
        checkmark.classList.add('checkmark');
        customCheckbox.appendChild(checkbox);
        customCheckbox.appendChild(checkmark);

        const text = document.createElement('span');
        text.textContent = todo.text;
        if (todo.completed) {
            text.classList.add('completed');
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));

        item.appendChild(customCheckbox); 
        item.appendChild(text);
        item.appendChild(deleteButton);
        todoListElement.appendChild(item);
    });
}

function addTask(taskText) {
    if (!taskText.trim()) return;

    fetch(API_BASE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: taskText })
    })
    .then(response => response.json())
    .then(todo => {
        document.getElementById('new-task').value = ''; 
        loadTodos();
    })
    .catch(error => console.error('Error adding todo:', error));
}

function updateTodo(id, completed) {
    fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ completed })
    })
    .then(response => response.json())
    .then(updatedTodo => {
        loadTodos();
    })
    .catch(error => console.error('Error updating todo:', error));
}

function deleteTodo(id) {
    fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers
    })
    .then(() => {
        loadTodos(); 
    })
    .catch(error => console.error('Error deleting todo:', error));
}
