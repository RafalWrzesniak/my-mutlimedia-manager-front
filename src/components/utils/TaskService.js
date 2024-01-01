import { useState } from 'react';

const TaskService = () => {
  const [currentTask, setCurrentTask] = useState('');
  const [loading, setLoading] = useState(false);

  const setTask = (task, loading = false) => {
    setCurrentTask(task);
    setLoading(loading);
  };

  const getTask = () => {
    return currentTask;
  };

  const getLoading = () => {
    return loading;
  };

  const clearTask = () => {
    setCurrentTask('');
    setLoading(false);
  };

  return {
    setTask,
    getTask,
    getLoading,
    clearTask
  };
};

export default TaskService;
