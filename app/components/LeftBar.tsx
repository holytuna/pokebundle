import Image from "next/image"
import Link from "next/link"
import PickGen from "./PickGen"
export default function LeftBar() {
    return (
        <div className="flex flex-col  justify-between h-screen fixed inset-0 w-1/5">

            <Link href={"/"}>
                <button>
                    <img src="/pokedle-logo-pokemons.webp" alt="logo" className=""/>
                </button>
            </Link>

            <div className="flex flex-col gap-3 m-3">
                <PickGen/>
                <Link href={"/pokedex"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">pokedex</button></Link>
                <Link href={"/stat"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">stat</button></Link>
                <button className="flex bg-white text-blue-400 p-3 rounded-xl">streak</button>
            </div>
        </div>
    )
}