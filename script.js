const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

// Handle form submit (Add button or Enter key)
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page reload

  const text = input.value.trim();
  if (!text) return; // Ignore empty

  addTask(text);
  input.value = "";
  input.focus();
});

// Function to create and add a new task row
function addTask(text) {
  const li = document.createElement("li");
  li.className = "task";

  // Task text
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text;

  // Buttons container
  const actions = document.createElement("div");
  actions.className = "actions";

  // Done button
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.className = "btn-done";
  doneBtn.type = "button";
  doneBtn.addEventListener("click", function () {
    li.classList.toggle("completed");
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn-delete";
  deleteBtn.type = "button";
  deleteBtn.addEventListener("click", function () {
    list.removeChild(li);
  });

  actions.appendChild(doneBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  list.appendChild(li);
}
