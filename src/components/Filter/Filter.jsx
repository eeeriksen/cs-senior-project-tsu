import { useEffect, useState } from 'react';
import { useStore } from '../../store'
import { useShallow } from 'zustand/react/shallow'
import './Filter.css';

const filters = ['Latest', 'Popular']

export function Filter({ setFilter }) {
    const { selectedFilter, setSelectedFilter } = useStore(
        useShallow((state) => ({
            selectedFilter: state.selectedFilter,
            setSelectedFilter: state.setSelectedFilter,
        }))
    );

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