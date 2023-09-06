"use strict";

class Checkbox {
  constructor(domNode) {
    this.domNode = domNode;
    this.domNode.tabIndex = 0;

    if (!this.domNode.getAttribute("aria-checked")) {
      this.domNode.setAttribute("aria-checked", "false");
    }
    this.domNode.childNodes[1].addEventListener("keydown", this.onKeydown.bind(this));
    this.domNode.childNodes[1].addEventListener("keyup", this.onKeyup.bind(this));
    this.domNode.childNodes[1].addEventListener("click", this.onClick.bind(this));
  }

  toggleCheckbox() {
    if (this.domNode.getAttribute("aria-checked") === "true") {
      this.domNode.setAttribute("aria-checked", "false");
    } else {
      this.domNode.setAttribute("aria-checked", "true");
    }
  }

  onKeydown(event) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  onKeyup(event) {
    var flag = false;

    switch (event.key) {
      case " ":
        this.toggleCheckbox();
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
    }
  }

  onClick(e) {
    e.stopPropagation()
    this.toggleCheckbox();
  }
}

function newCheckBox(text) {
  const newElement = document.createElement("div");
  newElement.setAttribute("role", "checkbox");
  newElement.innerHTML = `
    <p>${text}</p><div>
    <span
      ><svg
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
    ></span>
  </div>`;
  const checkbox = new Checkbox(newElement)
  const li = document.createElement("li");
  li.appendChild(checkbox.domNode);

  return li
}

function addNewElement() {
  const input = document.querySelector(".myInput");
  if (input.value.length === 0) {
    alert("Введите задачу");
    return;
  }
  const checkboxes = document.querySelector(".checkboxes");
  checkboxes.appendChild(newCheckBox(input.value));
  input.value = "";
}

document.addEventListener("DOMContentLoaded", (event) => {
  const checkboxes = document.querySelectorAll('.checkboxes [role="checkbox"]');
  console.log(checkboxes);
  for (let i = 0; i < checkboxes.length; i++) {
    new Checkbox(checkboxes[i]);
  }
  const addElemnt = document.querySelector(".addBtn");
  addElemnt.addEventListener("click", addNewElement);
});
