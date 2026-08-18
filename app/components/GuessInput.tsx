"use client";
import React, { use } from 'react';
import { searchPokemon } from '../main';
import { useState } from 'react';
import { useEffect } from 'react';


export default function GuessInput({ setAnswer, pokemonList }: { setAnswer: (answer: string) => void; pokemonList: any[] }) {
  const [guess, setGuess] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; imageUrl: string }[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const results = await searchPokemon(guess);
      // console.log(results);
      const filterResults = results.filter((pokemon) => !pokemonList.some((p) => p.name === pokemon.name));
      setSuggestions(filterResults);
    };

    if (guess.length > 0) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [guess]);



  return (
    <div className="w-1/3 h-15 bg-sky-300 rounded-xl flex items-center justify-center relative p-2">
      <span className="text-lg text-[#0000FF]">guess</span>
      <input type="text" className="bg-white rounded-xl p-2 w-2/3 mx-3 text-center text-black" value={guess} onChange={(e) => setGuess(e.target.value)} />
      {suggestions.length > 0 && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-black/30 rounded-xl backdrop-blur-sm w-full' style={{height: '300px'}}></div>
      )}
      {suggestions.length>0 && (<div className='absolute bg-white rounded-xl p-2 top-full w-full max-h-60 overflow-y-auto mt-1 z-10'>
        {suggestions.map((suggestion) => (
          <div key={suggestion.name} onClick={() => {setAnswer(suggestion.name) 
          setGuess('')
          } } className="flex bg-white text-black rounded-xl p-2 mt-2 items-center gap-2 cursor-pointer hover:bg-gray-200">
            <span><img src={suggestion.imageUrl} alt={suggestion.name} className="w-10 h-10 object-contain" /></span>
            {suggestion.name}
          </div>
        ))}
      </div>)}
    </div>
  );
}

