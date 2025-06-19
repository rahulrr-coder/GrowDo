
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Calendar, AlertTriangle, Flag, Circle, Zap, Briefcase, User, Heart, GraduationCap, DollarSign, Home, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Priority, Category, Task } from './TodoApp';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
}

const priorityConfig = {
  low: {
    icon: Circle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300'
  },
  medium: {
    icon: Flag,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300'
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300'
  },
  urgent: {
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300'
  }
};

const categoryConfig = {
  personal: { icon: User, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  work: { icon: Briefcase, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  health: { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100' },
  learning: { icon: GraduationCap, color: 'text-green-600', bgColor: 'bg-green-100' },
  finance: { icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  home: { icon: Home, color: 'text-amber-600', bgColor: 'bg-amber-100' }
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, index }) => {
  const priorityStyle = priorityConfig[task.priority];
  const categoryStyle = categoryConfig[task.category];
  const PriorityIcon = priorityStyle.icon;
  const CategoryIcon = categoryStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      layout
      className={`bg-earth-cream rounded-xl p-4 shadow-md border group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${
        task.completed 
          ? 'opacity-75 border-green-300 bg-green-50/80' 
          : `border-amber-200 hover:border-amber-300 hover:bg-amber-50/30 ${priorityStyle.borderColor.replace('border-', 'border-l-4 border-l-')}`
      }`}
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
            task.completed
              ? 'bg-earth-sage border-earth-sage text-white shadow-lg shadow-green-200'
              : 'border-amber-400 hover:border-amber-500 hover:bg-amber-100'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-3 h-3" />
            </motion.div>
          )}
        </motion.button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            {/* Priority Indicator */}
            {!task.completed && (
              <div className={`p-1 rounded-full ${priorityStyle.bgColor} flex-shrink-0`}>
                <PriorityIcon className={`w-3 h-3 ${priorityStyle.color}`} />
              </div>
            )}
            
            {/* Category Indicator */}
            <div className={`p-1 rounded-full ${categoryStyle.bgColor} flex-shrink-0`}>
              <CategoryIcon className={`w-3 h-3 ${categoryStyle.color}`} />
            </div>
            
            <span
              className={`block transition-all duration-300 break-words ${
                task.completed
                  ? 'line-through text-amber-600'
                  : 'text-amber-900 font-medium'
              }`}
            >
              {task.text}
            </span>
          </div>
          
          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    task.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              task.completed ? 'text-amber-500' : 'text-amber-700'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>Due: {format(task.dueDate, 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
