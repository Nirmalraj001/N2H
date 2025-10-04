import { Category } from '../../types';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FilterPanelProps {
  categories: Category[];
  selectedCategories?: string[];
  minPrice?: number;
  maxPrice?: number;
  onCategoryChange: (categoryIds: string[]) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onClear: () => void;
}

export const FilterPanel = ({
  categories,
  selectedCategories = [],
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onClear,
}: FilterPanelProps) => {
  const [priceMin, setPriceMin] = useState<number>(minPrice || 0);
  const [priceMax, setPriceMax] = useState<number>(maxPrice || 10000);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPriceMin(minPrice || 0);
    setPriceMax(maxPrice || 10000);
  }, [minPrice, maxPrice]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const handlePriceSliderChange = (value: number, isMin: boolean) => {
    if (isMin) {
      const newMin = Math.min(value, priceMax - 100);
      setPriceMin(newMin);
      if (!isDragging) {
        onPriceChange(newMin, priceMax);
      }
    } else {
      const newMax = Math.max(value, priceMin + 100);
      setPriceMax(newMax);
      if (!isDragging) {
        onPriceChange(priceMin, newMax);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onPriceChange(priceMin, priceMax);
  };

  const hasFilters = selectedCategories.length > 0 || minPrice !== undefined || maxPrice !== undefined;

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
            {categories
              .filter(cat => !cat.parentCategory)
              .map(category => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}>
                      {category.name}
                    </span>
                  </label>
                );
              })}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">₹{priceMin}</span>
              <span className="text-gray-500">-</span>
              <span className="font-medium text-gray-700">₹{priceMax}</span>
            </div>

            <div className="relative pt-2 pb-6">
              <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
              <div
                className="absolute h-2 bg-blue-600 rounded-full"
                style={{
                  left: `${(priceMin / 10000) * 100}%`,
                  right: `${100 - (priceMax / 10000) * 100}%`
                }}
              ></div>

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceMin}
                onChange={e => handlePriceSliderChange(Number(e.target.value), true)}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />

              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceMax}
                onChange={e => handlePriceSliderChange(Number(e.target.value), false)}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Min</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val < priceMax) {
                      setPriceMin(val);
                      onPriceChange(val, priceMax);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Max</label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (val > priceMin && val <= 10000) {
                      setPriceMax(val);
                      onPriceChange(priceMin, val);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
