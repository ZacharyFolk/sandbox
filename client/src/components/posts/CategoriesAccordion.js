import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

export const CategoriesAccordion = ({ categories }) => {
  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth <= 768
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="categories-container">
      <h2>Categories</h2>
      <hr />
      {isMediumScreen ? (
        <div className="accordion">
          <div className="accordion-summary">
            <button className="expand-btn">Expand Categories</button>
          </div>
          <div className="accordion-details">
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category._id}>
                  <Link to={`/archives/${category._id}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category._id}>
              <Link to={`/archives/${category._id}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
