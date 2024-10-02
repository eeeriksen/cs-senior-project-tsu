import React from 'react';
import './Tooltip.css';

export function Tooltip({ children, message, showTooltip }) {
    return (
        <div className="tooltip-container">
            {children}
            {showTooltip && <span className="tooltip-text">{message}</span>}
        </div>
    );
}