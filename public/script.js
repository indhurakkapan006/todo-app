// Fetch and display tasks
function fetchTasks() {
  fetch('/api/tasks')
    .then(res => res.json())
    .then(tasks => {
      const list = document.getElementById('taskList');
      list.innerHTML = '';

      tasks.forEach(task => {
        const isChecked = task.completed ? 'checked' : '';
        const textClass = task.completed ? 'completed' : '';

        list.innerHTML += `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid #ccc;padding:10px;">
            <div>
              <input type="checkbox" ${isChecked} onchange="toggleTask(${task.id}, this.checked)">
              <span class="${textClass}" style="margin-left:10px;">${task.text}</span>
            </div>
            <button onclick="deleteTask(${task.id})" 
                    style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;border-radius:5px;">
              DELETE
            </button>
          </div>
        `;
      });
    })
    .catch(err => console.error('Error fetching tasks:', err));
}

// Add a new task
function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  if (!text) return; // prevent empty tasks

  fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
    .then(() => {
      document.getElementById('taskInput').value = '';
      fetchTasks();
    })
    .catch(err => console.error('Error adding task:', err));
}

// Toggle task completion
function toggleTask(id, completed) {
  fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  })
    .then(() => fetchTasks())
    .catch(err => console.error('Error updating task:', err));
}

// Delete a task
function deleteTask(id) {
  fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    .then(() => fetchTasks())
    .catch(err => console.error('Error deleting task:', err));
}

// Load tasks on page load
window.onload = fetchTasks;