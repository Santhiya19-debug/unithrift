import React from 'react';

/**
 * Category Card component
 * Used for category browsing section
 */
const CategoryCard = ({ category, onClick, bgColor = 'bg-sage-muted' }) => {
  const { name, icon } = category;

  return (
    <button
      onClick={onClick}
      className={`category-card ${bgColor} w-full`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-medium text-text-primary">{name}</h3>
    </button>
  );
};

export default CategoryCard;