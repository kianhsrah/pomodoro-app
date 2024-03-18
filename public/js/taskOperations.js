document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    const fetchTasks = () => {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `${task.description}
                        <span>
                            <button class="btn btn-success btn-sm" onclick="toggleComplete('${task._id}', ${task.isCompleted})">${task.isCompleted ? 'Undo complete' : 'Mark as complete'}</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteTask('${task._id}')">Delete</button>
                        </span>`;
                    taskList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching tasks:', error.message, error.stack);
                alert('Error fetching tasks. Please check the console for more details.');
            });
    };

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const description = formData.get('description');
        fetch('/tasks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ description })
        }).then(() => {
            taskForm.reset();
            fetchTasks();
        }).catch(error => {
            console.error('Error adding task:', error.message, error.stack);
            alert('Error adding task. Please check the console for more details.');
        });
    });

    window.deleteTask = (id) => {
        fetch(`/tasks/${id}`, { method: 'DELETE' })
            .then(() => fetchTasks())
            .catch(error => {
                console.error('Error deleting task:', error.message, error.stack);
                alert('Error deleting task. Please check the console for more details.');
            });
    };

    window.toggleComplete = (id, isCompleted) => {
        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ isCompleted: !isCompleted })
        }).then(() => fetchTasks())
          .catch(error => {
              console.error('Error updating task:', error.message, error.stack);
              alert('Error updating task status. Please check the console for more details.');
          });
    };

    fetchTasks(); 
});