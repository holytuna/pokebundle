"use client";
import Image from "next/image";
import PickGen from "../components/PickGen";
import {fetchPokemon, getPokemon} from "../main";
import GuessInput from "../components/GuessInput";
import {comparePokemon} from "../main";
import { searchPokemon } from "../main"; 
import { use, useState } from "react";
import { useGeneration } from "../context/GenerationContext";
import { randomPokemon } from "../main";
import { useEffect } from "react";
import { get } from "http";
import { getPokemonStat } from "../main";
import { calculateBST } from "../main";

function ComparisonCell({ comparison, value, label }: { comparison: string; value: any; label: string }) {
  let bgColor = "bg-red-500";
  let showArrow = false;
  let arrowDirection = "up"; // "up" or "down"

  if (comparison === "correct" || comparison === "equal") {
    bgColor = "bg-green-500";
  } else if (comparison === "higher") {
    bgColor = "bg-orange-500";
    showArrow = true;
    arrowDirection = "down";
  } else if (comparison === "lower") {
    bgColor = "bg-orange-500";
    showArrow = true;
    arrowDirection = "up";
  }
  

  return (
    <div className={`w-22 h-22 rounded-xl p-2 items-center justify-center flex flex-col ${bgColor}`}>
      <span className="text-sm text-white">{value}</span>
      {showArrow && (
        <img 
          src="/arrow.png" 
          alt={arrowDirection} 
          className={`w-5 h-5 ${arrowDirection === "up" ? "-rotate-90" : "rotate-90"}`}
        />
      )}
    </div>
  );
}

export default function Classic() {
  const { generations } = useGeneration();
  useEffect(() => {
    if (generations.length > 0 && pokemon === null) {
      const fetchPokemon = async () => {
        const pokemon = await randomPokemon(generations);
        console.log(pokemon);
        getPokemon(pokemon).then((data) => {
          setPokemon(data);
          console.log(data);
        });
      };
      fetchPokemon();
    }
  }, [generations]);
  const [pokemon, setPokemon] = useState<any>(null);

  const [answer, setAnswer] = useState('');
  useEffect(() => {
      const fetchPokemon = async () => {
        if (answer === '') return;
        const ansdata = await getPokemon(answer);
        console.log(ansdata);
        const result = comparePokemon(ansdata, pokemon);
        setPokemonList((prev: any) => [...prev, { ...ansdata, comparison: result }]);
        setIsCorrect(result.isCorrect);
        console.log(result);
      };
      fetchPokemon();
    ;
  }, [answer, pokemon]);
  const [isCorrect, setIsCorrect] = useState(false);
  

  const [pokemonList, setPokemonList] = useState<any>([]);
  
  useEffect(() => {
    const fetchBST = async () => {
      const i = await calculateBST(["shuckle","mew","rayquaza","kyogre","groudon","eternatus"]);  
      console.log(i);
    };
    fetchBST();
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full h-screen items-center">
      <div className="flex flex-col gap-3 justify-center items-center w-full">
        <h1 className="text-7xl font-bold text-red-500 p-3">Classic Mode</h1>
        <p className="text-lg text-white">
        </p>
      </div>
      <GuessInput setAnswer={setAnswer} pokemonList={pokemonList} />
      {pokemonList.length > 0 && (
        <div>
        
          <div className="grid grid-cols-9 gap-2 text-sm items-center text-black">
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Pokemon</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Gen</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Type 1</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Type 2</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Legendary</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Height</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Weight</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Evo Stage</span>
            <span className="w-22 h-11 object-contain bg-white rounded-xl p-2">Final Form</span>
          </div>
          <div className="flex flex-col-reverse gap-3 w-full overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {pokemonList.map((p: any, index: number) => (
            <div key={index} className={`grid grid-cols-9 gap-2 items-center text-black mt-2 order-${pokemonList.length - index}`}>
              <img src={p.image_url} alt={p.name} className="w-22 h-22 object-contain bg-white rounded-xl p-2" />
              
              <ComparisonCell comparison={p.comparison.generation} value={p.generation} label="Gen" />

              <div className={`w-22 h-22 rounded-xl p-2 items-center justify-center flex ${p.comparison.type1 === "correct" ? "bg-green-500" : p.comparison.type1 === "partly-correct" ? "bg-yellow-500" : "bg-red-500"}`}>
                {p.types[0]}
              </div>

              <div className={`w-22 h-22 rounded-xl p-2 items-center justify-center flex ${p.comparison.type2 === "correct" ? "bg-green-500" : p.comparison.type2 === "partly-correct" ? "bg-yellow-500" : "bg-red-500"}`}>
                {p.types[1] ? p.types[1] : "none"}
              </div>

              <div className={`w-22 h-22 rounded-xl p-2 items-center justify-center flex ${p.comparison.isLegendary === "correct" ? "bg-green-500" : "bg-red-500"}`}>
                {p.is_legendary ? "legend" : "not legend"}
              </div>

              <ComparisonCell comparison={p.comparison.height} value={p.height} label="Height" />

              <ComparisonCell comparison={p.comparison.weight} value={p.weight} label="Weight" />

              <div className={`w-22 h-22 rounded-xl p-2 items-center justify-center flex ${p.comparison.evolutionStage === "correct" ? "bg-green-500": "bg-red-500"}`}>
                {p.evolution_stage}
              </div>

              <div className={`w-22 h-22 rounded-xl p-2 items-center justify-center flex ${p.comparison.finalForm === "correct" ? "bg-green-500" : "bg-red-500"}`}>
                {p.is_final_form ? "final form" : "not final form"}
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    {isCorrect && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/50"
           onClick={() => window.location.reload()}
        />

      {/* modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl text-green-500 font-bold mb-4">Congratulations!</h2>
        <p className="text-gray-700 mb-6">You guessed the Pokémon correctly in {pokemonList.length} attempts!</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           onClick={() => {if (pokemonList.length < 10){ window.location.reload()}
          else{window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";}}} // onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>)}
  </div>
  );
}






