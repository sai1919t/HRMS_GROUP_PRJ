import React from 'react';

const Card = ({ children, className = '', padding = 'p-6' }) => {
    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${padding} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
