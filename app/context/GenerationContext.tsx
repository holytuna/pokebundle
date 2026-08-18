"use client";

import { createContext, useState, useContext, useEffect } from "react";

type GenerationContextType = {
    generations: number[];
    setGenerations: (gens: number[]) => void;
}

export const GenerationContext = createContext<GenerationContextType>({
    generations: [],
    setGenerations: () => {}
});

export const GenerationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [generations, setGenerations] = useState<number[]>([]); // Default to all generations
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("generations");
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.length > 0) {
                setGenerations(parsed);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever generations change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("generations", JSON.stringify(generations));
        }
    }, [generations, isLoaded]);

    return (
        <GenerationContext.Provider value={{ generations, setGenerations }}>
            {children}
        </GenerationContext.Provider>
    );
}

export function useGeneration() {
    const context = useContext(GenerationContext);
    if (!context) {
        throw new Error("useGeneration must be used within a GenerationProvider");
    }
    return context;
}