class TodoList {
    // Constructor for instance
    constructor(apiBaseUrl, apiKey) {
        this.apiBaseUrl = apiBaseUrl;
        this.headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        }
         // DOM elements - to-do list, form, new task
        this.todoListElement = document.querySelector('.task-box');
        this.todoForm = document.getElementById('todo-form');
        this.newTaskInput = document.getElementById('new-task');
        
         // event listener handling form submission.
        this.todoForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.loadTodos();
    }

    // Load to-dos GET request to the API.
    loadTodos() {
        fetch(this.apiBaseUrl, { headers: this.headers })
            .then(response => response.json())
            .then(todos => this.displayTodos(todos))// Display to-dos
    }

     //creating todo for each to-do and adding them to the list
    displayTodos(todos) {
        this.todoListElement.innerHTML = '';// Clears current list
        todos.forEach(todo => {
            const item = this.createTodoElement(todo);// element for to-do
            this.todoListElement.appendChild(item);
        });
    }

    // Creates DOM element for a to-do lists
    createTodoElement(todo) {
        const item = document.createElement('li');
        const customCheckbox = document.createElement('label');
        customCheckbox.classList.add('custom-checkbox');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        
        checkbox.addEventListener('change', (event) => {
            this.updateTodo(todo.id, checkbox.checked);
            item.classList.toggle('dark-gray', checkbox.checked);
        });
    
        const checkmark = document.createElement('span');
        checkmark.classList.add('checkmark');
        customCheckbox.appendChild(checkbox);
        customCheckbox.appendChild(checkmark);
    
        const text = document.createElement('span');
        text.textContent = todo.text;
        if (todo.completed) {
            text.classList.add('completed');
            item.classList.add('dark-gray'); //turn dark-gray class if checkbox checked
        }
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));
    
        item.appendChild(customCheckbox); 
        item.appendChild(text);
        item.appendChild(deleteButton);
        return item;
    }    

    //adding a new to-do
    handleFormSubmit(event) {
        event.preventDefault();
        this.addTask(this.newTaskInput.value);
    }

    //new task POST request
    addTask(taskText) {
        if (!taskText.trim()) return;
        fetch(this.apiBaseUrl, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ text: taskText })
        })
        .then(response => response.json())
        .then(todo => {
            this.newTaskInput.value = ''; 
            this.loadTodos();
        })
        .catch(error => console.error('Error adding todo:', error));
    }

    // Updates a to-do's completion PUT
    updateTodo(id, completed) {
        fetch(`${this.apiBaseUrl}/${id}`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({ completed })  //updated completion status (JSON)
        })
        .then(response => response.json())
        .then(updatedTodo => {
            this.loadTodos();
        })
        .catch(error => console.error('Error updating todo:', error));
    }

    deleteTodo(id) {
        fetch(`${this.apiBaseUrl}/${id}`, {
            method: 'DELETE',
            headers: this.headers
        })
        .then(() => {
            this.loadTodos(); 
        })
        .catch(error => console.error('Error deleting todo:', error));
    }
}


const todoList = new TodoList('https://cse204.work/todos', 'cb1a13-9e96f7-bd95e1-7e07ab-beff4a');
