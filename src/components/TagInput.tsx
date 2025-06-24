
import React, { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmedValue = inputValue.trim().toLowerCase();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add tags..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-900 placeholder-amber-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200 bg-white/80 h-12"
        />
        <Button
          onClick={addTag}
          disabled={!inputValue.trim()}
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 px-4 h-12 rounded-lg"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-medium"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
