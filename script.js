const API_URL = 'http://localhost:8080/api/tasks'; // Replace with your backend URL

const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

getTasks();

async function getTasks() {
    
    try {
        // Make POST request to backend
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });



        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        const tasks = await response.json();

        console.log(tasks);
        


        // Clear the current list (in case you want to refresh the tasks)
        taskList.innerHTML = '';

        // Create list items for each task
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.title;
            li.setAttribute('task-id',task.id); 
            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(li.getAttribute('task-id'),li));
            li.append(deleteButton);

            taskList.appendChild(li);
        });

    } catch (error) {
        console.error('Error adding task:', error);
    }
}


addTaskButton.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        // Create task object
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

            console.log(response);

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const addedTask = await response.json();

            // Add task to the frontend list
            const li = document.createElement('li');
            li.setAttribute('task-id',addedTask.id);
            li.textContent = addedTask.title;
            
            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(li.getAttribute('task-id'),li));
            li.append(deleteButton);

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
        li.remove();
    }

    catch (error) {
        console.error('Error deleting  task:', error);
    }
}
