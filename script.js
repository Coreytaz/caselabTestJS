"use strict";

class LocalStorage {
  constructor(key) {
    this.localStorage = window.localStorage;
    this.key = key;
  }

  getLocalStorage() {
    const todoList = this.localStorage.getItem(this.key);
    const list = JSON.parse(todoList);
    if (list) {
      return list;
    } else {
      this.localStorage.setItem(this.key, JSON.stringify({}));
    }
  }

  setLocalStorage({ text, checked, uniqueId, completed }) {
    const todoList = this.localStorage.getItem(this.key);
    const list = JSON.parse(todoList);
    list[uniqueId] = { text, checked, completed };
    this.localStorage.setItem(this.key, JSON.stringify(list));
  }

  removeLocalStorage(uniqueId) {
    const todoList = this.localStorage.getItem(this.key);
    const list = JSON.parse(todoList);
    delete list[uniqueId];
    this.localStorage.setItem(this.key, JSON.stringify(list));
  }
}

class Checkbox {
  constructor(text, value, uniqueId, completed) {
    this.text = text;
    this.value = value;
    this.uniqueId = uniqueId;
    this.completed = completed;
    this.domNode = document.createElement("div");
    this.label = document.createElement("label");
    this.checkbox = document.createElement("input");
    this.actions = document.createElement("div");

    this.checkbox.id = uniqueId;
    this.label.setAttribute("for", uniqueId);
    this.checkbox.type = "checkbox";
    this.label.innerHTML = text;
    this.checkbox.checked = value;
    this.domNode.setAttribute("role", "checkbox");
    this.domNode.setAttribute("aria-checked", value);

    this.domNode.appendChild(this.checkbox);
    this.domNode.appendChild(this.label);

    this.label.addEventListener("click", this.toggleCheckbox.bind(this));
    this.loadLocalStorage = new LocalStorage("todoList");
  }

  setAttribute(name, value) {
    this.domNode.setAttribute(name, value);
  }

  createActions(icon, action) {
    const actions = document.createElement("span");
    actions.innerHTML = icon;
    actions.addEventListener("click", action);
    this.actions.appendChild(actions);
    this.domNode.append(this.actions);
  }

  toggleCheckbox() {
    this.loadLocalStorage.setLocalStorage({
      text: this.text,
      checked: !this.checkbox.checked,
      uniqueId: this.uniqueId,
      completed: this.completed,
    });
    this.domNode.setAttribute("aria-checked", !this.checkbox.checked);
  }
}

class TodoList {
  constructor() {
    this.loadLocalStorage = new LocalStorage("todoList");
    this.domNode = document.createElement("ul");
    this.domNode.classList.add("checkboxes");

    this.loadTodoList();
  }

  getCheckedTodo() {
    const todoList = this.loadLocalStorage.getLocalStorage();
    const checkedTodo = Object.keys(todoList).filter(
      (key) => todoList[key].checked
    );
    return checkedTodo;
  }

  loadTodoList() {
    const todoList = this.loadLocalStorage.getLocalStorage();
    Object.keys(todoList).forEach((key) => {
      const { text, checked, completed } = todoList[key];
      this.addNewToDo({
        text,
        checked,
        completed,
        uniqueId: key,
      });
    });
  }

  addNewToDo({
    text,
    checked = false,
    completed = false,
    uniqueId = "inputLabel_" + Math.random().toString(36).substr(2, 9),
  }) {
    this.loadLocalStorage.setLocalStorage({
      text,
      checked,
      uniqueId,
      completed,
    });
    const checkbox = new Checkbox(text, checked, uniqueId, completed);
    checkbox.createActions(
      `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="deleteElement"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" /></svg
>`,
      () => this.removeTodo(uniqueId)
    );
    checkbox.createActions(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="completedTodo">
      <polyline points="20 6 9 17 4 12" />
    </svg>`,
      () => this.completedTodo(uniqueId, checkbox)
    );
    checkbox.setAttribute("aria-completed", completed);
    const li = document.createElement("li");
    li.appendChild(checkbox.domNode);
    this.domNode.appendChild(li);
  }

  // completeSelectedTodo() {}

  deleteSelectedTodo() {
    const checkedTodo = this.getCheckedTodo();
    checkedTodo.forEach((key) => {
      this.removeTodo(key);
    });
  }

  completedTodo(uniqueId, checkbox) {
    const todoList = this.loadLocalStorage.getLocalStorage();
    const todo = todoList[uniqueId];
    todo.completed = !todo.completed;
    checkbox.setAttribute("aria-completed", todo.completed);
    this.loadLocalStorage.setLocalStorage({ ...todo, uniqueId });
  }

  removeTodo(uniqueId) {
    this.loadLocalStorage.removeLocalStorage(uniqueId);
    this.domNode.removeChild(
      document.getElementById(uniqueId).parentNode.parentNode
    );
  }
}

function addNewElement(todoList) {
  const input = document.querySelector(".myInput");
  if (input.value.length === 0) {
    alert("Введите задачу");
    return;
  }
  todoList.addNewToDo({ text: input.value, checked: false });
  input.value = "";
}

document.addEventListener("DOMContentLoaded", (event) => {
  const container = document.querySelector(".container");
  const todoList = new TodoList();
  container.appendChild(todoList.domNode);

  const add = document.querySelector("#addTodo");
  const delSelectedTodo = document.querySelector("#delSelectedTodo");
  const completeSelectedTodo = document.querySelector("#completeSelectedTodo");

  add.addEventListener("click", (e) => {
    e.preventDefault();
    addNewElement(todoList);
  });
  delSelectedTodo.addEventListener("click", (e) => {
    e.preventDefault();
    todoList.deleteSelectedTodo();
  });
  completeSelectedTodo.addEventListener("click", (e) => {
    e.preventDefault();
  });
});
