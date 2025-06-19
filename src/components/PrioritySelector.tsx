
import React from 'react';
import { AlertTriangle, ArrowUp, Minus, Zap, Flag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Priority } from './TodoApp';

interface PrioritySelectorProps {
  priority: Priority;
  onSelect: (priority: Priority) => void;
}

const priorityConfig = {
  low: {
    label: 'Low',
    icon: Minus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  medium: {
    label: 'Medium',
    icon: Flag,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  high: {
    label: 'High',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  urgent: {
    label: 'Urgent',
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
};

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ priority, onSelect }) => {
  const currentConfig = priorityConfig[priority];
  const IconComponent = currentConfig.icon;

  return (
    <Select value={priority} onValueChange={(value: Priority) => onSelect(value)}>
      <SelectTrigger className="w-full border-amber-200 hover:border-amber-300 hover:bg-amber-50 bg-white/80 transition-all duration-200 h-12 px-4">
        <SelectValue>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${currentConfig.bgColor}`}>
              <IconComponent className={`w-3.5 h-3.5 ${currentConfig.color}`} />
            </div>
            <span className="text-sm font-medium text-amber-800">{currentConfig.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border-amber-200 shadow-lg z-50">
        {Object.entries(priorityConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <SelectItem 
              key={key} 
              value={key} 
              className="hover:bg-amber-50 focus:bg-amber-50 data-[highlighted]:bg-amber-50 cursor-pointer py-3 px-4 relative"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-1.5 rounded-full ${config.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <span className="text-sm font-medium text-amber-800">{config.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default PrioritySelector;
