import { useEffect, useState } from 'react';
import './Filter.css';

const filters = ['Latest', 'Hot']

export function Filter({ setFilter }) {
    const [selectedFilter, setSelectedFilter] = useState('Latest')

    useEffect(() => {
        setFilter(selectedFilter);
    }, [selectedFilter, setFilter]);

    return (
        <>
            <div className="filter-box">
                <div className="filter">
                    {filters.map((filter) => (
                        <span
                            key={filter}
                            className={`filter-item ${selectedFilter === filter ? 'active' : ''}`}
                            onClick={() => setSelectedFilter(filter)}
                        >
                            {filter}
                        </span>
                    ))}
                </div>
            </div>
        </>
    )
}