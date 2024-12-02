"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react"

type SearchContextType = {

    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchResults: any[];
    setSearchResults: (result: any) => void;

};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        const storedResults = localStorage.getItem('searchResults');
        const storedTerm = localStorage.getItem('searchTerm');

        if (storedResults) setSearchResults(JSON.parse(storedResults));
        if (storedTerm) setSearchTerm(storedTerm);
    }, []);

    useEffect(() => {
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
        localStorage.setItem('searchTerm', searchTerm);
    }, [searchResults, searchTerm]);

    return (

        <SearchContext.Provider value={{ searchTerm, setSearchTerm, searchResults, setSearchResults }}>
            {children}
        </SearchContext.Provider>
    )


};

export const useSearchContext = () => {

    const context = useContext(SearchContext);

    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider')

    }

    return context;

};