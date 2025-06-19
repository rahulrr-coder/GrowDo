
import React from 'react';
import { Briefcase, UserCircle, Heart, GraduationCap, DollarSign, Home, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category } from './TodoApp';

interface CategorySelectorProps {
  category: Category;
  onSelect: (category: Category) => void;
}

const categoryConfig = {
  personal: {
    label: 'Personal',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  work: {
    label: 'Work',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  health: {
    label: 'Health',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  learning: {
    label: 'Learning',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  finance: {
    label: 'Finance',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  home: {
    label: 'Home',
    icon: Home,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  }
};

const CategorySelector: React.FC<CategorySelectorProps> = ({ category, onSelect }) => {
  const currentConfig = categoryConfig[category];
  const IconComponent = currentConfig.icon;

  return (
    <Select value={category} onValueChange={(value: Category) => onSelect(value)}>
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
        {Object.entries(categoryConfig).map(([key, config]) => {
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

export default CategorySelector;
