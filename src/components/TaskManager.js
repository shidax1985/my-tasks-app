import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listTasks } from './graphql/queries';
import { createTask, deleteTask, updateTask } from './graphql/mutations';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // タスク一覧の取得
  const fetchTasks = async () => {
    try {
      const taskData = await API.graphql(graphqlOperation(listTasks));
      setTasks(taskData.data.listTasks.items);
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  };

  // タスクの作成
  const addTask = async () => {
    try {
      await API.graphql(graphqlOperation(createTask, { input: newTask }));
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (error) {
      console.log('Error adding task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Manager</h1>
      <input
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <textarea
        placeholder="Task Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;