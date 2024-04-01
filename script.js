const apiUrl = 'http://cse204.work/todo-api/';
const apiKey = 'cb1a13-9e96f7-bd95e1-7e07ab-beff4a';

window.onload = () => {
    const form = document.querySelector("#addForm");
    form.addEventListener("submit", addItem);
  items.addEventListener("click", handleItemInteraction);

  // Load existing ToDos from the server
  loadTodos();
};

function loadTodos() {
  fetch(`${apiUrl}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey
    }
  })
  .then(response => response.json())
  .then(data => {
    data.forEach(todo => addTodoToDOM(todo));
  })
  .catch(error => console.error('Error loading ToDos:', error));
}

function addItem(e) {
  e.preventDefault();
  const newItem = document.getElementById("item").value.trim();
  if (!newItem) return;

  const todo = {
    text: newItem
  };

  // Send new ToDo to the server
  fetch(`${apiUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify(todo)
  })
  .then(response => response.json())
  .then(todo => {
    addTodoToDOM(todo);
    document.getElementById("item").value = ""; // Clear input field
  })
  .catch(error => console.error('Error adding ToDo:', error));
}

function addTodoToDOM(todo) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.setAttribute('data-id', todo.id);

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "mr-2";
  checkBox.checked = todo.completed;
  checkBox.addEventListener('change', toggleTodoCompletion);

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn-danger btn btn-sm float-right delete";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener('click', deleteTodo);

  li.appendChild(checkBox);
  li.appendChild(document.createTextNode(todo.text));
  li.appendChild(deleteButton);

  items.appendChild(li);
}

function handleItemInteraction(e) {
  if (e.target.className.includes("delete")) {
    deleteTodo.call(e.target);
  }
}

function deleteTodo() {
  const li = this.parentNode;
  const todoId = li.getAttribute('data-id');

  fetch(`${apiUrl}${todoId}`, {
    method: 'DELETE',
    headers: {
      'x-api-key': apiKey
    }
  })
  .then(() => {
    li.remove(); // Remove the ToDo item from the DOM
  })
  .catch(error => console.error('Error deleting ToDo:', error));
}

function toggleTodoCompletion() {
  const li = this.parentNode;
  const todoId = li.getAttribute('data-id');
  const completed = this.checked;

  fetch(`${apiUrl}${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify({ completed })
  })
  .then(() => {
    li.classList.toggle('completed', completed);
  })
  .catch(error => console.error('Error updating ToDo:', error));
}

function toggleButton(ref, btnID) {
  let submit = document.getElementById(btnID);
  submit.disabled = ref.value.trim() === "";
}
