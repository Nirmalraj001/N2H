import { Category } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface FilterPanelProps {
  categories: Category[];
  selectedCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  onCategoryChange: (categoryId?: string) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onClear: () => void;
}

export const FilterPanel = ({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onClear,
}: FilterPanelProps) => {
  const hasFilters = selectedCategory || minPrice !== undefined || maxPrice !== undefined;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange(undefined)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                !selectedCategory
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories
              .filter(cat => !cat.parentCategory)
              .map(category => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice || ''}
                onChange={e => onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Max Price</label>
              <input
                type="number"
                placeholder="10000"
                value={maxPrice || ''}
                onChange={e => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
