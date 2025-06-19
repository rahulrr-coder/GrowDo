import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sprout, Target, BarChart3, Github, Heart, AlertTriangle, Briefcase, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskItem from './TaskItem';
import DatePicker from './DatePicker';
import PrioritySelector from './PrioritySelector';
import CategorySelector from './CategorySelector';
import TagInput from './TagInput';
import TaskStats from './TaskStats';
import CompletedTasksSection from './CompletedTasksSection';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Category = 'personal' | 'work' | 'health' | 'learning' | 'finance' | 'home';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: Priority;
  category: Category;
  tags: string[];
  completedAt?: Date;
}

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [selectedCategory, setSelectedCategory] = useState<Category>('personal');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const completedTasksRef = useRef<HTMLDivElement>(null);

  const addTask = () => {
    if (inputValue.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
        dueDate: selectedDueDate,
        priority: selectedPriority,
        category: selectedCategory,
        tags: selectedTags,
      };
      setTasks([newTask, ...tasks]);
      setInputValue('');
      setSelectedDueDate(undefined);
      setSelectedPriority('medium');
      setSelectedCategory('personal');
      setSelectedTags([]);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed && !task.completed) {
          updatedTask.completedAt = new Date();
        } else if (!updatedTask.completed && task.completed) {
          delete updatedTask.completedAt;
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleHarvestedClick = () => {
    if (completedTasks.length > 0) {
      setCompletedExpanded(true);
      setTimeout(() => {
        completedTasksRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start' 
        });
      }, 100);
    }
  };

  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Sort incomplete tasks: by priority first, then by due date, then by creation date
  const priorityOrder: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
  const sortedIncompleteTasks = [...incompleteTasks].sort((a, b) => {
    // First sort by priority (urgent first)
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by due date (with due dates first)
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    
    // Finally by creation date (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const totalCount = tasks.length;
  const completedCount = completedTasks.length;

  return (
    <div className="min-h-screen bg-earth-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="text-center mb-8 pt-8"
        >
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            {/* Logo with Icon */}
            <motion.div 
              className="relative flex flex-col items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-3xl shadow-lg border-4 border-white/30 backdrop-blur-sm">
                  <Sprout className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md border-2 border-white"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              {/* GrowDo Text */}
              <motion.h1 
                className="text-6xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 bg-clip-text text-transparent drop-shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                GrowDo
              </motion.h1>
              
              {/* Centered Dots Below Logo */}
              <motion.div 
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full shadow-sm ${
                      i === 0 ? 'bg-emerald-600' : i === 1 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          <motion.p 
            className="text-amber-800 text-lg font-medium max-w-md mx-auto mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Cultivate productivity, harvest success. Watch your tasks bloom into achievements.
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.div 
              className="bg-earth-cream/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-amber-200"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-sm text-amber-700">
                <span className="font-semibold text-amber-800">{incompleteTasks.length}</span> growing
              </span>
            </motion.div>
            
            <motion.button
              onClick={handleHarvestedClick}
              className="bg-earth-cream/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-amber-200 hover:bg-amber-100 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span className="text-sm text-amber-700">
                <span className="font-semibold text-earth-sage">{completedCount}</span> harvested
              </span>
            </motion.button>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowStats(!showStats)}
                variant="ghost"
                className="bg-earth-cream/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-amber-200 hover:bg-amber-100 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Stats
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <AnimatePresence>
          {showStats && totalCount > 0 && (
            <TaskStats tasks={tasks} />
          )}
        </AnimatePresence>

        {/* Add Task Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-earth-cream/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-200/50 mb-8"
        >
          <div className="space-y-6">
            <div className="flex gap-3">
              <motion.div 
                className="flex-1"
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  type="text"
                  placeholder="Plant a new task to grow..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-amber-200 rounded-xl px-4 py-3 text-amber-900 placeholder-amber-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-white/80 shadow-sm h-12"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={addTask}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-emerald-300/50 backdrop-blur-sm h-12 relative overflow-hidden group font-semibold"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 600, damping: 15 }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-6 h-6 drop-shadow-md font-bold stroke-[3.5]" />
                    <span className="font-bold text-sm tracking-wide">Plant Task</span>
                  </motion.div>
                  {/* Enhanced ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-xl opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              className="space-y-6 pt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {/* First Row: Harvest Date and Priority Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                {/* Date Picker */}
                <motion.div 
                  className="space-y-4 p-4 bg-gradient-to-br from-emerald-50/80 to-green-50/80 rounded-xl border border-emerald-200/50 shadow-sm hover:shadow-lg transition-shadow duration-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-amber-800">Harvest Date</span>
                  </div>
                  <div className="space-y-2">
                    <DatePicker
                      date={selectedDueDate}
                      onSelect={setSelectedDueDate}
                      placeholder="Set harvest date (optional)"
                    />
                    {selectedDueDate && (
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedDueDate(undefined)}
                        className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 text-sm w-full"
                        size="sm"
                      >
                        Clear Date
                      </Button>
                    )}
                  </div>
                </motion.div>
                  
                {/* Priority Selector */}
                <motion.div 
                  className="space-y-4 p-4 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 rounded-xl border border-amber-200/50 shadow-sm hover:shadow-lg transition-shadow duration-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-amber-800">Priority Level</span>
                  </div>
                  <PrioritySelector
                    priority={selectedPriority}
                    onSelect={setSelectedPriority}
                  />
                </motion.div>
              </div>

              {/* Second Row: Category and Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                {/* Category Selector */}
                <motion.div 
                  className="space-y-4 p-4 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-xl border border-indigo-200/50 shadow-sm hover:shadow-lg transition-shadow duration-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-amber-800">Category</span>
                  </div>
                  <CategorySelector
                    category={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </motion.div>
                  
                {/* Tag Input */}
                <motion.div 
                  className="space-y-4 p-4 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 rounded-xl border border-purple-200/50 shadow-sm hover:shadow-lg transition-shadow duration-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Tag className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-amber-800">Tags</span>
                  </div>
                  <TagInput
                    tags={selectedTags}
                    onTagsChange={setSelectedTags}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Active Tasks Section */}
        <div className="space-y-3 mb-6">
          <AnimatePresence mode="popLayout">
            {sortedIncompleteTasks.length === 0 && completedTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 bg-earth-cream/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-md"
              >
                <motion.div 
                  className="text-8xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌱
                </motion.div>
                <h3 className="text-2xl font-bold text-amber-800 mb-3">Ready to start growing?</h3>
                <p className="text-amber-700 max-w-md mx-auto text-lg">
                  Plant your first task above and watch your productivity garden flourish. Every accomplished goal begins with a single seed.
                </p>
              </motion.div>
            ) : sortedIncompleteTasks.length === 0 && completedTasks.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-md"
              >
                <motion.div 
                  className="text-8xl mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌾
                </motion.div>
                <h3 className="text-2xl font-bold text-earth-sage mb-3">Beautiful harvest!</h3>
                <p className="text-green-700 max-w-md mx-auto text-lg">
                  Excellent work! Your productivity garden is thriving. Ready to plant new seeds of achievement?
                </p>
              </motion.div>
            ) : (
              sortedIncompleteTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  index={index}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Completed Tasks Section with Ref */}
        <div ref={completedTasksRef}>
          <CompletedTasksSection
            completedTasks={completedTasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            isExpanded={completedExpanded}
            onToggleExpanded={() => setCompletedExpanded(!completedExpanded)}
          />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pb-8"
        >
          {totalCount > 0 && (
            <motion.div 
              className="text-center mb-8 text-amber-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-2 text-lg">
                <span>Keep growing, keep achieving!</span>
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌻
                </motion.span>
              </div>
            </motion.div>
          )}
          
          {/* Enhanced Footer with Clear Separation */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {/* Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent mb-8"></div>
            <div className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 w-8 h-2 bg-amber-300 rounded-full shadow-sm"></div>
            
            {/* Footer Content */}
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-amber-200/30">
              <div className="text-center space-y-6">
                <motion.div 
                  className="flex items-center justify-center gap-3 mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl shadow-md border-2 border-white/20">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                    GrowDo
                  </span>
                </motion.div>
                
                <p className="text-amber-700 text-sm max-w-md mx-auto leading-relaxed">
                  Cultivating productivity, one task at a time. Transform your goals into achievements with our intuitive task management system.
                </p>
                
                <motion.div 
                  className="flex items-center justify-center gap-2 text-sm text-amber-600"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span>Built with</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </motion.div>
                  <span>by</span>
                  <motion.a 
                    href="https://github.com/rahulrr-coder" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline px-2 py-1 rounded-lg hover:bg-emerald-50/50"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Github className="w-4 h-4" />
                    rahulrr-coder
                  </motion.a>
                </motion.div>
                
                <div className="text-xs text-amber-500 border-t border-amber-200/50 pt-4 mt-6">
                  © 2025 GrowDo. All rights reserved.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TodoApp;
