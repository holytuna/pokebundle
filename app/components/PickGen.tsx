"use client";
import Gentog from "./Gentog";
import { useGeneration } from "../context/GenerationContext";
import { use } from "react";


export default function PickGen() {
    const { generations, setGenerations } = useGeneration();
    const generationOptions = [
        { src: "/charmander.png", alt: "charmander", gen: 1 },
        { src: "/totodile.png", alt: "totodile", gen: 2 },
        { src: "/torchic.png", alt: "torchic", gen: 3 },
        { src: "/piplup.png", alt: "piplup", gen: 4 },
        { src: "/snivy.png", alt: "snivy", gen: 5 },
        { src: "/froakie.png", alt: "froakie", gen: 6 },
        { src: "/mokuro.png", alt: "rowlet", gen: 7 },
        { src: "/810.png", alt: "grookey", gen: 8 },
        { src: "/906.png", alt: "sprigatito", gen: 9 }
    ];

    return (
        <div className="bg-white rounded-xl flex flex-wrap gap-2 p-3">
            <div className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl text-xl"> Change Generation</div>
            {generationOptions.map((gen) => (
                <Gentog 
                    key={gen.alt} 
                    src={gen.src} 
                    alt={gen.alt} 
                    selected={generations.includes(gen.gen)}
                    onClick={() => {
                        const newGens = generations.includes(gen.gen) ? generations.filter(g => g !== gen.gen) : [...generations, gen.gen];
                        setGenerations(newGens);
                    }}
                />
            ))}
        </div>
    )
}