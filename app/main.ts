export type Pokemon = {
  id: number;
  name: string;
  types: string[];
  evolution_stage: number;
  is_final_form: boolean;
  generation: number;
  is_legendary: boolean;
  height: number;
  weight: number;
  image_url: string;
};

export async function fetchPokemon(pokemonName: string) {
  const pokemonSpeciesRes = await fetch(
    `${process.env.NEXT_PUBLIC_POKEMON_API_URL}/pokemon-species/${pokemonName}`,
  );
  const pokemonSpeciesData = await pokemonSpeciesRes.json();
  const pokemonVarietiesLength = pokemonSpeciesData.varieties.length;
  const pokemonVariety = pokemonSpeciesData.varieties[Math.floor(Math.random() * pokemonVarietiesLength)].pokemon.name;
  const pokemonRes = await fetch(
    `${process.env.NEXT_PUBLIC_POKEMON_API_URL}/pokemon/${pokemonVariety}`,
  );
  const pokemonData = await pokemonRes.json();
  return { pokemonData, pokemonSpeciesData };
}
export async function getPokemonStat(pokemonName: string) {
  const { pokemonData, pokemonSpeciesData } = await fetchPokemon(pokemonName);
  const hp = pokemonData.stats[0].base_stat;
  const attack = pokemonData.stats[1].base_stat;
  const defense = pokemonData.stats[2].base_stat;
  const specialAttack = pokemonData.stats[3].base_stat;
  const specialDefense = pokemonData.stats[4].base_stat;
  const speed = pokemonData.stats[5].base_stat;
  return { hp, attack, defense, specialAttack, specialDefense, speed };
  
}
//-------------------------------------
export async function fetchPokemonStat(pokemonName: string) {
  const pokemonSpeciesRes = await fetch(
    `${process.env.NEXT_PUBLIC_POKEMON_API_URL}/pokemon-species/${pokemonName}`,
  );
  // console.log(pokemonRes)
  const pokemonSpeciesData = await pokemonSpeciesRes.json();
  const pokemonVarietiesLength = pokemonSpeciesData.varieties.length;
  const pokemonVariety = pokemonSpeciesData.varieties[Math.floor(Math.random() * pokemonVarietiesLength)].pokemon.name;
  const pokemonRes = await fetch(
    `${process.env.NEXT_PUBLIC_POKEMON_API_URL}/pokemon/${pokemonVariety}`,
  );
  const pokemonData = await pokemonRes.json();
  return { pokemonData, pokemonSpeciesData };
}
//-------------------------------------
export async function calculateBST(pokemonNameList: string[]) {
  let totalBST = -Infinity;
  let BSTfrom: {pokemonName: string; currentStat: any} | null = null;
  const statsList = await Promise.all(
    pokemonNameList.map((name: string) => getPokemonStat(name)),
  );
  function calBST(
    currentIndex: number = 0,
    stat: any[] = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"],
    sum: number,
    currentStat: any
  ) {

    if (currentIndex === statsList.length) {
      if (sum > totalBST) {
        totalBST = sum;
        BSTfrom = currentStat;
      }
      return;
    }
    for (const i of stat) {
        calBST(
          currentIndex + 1,
          stat.filter((stat) => stat !== i),
          sum + statsList[currentIndex][i as keyof typeof statsList[0]],
          {...currentStat, [i]: {pokemonName: pokemonNameList[currentIndex], value: statsList[currentIndex][i as keyof typeof statsList[0]]}},
        );
      }
  }
  calBST(0, ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"], 0 ,0);
  return { totalBST, BSTfrom };
  }
function getEvolutionChain(evolutionChainUrl: string) {
  return fetch(evolutionChainUrl).then((res) => res.json());
}

function calculateEvolutionStage(
  evolutionChain: any,
  pokemonName: string,
  currentStage: number = 1,
): { currentStage: number; isFinalForm: boolean } {
  //console.log(evolutionChain.chain.species.name, pokemonName, currentStage);
  if (pokemonName === "porygon-z") {
    return { currentStage: 3, isFinalForm: true };
  }
  if (
    evolutionChain.species.name === pokemonName.toLowerCase() ||
    evolutionChain.species.name === pokemonName.toLowerCase().split("-")[0]
  ) {
    if (
      evolutionChain.evolves_to === null ||
      evolutionChain.evolves_to.length === 0
    ) {
      return { currentStage, isFinalForm: true };
    }
    return { currentStage, isFinalForm: false };
  }
  if (evolutionChain.evolves_to && evolutionChain.evolves_to.length > 0) {
    for (const evolution of evolutionChain.evolves_to) {
      const result = calculateEvolutionStage(
        evolution,
        pokemonName,
        currentStage + 1,
      );
      if (result.currentStage !== -1) {
        return {
          currentStage: result.currentStage,
          isFinalForm: result.isFinalForm,
        };
      }
    }
  }

  return { currentStage: -1, isFinalForm: false };
}

export async function randomPokemon(pokemonGenList: number[]) {
  const randomIndex = Math.floor(Math.random() * pokemonGenList.length);
  let res = await fetch(
    `${process.env.NEXT_PUBLIC_POKEMON_API_URL}/generation/${pokemonGenList[randomIndex]}`,
  );
  let data = await res.json();
  const pokemonName =
    data.pokemon_species[
      Math.floor(Math.random() * data.pokemon_species.length)
    ].name;
  return pokemonName;
}

export async function getPokemon(pokemonName: string) {
  const { pokemonData, pokemonSpeciesData } = await fetchPokemon(pokemonName);
  const evolutionChain = await getEvolutionChain(
    pokemonSpeciesData.evolution_chain.url,
  );
  const evolutionStageInfo = calculateEvolutionStage(
    evolutionChain.chain,
    pokemonName,
  );
  const pokemon: Pokemon = {
    id: pokemonData.id,
    name: pokemonName,
    types: pokemonData.types.map((t: any) => t.type.name),
    generation: pokemonSpeciesData.generation.url.split("/").slice(-2, -1)[0],
    is_legendary: pokemonSpeciesData.is_legendary,
    height: pokemonData.height,
    weight: pokemonData.weight,
    evolution_stage: evolutionStageInfo.currentStage,
    is_final_form: evolutionStageInfo.isFinalForm,
    image_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`,
  };
  return pokemon;
}

export function comparePokemon(pokemonCheck: Pokemon, pokemonAns: Pokemon) {
  // If it's the exact same Pokemon, return all correct
  if (pokemonCheck.name.toLowerCase() === pokemonAns.name.toLowerCase()) {
    return {
      type1: "correct",
      type2: "correct",
      evolutionStage: "correct",
      finalForm: "correct",
      isLegendary: "correct",
      generation: "equal",
      height: "equal",
      weight: "equal",
      isCorrect: true,
    };
  }

  // Compare types
  const checkTypes = pokemonCheck.types;
  const ansTypes = pokemonAns.types;

  let type1 = "wrong";
  let type2 = "wrong";

  // Check first type
  if (checkTypes[0] === ansTypes[0]) {
    type1 = "correct";
  } else if (ansTypes.includes(checkTypes[0])) {
    type1 = "partly-correct";
  }

  // Check second type if it exists
  if (checkTypes[1]) {
    if (checkTypes[1] === ansTypes[1]) {
      type2 = "correct";
    } else if (ansTypes.includes(checkTypes[1])) {
      type2 = "partly-correct";
    }
  } else {
    // If check has only one type
    if (!ansTypes[1]) {
      // If answer also has no second type, it's correct
      type2 = "correct";
    } else {
      // If answer has a second type but check doesn't, it's wrong
      type2 = "wrong";
    }
  }

  // Compare other attributes
  const compareBoolean = (check: boolean, ans: boolean) =>
    check === ans ? "correct" : "wrong";
  const compareNumber = (check: number, ans: number) => {
    if (check < ans) return "lower";
    if (check > ans) return "higher";
    return "equal";
  };

  return {
    type1,
    type2,
    evolutionStage: compareBoolean(
      pokemonCheck.evolution_stage === pokemonAns.evolution_stage,
      true,
    ),
    finalForm: compareBoolean(
      pokemonCheck.is_final_form,
      pokemonAns.is_final_form,
    ),
    isLegendary: compareBoolean(
      pokemonCheck.is_legendary,
      pokemonAns.is_legendary,
    ),
    generation: compareNumber(pokemonCheck.generation, pokemonAns.generation),
    height: compareNumber(pokemonCheck.height, pokemonAns.height),
    weight: compareNumber(pokemonCheck.weight, pokemonAns.weight),
    isCorrect: false,
  };
}

// Cache for all Pokemon names
let allPokemonData: { name: string; imageUrl: string }[] | null = null;
export async function getAllPokemonNames(): Promise<
  { name: string; imageUrl: string }[]
> {
  if (allPokemonData) {
    return allPokemonData!;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_POKEMON_API_URL}/pokemon?limit=10000`,
    );
    const data = await res.json();

    allPokemonData = data.results.map((pokemon: any) => {
      const id = pokemon.url.split("/").slice(-2, -1)[0];
      return {
        name: pokemon.name,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
    return allPokemonData!;
  } catch (error) {
    console.error("Failed to fetch Pokemon names:", error);
    return [];
  }
}

export async function searchPokemon(
  query: string,
): Promise<{ name: string; imageUrl: string }[]> {
  const alldata = await getAllPokemonNames();
  const lowerQuery = query.toLowerCase();
  return alldata.filter((pokemon) => pokemon.name.startsWith(lowerQuery)); // Limit to 10 suggestions
}
