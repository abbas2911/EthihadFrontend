import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TermContext = createContext();

export const TermProvider = ({ children }) => {
    const [selectedTerm, setSelectedTerm] = useState({ selectedTermID: null, termName: '' });

    useEffect(() => {
        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/getSelectedTerm')
            .then(response => {
                const { selectedTermID, termName } = response.data;
                setSelectedTerm({ selectedTermID, termName });
            })
            .catch(error => {
                console.error('Error fetching selected term:', error);
            });
    }, []);

    return (
        <TermContext.Provider value={selectedTerm}>
            {children}
        </TermContext.Provider>
    );
};
