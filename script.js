const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const prioritySelect = document.getElementById('task-priority');
const addBtn = document.getElementById('add-task-btn');
const list = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');
const draggedIndex = Number(e.dataTransfer.getData('text'));
const targetIndex = index;

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    if (filter !== 'all' && task.completed.toString() !== (filter === 'completed').toString()) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${task.title}</strong> - ${task.desc} (${task.priority})
      </div>
      <div>
        <button class="complete-btn">${task.completed ? 'Undo' : 'Done'}</button>
        <button class="delete-btn">X</button>
      </div>
    `;
    // Complete task
    li.querySelector('.complete-btn').addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(filter);
    });
    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(filter);
    });
    li.setAttribute('data-priority', task.priority);

    li.draggable = true;

li.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', index);
});

li.addEventListener('dragover', (e) => e.preventDefault());

li.addEventListener('drop', (e) => {
  const draggedIndex = e.dataTransfer.getData('text');
  const targetIndex = index;

  // Swap tasks
  [tasks[draggedIndex], tasks[targetIndex]] = [tasks[targetIndex], tasks[draggedIndex]];
  saveTasks();
  renderTasks(filter);
});

    if (task.completed) li.classList.add('completed');
    list.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const priority = prioritySelect.value;

  if (!title) return;

  tasks.push({ title, desc, priority, completed: false });
  saveTasks();
  renderTasks();
  titleInput.value = '';
  descInput.value = '';
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => renderTasks(btn.dataset.filter));
});

// Initial render
renderTasks();