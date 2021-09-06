const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
////selector
const todoInput = $(".todo-input");
const todoButton = $(".todo-button");
const todoList = $(".todo-list");
const filterOption = $(".filter-todo");
var idTodo = JSON.parse(localStorage.getItem("id")) ?? 0;
//event Listeners
document.addEventListener("DOMContentLoaded", loadTodosList);
todoButton.addEventListener("click", addToDo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
//function
function addToDo(e) {
  //prevent from submit
  e.preventDefault();
  //check input value isEmpty
  let isInputValueEmpty = isInputEmpty(todoInput.value);
  let announcement = $(".empty_input");
  if (isInputValueEmpty) {
    if (!announcement) {
      //announnounce haven't existed
      todoInput.classList.add("empty");
      createAnouncement(); //createAnouncement
    }
  } else {
    if (announcement) {
      announcement.remove();
      todoInput.classList.remove("empty");
    }
    createTodoItem(todoInput.value, false, idTodo);
    saveLocalTodos(todoInput.value, false);
    //clear to input values
    todoInput.value = "";
  }
}

//create todo _item
function createTodoItem(content, checked, id) {
  //todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  todoDiv.setAttribute("id", id);
  if (checked) todoDiv.classList.add("completed");
  //create li
  const newTodo = document.createElement("li");
  newTodo.innerText = content;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  //check mark buttons
  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.classList.add("complete-btn");
  todoDiv.appendChild(completeButton);
  //trash mark buttons
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //append to list
  todoList.appendChild(todoDiv);
}

//anounce input value empty
function isInputEmpty(value) {
  if (value === "") return true;
  return false;
}
//create anounce message
function createAnouncement() {
  const announcement = document.createElement("p");
  announcement.classList.add("empty_input");
  announcement.innerHTML = "input is empty";
  todoInput.parentElement.appendChild(announcement);
}

//delete check item todo
function deleteCheck(e) {
  const item = e.target;
  //delete
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    //animation fall
    todo.classList.add("fall");
    todo.addEventListener("transitionend", () => {
      //remove UI
      todo.remove();
    });
    //remove at localStorage
    deleteTodoItemAtLocalStorage(todo);
  }
  //check mark
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    saveCheckedItemToLocalStorage(todo);
  }
}

//save checked todo item to localStorage
function saveCheckedItemToLocalStorage(todo) {
  let todos = isEmptyLocal();
  let checkedItem = todos.find(function (todoObject) {
    return todo.getAttribute("id") == todoObject.idTodo;
  });
  console.log(checkedItem);
  checkedItem.status = !checkedItem.status;
  localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        {
          if (!todo.classList.contains("completed"))
            todo.style.display = "flex";
          else todo.style.display = "none";
        }
        break;
    }
  });
}

//isEmpty local
function isEmptyLocal() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  if (todos.length === 0) {
    idTodo = 0;
    localStorage.setItem("id", JSON.stringify(0));
  }
  return todos;
}

//save local todo
function saveLocalTodos(todo, status) {
  console.log("savev");
  //check do i have already in there
  let todos = isEmptyLocal();

  let todoObject = {
    idTodo,
    status,
    content: todo,
  };
  idTodo++;
  localStorage.setItem("id", JSON.stringify(idTodo));
  todos.push(todoObject);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//render todos list to UI from localStorage
function loadTodosList() {
  let todos = isEmptyLocal();
  todos.forEach(function (todo) {
    createTodoItem(todo.content, todo.status, todo.idTodo);
  });
}

//delete todo item at localstorage when user click trash button
function deleteTodoItemAtLocalStorage(todo) {
  let todos = isEmptyLocal();
  let indexItem;
  for (let index in todos) {
    if (todos[index].idTodo == todo.id) {
      indexItem = index;
      break;
    }
  }
  console.log(indexItem);
  todos.splice(indexItem, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}
