
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import TaskItem from './TaskItem';
import type { Task } from './TodoApp';

interface CompletedTasksSectionProps {
  completedTasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const CompletedTasksSection: React.FC<CompletedTasksSectionProps> = ({
  completedTasks,
  onToggleTask,
  onDeleteTask,
  isExpanded,
  onToggleExpanded,
}) => {
  if (completedTasks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <motion.button
        onClick={onToggleExpanded}
        className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-150 hover:to-emerald-150 rounded-xl border border-green-200 transition-all duration-200 group shadow-md"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2 flex-1">
          <CheckCircle2 className="w-5 h-5 text-earth-sage" />
          <span className="font-medium text-green-800">
            Harvested Tasks ({completedTasks.length})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-earth-sage" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {completedTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompletedTasksSection;
