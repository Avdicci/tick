import React from 'react';
import type { Task } from '../types';
import { TickBar } from './TickBar';

type TaskCardProps = {
  task: Task;
  onChangeCount: (delta: number) => void;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onChangeCount }) => {
  const handleMinus = () => onChangeCount(-1);
  const handlePlus = () => onChangeCount(1);

  return (
    <div className="task-card">
      <div className="task-card__inner">
        <header className="task-card__header">
          <div className="task-card__title-row">
            <h3 className="task-card__title">{task.name}</h3>
            <span className="task-card__count">{task.count}</span>
          </div>
          <div className="task-card__divider" />
          {task.description ? (
            <p className="task-card__description">{task.description}</p>
          ) : (
            <p className="task-card__description task-card__description--muted">
              No description
            </p>
          )}
        </header>

        <div className="task-card__body">
          <button
            type="button"
            className="task-card__btn task-card__btn--minus"
            onClick={handleMinus}
          >
            -1
          </button>

          <div className="task-card__ticks-wrapper">
            <TickBar count={task.count} />
          </div>

          <button
            type="button"
            className="task-card__btn task-card__btn--plus"
            onClick={handlePlus}
          >
            +1
          </button>
        </div>
      </div>
    </div>
  );
};


