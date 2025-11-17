import React, { useEffect, useMemo, useState } from 'react';
import type { Task } from './types';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';

const STORAGE_KEY = 'grindticks_tasks_v1';

type StoredPayload = {
  date: string;
  tasks: Task[];
};

const todayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const loadInitialTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredPayload;
    if (!parsed || !Array.isArray(parsed.tasks)) return [];
    if (parsed.date !== todayKey()) {
      // New day: keep tasks, reset counts.
      return parsed.tasks.map((t) => ({ ...t, count: 0 }));
    }
    return parsed.tasks;
  } catch {
    return [];
  }
};

const persistTasks = (tasks: Task[]) => {
  if (typeof window === 'undefined') return;
  const payload: StoredPayload = {
    date: todayKey(),
    tasks
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadInitialTasks());
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    persistTasks(tasks);
  }, [tasks]);

  // Midnight reset: schedule a timeout until next local midnight.
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
      setTasks((prev) => prev.map((t) => ({ ...t, count: 0 })));
    }, msUntilMidnight);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleAddTask = (name: string, description: string) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        description: description || undefined,
        count: 0
      }
    ]);
  };

  const handleChangeCount = (id: string, delta: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              count: Math.max(0, task.count + delta)
            }
          : task
      )
    );
  };

  const handleClearAll = () => {
    if (tasks.length === 0) {
      return;
    }
    const confirmed = window.confirm(
      'This will remove all tasks for today. Continue?'
    );
    if (!confirmed) {
      return;
    }
    setTasks([]);
  };

  const totalTicks = useMemo(
    () => tasks.reduce((sum, t) => sum + t.count, 0),
    [tasks]
  );

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__title-block">
          <h1 className="app__title">Tick</h1>
          <p className="app__subtitle">Daily micro-grind tracker</p>
        </div>
        <div className="app__toolbar">
          <div className="app__summary">
            <span className="app__summary-label">Total ticks</span>
            <span className="app__summary-value">{totalTicks}</span>
          </div>
          <button
            type="button"
            className="toolbar-button"
            onClick={handleClearAll}
            disabled={tasks.length === 0}
          >
            Clear all
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setIsAddOpen(true)}
            aria-label="Add task"
          >
            <span className="icon-button__plus">+</span>
          </button>
        </div>
      </header>

      <main className="app__main">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__title">No micro-grinds yet.</p>
            <p className="empty-state__hint">
              Tap the <span className="empty-state__plus">+</span> to add your
              first task.
            </p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onChangeCount={(delta) => handleChangeCount(task.id, delta)}
              />
            ))}
          </div>
        )}
      </main>

      <AddTaskModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};


