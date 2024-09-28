import React from 'react';
import './Tooltip.css';

export function Tooltip({ children, message }) {
    return (
        <div className="tooltip-container">
            {children}
            <span className="tooltip-text">{message}</span>
        </div>
    );
}