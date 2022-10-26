// Import themeSwitcher
import ThemeSwitcher from "./themeSwitcher.js";

new ThemeSwitcher("theme-switcher", [
	{
		name: "light",
		label: "Light Theme",
		icon: "icons/sun.svg",
	},
	{
		name: "dark",
		label: "Dark Theme",
		icon: "icons/moon.svg",
	},
]);

// Simple todo app
let todos = [];
if (localStorage.getItem("todos")) {
	todos = JSON.parse(localStorage.getItem("todos"));
	updateList();
}

// Dom elements
const showHideFormBtn = document.querySelector("#show-hide-form");
const createForm = document.querySelector("#create-form");
const editForm = document.querySelector("#edit-form");

// Event listeners
showHideFormBtn.addEventListener("click", () => {
	if (!createForm.classList.contains("hidden")) {
		showHideCreateForm();
	} else if (!editForm.classList.contains("hidden")) {
		showHideEditForm();
	} else {
		showHideCreateForm();
	}
});
createForm.addEventListener("submit", createTodo);
editForm.addEventListener("submit", editTodo);

// Functions
function showHideCreateForm() {
	createForm.classList.toggle("hidden");
	if (createForm.classList.contains("hidden")) {
		showHideFormBtn.textContent = "Create new todo";
	} else {
		showHideFormBtn.textContent = "Cancel";
	}
}

function showHideEditForm(i) {
	if (editForm.classList.contains("hidden")) {
		editForm.classList.remove("hidden");
		editForm.task.value = todos[i].text;
		editForm.dataset.index = i;
	} else {
		editForm.classList.add("hidden");
	}

	if (editForm.classList.contains("hidden")) {
		showHideFormBtn.textContent = "Create new todo";
	} else {
		showHideFormBtn.textContent = "Cancel";
	}
}

function createTodo(e) {
	e.preventDefault();
	const todo = {
		text: createForm.task.value,
		done: false,
	};
	todos.push(todo);
	createForm.reset();
	updateList();
	localStorage.setItem("todos", JSON.stringify(todos));

	showHideCreateForm();
}

function markTodoAsDone(index) {
	if (todos[index].done) {
		todos[index].done = false;
	} else {
		todos[index].done = true;
	}
	updateList();
	localStorage.setItem("todos", JSON.stringify(todos));
}

function removeTodo(index) {
	todos.splice(index, 1);
	updateList();
	localStorage.setItem("todos", JSON.stringify(todos));
}

function editTodo(e) {
	e.preventDefault();
	const index = e.target.dataset.index;
	todos[index].text = e.target.task.value;
	editForm.reset();
	updateList();
	localStorage.setItem("todos", JSON.stringify(todos));

	showHideEditForm();
}

function updateList() {
	const list = document.querySelector("#tasks");
	list.innerHTML = "";
	todos.forEach((todo, i) => {
		const li = document.createElement("li");
		const text = document.createElement("p");
		const done = document.createElement("button");
		const edit = document.createElement("button");
		const remove = document.createElement("button");
		li.dataset.index = i;
		if (todo.done) {
			li.classList.add("done");
		}
		text.innerHTML = todo.text;
		done.textContent = "Done";
		edit.textContent = "Edit";
		remove.textContent = "Remove";
		done.addEventListener("click", () => {
			markTodoAsDone(i);
			updateList();
		});
		edit.addEventListener("click", () => {
			showHideEditForm(i);
		});
		remove.addEventListener("click", () => {
			removeTodo(i);
			updateList();
		});
		li.appendChild(text);
		li.appendChild(done);
		li.appendChild(edit);
		li.appendChild(remove);
		list.appendChild(li);
	});
}

// Download local storage
const downloadBtn = document.querySelector("#download");
downloadBtn.addEventListener("click", () => {
	const data = JSON.stringify(todos);
	const blob = new Blob([data], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.download = "todos.json";
	a.href = url;
	a.click();
});

// Upload local storage
const upload = document.querySelector("#upload");
upload.addEventListener("change", (e) => {
	const file = e.target.files[0];
	const reader = new FileReader();
	reader.onload = (e) => {
		const result = e.target.result;
		todos = JSON.parse(result);
		updateList();
		localStorage.setItem("todos", JSON.stringify(todos));
	};
	reader.readAsText(file);

	upload.value = "";
	updateList();
});
