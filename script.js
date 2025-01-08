const API_URL = 'http://localhost:8080/api/tasks'; // Replace with your backend URL

const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

getTasks();

async function getTasks() {
    try {
        // Make GET request to backend
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        const tasks = await response.json();

        console.log(tasks);

        // Clear the current list
        taskList.innerHTML = '';

        // Create list items for each task
        tasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

addTaskButton.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const newTask = { title: taskText, completed: false };

        try {
            // Make POST request to backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const addedTask = await response.json();

            // Add task to the frontend list
            const li = createTaskElement(addedTask);
            taskList.appendChild(li);

            taskInput.value = ''; // Clear the input
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
});

async function deleteTask(taskId, li) {
    try {
        // Make DELETE request to backend
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        li.remove(); // Remove task from the frontend list
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function editTask(taskId, li) {
    const currentTitle = li.firstChild.textContent.trim();
    const updatedTitle = prompt("Edit Task Title:", currentTitle);

    if (updatedTitle === null || updatedTitle.trim() === "") {
        return; // Do nothing if user cancels or enters an empty string
    }

    try {
        const updatedTask = { title: updatedTitle.trim(), completed: false };

        // Make PUT request to backend
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        li.firstChild.textContent = updatedTitle.trim(); // Update the task title in the frontend
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

function toggleTaskCompletion(checkbox, taskId, li) {
    const isCompleted = checkbox.checked;

    // Update the task title style
    li.querySelector('.task-title').style.textDecoration = isCompleted ? 'line-through' : 'none';

    // Optionally send an update to the backend for completion state
    const updatedTask = { title: li.querySelector('.task-title').textContent.trim(), completed: isCompleted };
    fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    }).catch(error => console.error('Error updating task completion:', error));
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.setAttribute('task-id', task.id);

     // Checkbox for task completion
     const checkbox = document.createElement('input');
     checkbox.type = 'checkbox';
     checkbox.checked = task.completed;
     checkbox.addEventListener('change', () => toggleTaskCompletion(checkbox, task.id, li));
     li.appendChild(checkbox);

    // Task title
    const span = document.createElement('span');
    span.textContent = task.title;
    span.className = 'task-title';
    span.style.textDecoration = task.completed ? 'line-through' : 'none';
    li.appendChild(span);

    // Edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = '✏️'; // Pencil emoji
    editButton.addEventListener('click', () => editTask(task.id, li));
    li.append(editButton);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '🗑️'; // Trash can emoji
    deleteButton.addEventListener('click', () => deleteTask(task.id, li));
    li.append(deleteButton);

    

    return li;
}
