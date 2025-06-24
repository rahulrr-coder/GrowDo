
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { format, subDays, isAfter, isBefore, startOfDay } from 'date-fns';
import type { Task, Priority, Category } from './TodoApp';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  // Priority distribution
  const priorityData = ['urgent', 'high', 'medium', 'low'].map(priority => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    completed: completedTasks.filter(task => task.priority === priority).length,
    incomplete: incompleteTasks.filter(task => task.priority === priority).length,
  }));

  // Category distribution
  const categoryData = ['work', 'personal', 'health', 'learning', 'finance', 'home'].map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: tasks.filter(task => task.category === category).length,
  })).filter(item => item.value > 0);

  // Completion rate over the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    
    const completedOnDay = completedTasks.filter(task => 
      task.completedAt && 
      isAfter(task.completedAt, dayStart) && 
      isBefore(task.completedAt, dayEnd)
    ).length;
    
    return {
      date: format(date, 'MMM dd'),
      completed: completedOnDay,
    };
  });

  // Statistics
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const overdueTasksCount = incompleteTasks.filter(task => 
    task.dueDate && isBefore(task.dueDate, new Date())
  ).length;
  const todayCompleted = completedTasks.filter(task => 
    task.completedAt && 
    isAfter(task.completedAt, startOfDay(new Date()))
  ).length;

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 bg-earth-cream/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-earth-sage" />
        <h2 className="text-2xl font-bold text-amber-800">Productivity Analytics</h2>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-earth-sage" />
            <span className="text-sm text-amber-700">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold text-earth-sage">{completionRate}%</div>
        </div>
        
        <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-amber-700">Today Completed</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{todayCompleted}</div>
        </div>
        
        <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-sm text-amber-700">Total Tasks</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{totalTasks}</div>
        </div>
        
        <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <span className="text-sm text-amber-700">Overdue</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{overdueTasksCount}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="Completed" />
              <Bar dataKey="incomplete" fill="#F59E0B" name="Incomplete" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Trend (Last 7 Days) */}
        <div className="bg-white/80 rounded-xl p-4 border border-amber-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Completion Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskStats;
