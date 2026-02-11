import "./style.css";

// Get the necessary DOM elements
const todoListElement = document.getElementById("todo-list");
const inputNewTodo = document.getElementById("new-todo");
const todoNav = document.getElementById("todo-nav");

// Define the state of our app
let todos = [
  { id: 1, text: "Buy milk", completed: false },
  { id: 2, text: "Buy bread", completed: false },
  { id: 3, text: "Buy jam", completed: true },
];
let nextTodoId = 4;
let filter = "all"; // can be 'all', 'active', or 'completed'

const filterTodos = (todos, filter) => {
  switch (filter) {
    case "all":
      return [...todos];
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "active":
      return todos.filter((todo) => !todo.completed);
    default:
      return [...todos];
  }
};
// Function to render the todos based on the current filter
function renderTodos() {
  // Clear the current list to avoid duplicates
  todoListElement.innerHTML = "";

  const filteredTodos = filterTodos(todos, filter);
  const todoElements = filteredTodos.map(createTodoItem);
  todoListElement.append(...todoElements);

  // Loop through the filtered todos and add them to the DOM
  // Helper function to create todo text element
  const createTodoText = (todo) => {
    const todoText = document.createElement("div");
    todoText.id = `todo-text-${todo.id}`;
    todoText.classList.add(
      "todo-text",
      ...(todo.completed ? ["line-through"] : []),
    );
    todoText.innerText = todo.text;
    return todoText;
  };

  // Helper function to create todo edit input element
  const createTodoEditInput = (todo) => {
    const todoEdit = document.createElement("input");
    todoEdit.classList.add("hidden", "todo-edit");
    todoEdit.value = todo.text;
    return todoEdit;
  };

  // Helper function to create a todo item
  const createTodoItem = (todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("p-4", "todo-item");
    todoItem.append(createTodoText(todo), createTodoEditInput(todo));
    return todoItem;
  };
  filteredTodos.forEach((todo) => {
    todoListElement.appendChild(createTodoItem(todo));
  });
}

// Event handler to create a new todo item
const handleKeyDownToCreateNewTodo = (event) => {
  if (event.key === "Enter") {
    const todoText = event.target.value.trim();
    if (todoText) {
      todos = addTodo(todos, todoText);
      event.target.value = ""; // Clear the input
      renderTodos();
    }
  }
};

// Helper function to create a new array with the existing todos and a new todo item
const addTodo = (todos, newTodoText) => [
  ...todos,
  { id: nextTodoId++, text: newTodoText, completed: false },
];

// Function to handle marking a todo as completed
function handleClickOnNavbar(event) {
  // if the clicked element is an anchor tag
  if (event.target.tagName === "A") {
    const hrefValue = event.target.href;
    const action = hrefValue.split("/").pop();
    filter = action === "" ? "all" : action;

    // render the app UI
    renderTodoNavBar(hrefValue);
    renderTodos();
  }
}

// Function to update the navbar anchor elements
function renderTodoNavBar(href) {
  const elements = todoNav.children;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.href === href) {
      element.classList.add(
        "underline",
        "underline-offset-4",
        "decoration-rose-800",
        "decoration-2",
      );
    } else {
      element.classList.remove(
        "underline",
        "underline-offset-4",
        "decoration-rose-800",
        "decoration-2",
      );
    }
  }
}

// Function to toggle the completed status of a todo
function handleClickOnTodoList(event) {
  let todo = null;
  if (event.target.id !== null && event.target.id.includes("todo-text")) {
    todo = event.target;
  }

  let todoIdNumber = -1;
  if (todo) {
    const todoId = event.target.id.split("-").pop();
    todoIdNumber = Number(todoId);
  }

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === todoIdNumber) {
      todos[i].completed = !todos[i].completed;
    }
  }

  // Re-render the app UI
  renderTodos();
}

// Add the event listeners
todoListElement.addEventListener("click", handleClickOnTodoList);
inputNewTodo.addEventListener("keydown", handleKeyDownToCreateNewTodo);
todoNav.addEventListener("click", handleClickOnNavbar);
document.addEventListener("DOMContentLoaded", renderTodos);
