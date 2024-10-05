import React, { useRef, useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { emailByCollege } from '../../consts/emailByCollege';
import { useStore } from '../../store';
import { Close } from '../Icons/Close';
import { School } from '../Icons/School';
import { SearchIcon } from '../Icons/SearchIcon';
import './Search.css';

export function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const { searchSelectedItem, setSearchSelectedItem } = useStore(
        useShallow((state) => ({
            searchSelectedItem: state.searchSelectedItem,
            setSearchSelectedItem: state.setSearchSelectedItem,
        }))
    );
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.length > 0) {
                fetchData(query);
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 240);

        return () => clearTimeout(handler);
    }, [query]);

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowResults(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchData = async (query) => {
        setTimeout(() => {
            const mockResults = Object.keys(emailByCollege).filter((collegeName) =>
                collegeName.toLowerCase().includes(query.toLowerCase())
            );

            setResults(mockResults);
            setShowResults(true);
        }, 1000);
    };

    const handleSelect = (e, college) => {
        e.stopPropagation()
        e.preventDefault()
        setSearchSelectedItem(college);
        setQuery('');
        setShowResults(false);
    };

    const handleClearSelection = () => {
        setSearchSelectedItem(null);
    };

    return (
        <div className="search-box" ref={searchRef}>
            {!searchSelectedItem && (
                <div className="search-input-box">
                    <SearchIcon />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Your school..."
                        value={query}
                        onFocus={() => results.length !== 0 && setShowResults(true)}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {showResults && results.length !== 0 && (
                        <div className="results-box">
                            <ul>
                                {results.map((college) => (
                                    <div
                                        className="college-item"
                                        key={college}
                                        onClick={(e) => handleSelect(e, college)}
                                        title={college}
                                    >
                                        <School />
                                        {college}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {searchSelectedItem && (
                <div className="selected-box">
                    <span>{searchSelectedItem}</span>
                    <button onClick={handleClearSelection}><Close /></button>
                </div>
            )}
        </div>
    );
}
