"use client";
import Image from "next/image";
import { calculateBST, getPokemonStat } from "../main";
import { useEffect } from "react";
import { use, useState } from "react";
import { useGeneration } from "../context/GenerationContext";
import { randomPokemon } from "../main";
import { getPokemon } from "../main";

export default function Stattle() {
    const { generations } = useGeneration();
      useEffect(() => {
        if (generations.length > 0 && pokemons === null) {
          const fetchPokemonStat = async () => { 
            const pokemonName = new Set<string>();
            while (pokemons == null && pokemonName.size < 6) {
              const randomPokemonName = await randomPokemon(generations);
              if (!pokemonName.has(randomPokemonName)) {
                pokemonName.add(randomPokemonName);
              }
            }
            if (pokemonName.size === 6) {
              setPokemons(Array.from(pokemonName));
            }
          };
          fetchPokemonStat();
        }}, [generations]);

      const [pokemons, setPokemons] = useState<any>(null);
        

    useEffect(() => {
        if (pokemons) {
            const fetchBST = async () => {
                const { totalBST, BSTfrom } = await calculateBST(pokemons);
                console.log(totalBST, BSTfrom);
                setBSTfrom(BSTfrom);
            };
            fetchBST();
        }
    }, [pokemons]);

    const [chosenStat, setChosenStat] = useState<any>({
    hp: {name: "", value: -1, img: ""},
    def: {name: "", value: -1, img: ""},
    atk: {name: "", value: -1, img: ""},
    specialAtk: {name: "", value: -1, img: ""},
    specialDef: {name: "", value: -1, img: ""},
    speed: {name: "", value: -1, img: ""}
    });
    
    const [pokemonImage, setPokemonImage] = useState<any>({
    });

    const [count, setCount] = useState(0);

    const [BSTfrom, setBSTfrom] = useState<any>(null);

    const [currentPokemon, setCurrentPokemon] = useState<any>(null);
    useEffect(() => {

        if (pokemons && count < pokemons.length) {
            setIsLoading(true);
            const pokemonName = pokemons[count];
            const fetchCurrentPokemon = async () => {
            const pokemonStat = await getPokemonStat(pokemons[count]);
            const resGetPokemon = await getPokemon(pokemons[count]);
            const{ image_url } = resGetPokemon;
            setCurrentPokemon({...pokemonStat, image_url: image_url, name: pokemonName});
            setIsLoading(false);
            console.log({...pokemonStat, image_url: image_url, name: pokemonName});
            };
            fetchCurrentPokemon();
        }
    }, [pokemons, count]);

    const [showResult, setShowResult] = useState(false);

    const [isHidden, setIsHidden] = useState(true);

    const [isLoading, setIsLoading] = useState(true);


    function onButtonClick(statName: string, statValue: number, pokemonName: string, ) {
      setChosenStat((prevState: any) => ({
        ...prevState,
        [statName]: { name: pokemonName, value: statValue, img: currentPokemon.image_url }
      }));
      setPokemonImage((prevState: any) => ({
        ...prevState,
        [pokemonName]: {img: currentPokemon.image_url }
      }));
      if (count < pokemons.length - 1) {
        setIsHidden(false);
        const timer = setTimeout(() => setIsHidden(true), 1500);
        () => clearTimeout(timer);
        const timer2 = setTimeout(() => setCount((prevCount) => prevCount + 1), 1500);
        () => clearTimeout(timer2);
        

      
      
    }
      else{
        setShowResult(true);
      }
    }
    return (
      <div className="flex items-center justify-center flex-col w-full h-full text-7xl ">
        <div className="flex items-center justify-center w-full h-full text-7xl m-15 font-sans text-red-500 [-webkit-text-stroke:2px_black]">STATTLE</div>
        {currentPokemon && (
          <div className="flex items-center justify-center w-1/2 h-150 bg-black" >
            <div className="flex items-center justify-center w-5/7 h-5/7 text-7xl bg-white m-15 font-sans text-red-500 [-webkit-text-stroke:2px_black]">
              <img src={currentPokemon.image_url} alt={currentPokemon.name} width={150} height={150} />
            </div>
            <div className="flex items-center flex-col justify-center w-5/7 h-5/7 text-7xl bg-red-500 m-15 p-4 font-sans text-red-500 ">
                {showResult && <ResultModal chosenStat={chosenStat} BSTfrom={BSTfrom} pokemonImage={pokemonImage} />}
                <button 
                className="flex items-center justify-between w-full h-1/6 text-2xl bg-red-500 m-1 font-sans text-white hover:bg-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500" 
                onClick={() => onButtonClick('hp', currentPokemon.hp, currentPokemon.name, )}
                disabled={chosenStat.hp.value !== -1 || !isHidden || isLoading} 
                >
                  <div>HP:</div>  {isHidden || isLoading ? '???' : currentPokemon.hp}
                </button>
                <button 
                className="flex items-center justify-between w-full h-1/6 text-2xl bg-red-500 m-1 font-sans text-white hover:bg-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500" 
                onClick={() => onButtonClick('atk', currentPokemon.attack, currentPokemon.name)}
                disabled={chosenStat.atk.value !== -1 || !isHidden || isLoading}
                >
                  <div>Atk:</div> {isHidden || isLoading ? '???' : currentPokemon.attack}
                </button>
                <button 
                className="flex items-center justify-between w-full h-1/6 text-2xl bg-red-500 m-1 font-sans text-white hover:bg-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500" 
                onClick={() => onButtonClick('def', currentPokemon.defense, currentPokemon.name)}
                disabled={chosenStat.def.value !== -1 || !isHidden || isLoading}
                >
                  <div>Def:</div> {isHidden || isLoading ? '???' : currentPokemon.defense}
                </button>
                <button 
                className="flex items-center justify-between w-full h-1/6 text-2xl bg-red-500 m-1 font-sans text-white hover:bg-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500" 
                onClick={() => onButtonClick('specialAtk', currentPokemon.specialAttack, currentPokemon.name)}
                disabled={chosenStat.specialAtk.value !== -1 || !isHidden || isLoading}
                >
                  <div>Sp. Atk:</div> {isHidden || isLoading ? '???' : currentPokemon.specialAttack}
                </button>
                <button 
                className="flex items-center justify-between w-full h-1/6 text-2xl bg-red-500 m-1 font-sans text-white hover:bg-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500" 
                onClick={() => onButtonClick('specialDef', currentPokemon.specialDefense, currentPokemon.name)}
                disabled={chosenStat.specialDef.value !== -1 || !isHidden || isLoading}
                >
                  <div>Sp. Def:</div> {isHidden || isLoading ? '???' : currentPokemon.specialDefense}
                </button>
                <button 
                className="flex items-center justify-between w-full h-1/6 text-2xl bg-red-500 m-1 font-sans text-white hover:bg-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500" 
                onClick={() => onButtonClick('speed', currentPokemon.speed, currentPokemon.name)}
                disabled={chosenStat.speed.value !== -1 || !isHidden || isLoading}
                >
                  <div>Speed:</div> {isHidden || isLoading ? '???' : currentPokemon.speed}
                </button>
              
            </div>
          </div>
        )}
      </div>
      );
}

function ResultModal({ chosenStat, BSTfrom, pokemonImage }: { chosenStat: any; BSTfrom: any; pokemonImage: any }) {
  const chosenHP = chosenStat.hp;
  const chosenAtk = chosenStat.atk;
  const chosenDef = chosenStat.def;
  const chosenSpecialAtk = chosenStat.specialAtk;
  const chosenSpecialDef = chosenStat.specialDef;
  const chosenSpeed = chosenStat.speed;
  const totalStats = chosenHP.value + chosenAtk.value + chosenDef.value + chosenSpecialAtk.value + chosenSpecialDef.value + chosenSpeed.value;
  
  const { hp: BSTHP, attack: BSTAtk, defense: BSTDef, specialAttack: BSTSpecialAtk, specialDefense: BSTSpecialDef, speed: BSTSpeed } = BSTfrom;
  const totalBST = BSTHP.value + BSTAtk.value + BSTDef.value + BSTSpecialAtk.value + BSTSpecialDef.value + BSTSpeed.value;
  
  console.log("BSTfrom:", BSTfrom);
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center flex-col w-full h-full text-7xl backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center w-1/3 h-4/5 bg-black p-4 gap-4">


      <div className="flex flex-col border border-white w-full h-1/2 rounded-4xl p-5">
        <div className="text-white text-2xl w-full flex flex-col  gap-4 text-left">Your Final Score: {totalStats}</div>
{/* ---------------- */}
        <div className="text-white grid grid-cols-3 gap-4 w-full h-full">
          {Array.from(['hp', 'atk', 'def', 'specialAtk', 'specialDef', 'speed']).map((statKey) => {
            return( <div className="flex flex-col items-center justify-center" key={statKey}>
            <div className="text-white text-xl  flex flex-col gap-4 text-left">{statKey}</div>
            <img src={chosenStat[statKey].img} alt={statKey} className="w-1/2 h-1/2 object-contain" />
            <div className="text-white text-xl">{chosenStat[statKey].value}</div>
          </div>)
          })}


         

        </div>
{/* ------------------ */}
      </div>



      <div className="flex flex-col border border-white w-full h-1/2 rounded-4xl p-5">
      <div className="text-white text-2xl w-full h-full flex flex-col  gap-4 text-left">Best Final Score: {totalBST}</div>

{/* ---------------- */}
      <div className="text-white grid grid-cols-3 gap-4 w-full h-full">
          {Array.from(['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed']).map((statKey) => {
            const temp = Object.keys(chosenStat).find(key => chosenStat[key].name === BSTfrom[statKey].pokemonName);
            console.log("temp:", temp);
            return( <div className="flex flex-col items-center justify-center" key={statKey}>
            <div className="text-white text-xl  flex flex-col gap-4 text-left">{statKey}</div>
            <img src={pokemonImage[BSTfrom[statKey].pokemonName]?.img} alt={statKey} className="w-1/2 h-1/2 object-contain" />
            <div className="text-white text-xl">{BSTfrom[statKey].value}</div>
          </div>)
          })}


         

        </div>
{/* ------------------ */}

      </div>







      </div>
    </div>
  );



}


