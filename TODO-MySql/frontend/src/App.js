import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // States for the current task input and the list of tasks
  const [task, setTask] = useState('');
  const [tasksList, setTasksList] = useState([]);

  // Function to fetch tasks from a server
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasksList(data);
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to submit the form and add a new task
  const submitForm = async (e) => {
    e.preventDefault();

    // Checks if the task input is empty and alert 
    if (task.trim() === '') {
      alert('Task cannot be empty');
      return; //
    }

    try {
      const body = { name: task };
      setTask(''); // Clear the input field after submitting

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log("Task added successfully!");
        fetchTasks(); // Refresh the task list after adding a new task
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  //Function to delete the task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Task deleted successfully!");
        fetchTasks(); // Refresh the task list after deleting a task
      } else {
        console.error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="App">
        <form onSubmit={submitForm}>
          {/* Heading for the To-Do List App */}
          <p className='heading'>To Do List App</p>
          <div className="input-group ">
            <div className="input-group-prepend">
              <span className="input-group-text label  ml-10">Enter the task:</span>
            </div>
            <input type="text" className='form-control input-field' id="todoInput" placeholder="Get groceries..." value={task} onChange={(e) => setTask(e.target.value)} />
            <button type="submit" className="btn Add-btn btn-success ">Add task</button>
          </div>
        </form>
        <div className='showItems d-flex flex-column'>
          {/* Map over the tasksList to display each task */}
          {tasksList.map((task) => (
            <div className='eachItem' key={task.id}>
              <div className='task-container '>
                {/* Display each task's description */}
                <p className='description d-flex justify-content-between'>{task.name}
                  {/* Button to delete task */}
                  <button className='delete-button' onClick={() => deleteTask(task.id)}>X</button></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default App;
