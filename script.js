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


        // Clear the current list (in case you want to refresh the tasks)
        taskList.innerHTML = '';

        // Create list items for each task
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.title;
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
            li.textContent = addedTask.title;
            taskList.appendChild(li);

            taskInput.value = ''; // Clear the input
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
});
