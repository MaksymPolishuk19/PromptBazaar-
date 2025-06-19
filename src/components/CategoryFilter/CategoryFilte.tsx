import React from 'react';

interface Props {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const CategoryFilter: React.FC<Props> = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong>Filter by category:</strong>{' '}
      <button
        onClick={() => onSelect('')}
        style={{
          marginRight: 8,
          fontWeight: selectedCategory === '' ? 'bold' : 'normal'
        }}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            marginRight: 8,
            fontWeight: selectedCategory === cat ? 'bold' : 'normal'
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
