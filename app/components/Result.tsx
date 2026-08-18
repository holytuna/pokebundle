import Image from "next/image";
import { comparePokemon } from "../main";

function ComparisonDisplay({ label, result }: { label: string; result: string }) {
    const isHigherLower = result === "higher" || result === "lower";

    return (
        <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">{label}:</span>
            <div className="flex items-center gap-1">
                {result === "correct" && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-lg">{result}</div>
                )}
                {result === "wrong" && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg">{result}</div>
                )}
                {result === "partly-correct" && (
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-lg">{result}</div>
                )}
                {result === "equal" && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg">{result}</div>
                )}
                {result === "lower" && (
                    <div className="flex items-center gap-1">
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-lg">{result}</div>
                        <img src="/arrow.png" alt="Lower" className="w-6 h-6 rotate-90" />
                    </div>
                )}
                {result === "higher" && (
                    <div className="flex items-center gap-1">
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-lg">{result}</div>
                        <img src="/arrow.png" alt="Higher" className="w-6 h-6 -rotate-90" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Result({ pokemonCheck, pokemonAns }: { pokemonCheck: any, pokemonAns: any }) {
    const result = comparePokemon(pokemonCheck, pokemonAns);

    return (
        <div className="bg-white bg-opacity-90 p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Comparison Results</h2>
            <ComparisonDisplay label="Type 1" result={result.type1} />
            <ComparisonDisplay label="Type 2" result={result.type2} />
            <ComparisonDisplay label="Generation" result={result.generation} />
            <ComparisonDisplay label="Height" result={result.height} />
            <ComparisonDisplay label="Weight" result={result.weight} />
            <ComparisonDisplay label="Evolution Stage" result={result.evolutionStage} />
            <ComparisonDisplay label="Final Form" result={result.finalForm} />
            <ComparisonDisplay label="Legendary" result={result.isLegendary} />
        </div>
    );
}