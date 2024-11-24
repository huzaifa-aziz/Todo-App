"use client"

import React, { useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TodoPage = () => {
  const [task, setTask] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [edittingTaskId, setEdittingTaskId] = useState<number | null>(null);
  const [edittingTaskText, setEdittingTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTask(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(task));
    }
  }, [task, isMounted]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      setTask([...task, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompleted = (id: number): void => {
    setTask(
      task.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEdittingTask = (id: number, text: string): void => {
    setEdittingTaskId(id);
    setEdittingTaskText(text);
  };

  const updateTask = (): void => {
    if (edittingTaskText.trim() !== "") {
      setTask(
        task.map((t) =>
          t.id === edittingTaskId ? { ...t, text: edittingTaskText } : t
        )
      );
      setEdittingTaskId(null);
      setEdittingTaskText("");
    }
  };

  const deleteTask = (id: number): void => {
    setTask(task.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Todo List
        </h1>
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTask(e.target.value)
            }
            className="flex-1 mr-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={addTask}
            className="bg-black hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-md"
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {task.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-md px-4 py-2"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={t.completed}
                  className="mr-2"
                  onCheckedChange={() => toggleTaskCompleted(t.id)}
                />
                {edittingTaskId === t.id ? (
                  <Input
                    type="text"
                    value={edittingTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEdittingTaskText(e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        updateTask();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                ) : (
                  <span
                    className={`flex-1 text-gray-800 dark:text-gray-200 ${
                      t.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : ""
                    }`}
                  >
                    {t.text}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {edittingTaskId === t.id ? (
                  <Button
                    onClick={updateTask}
                    className="bg-black hover:bg-slate-800 text-white font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => startEdittingTask(t.id, t.text)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteTask(t.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
