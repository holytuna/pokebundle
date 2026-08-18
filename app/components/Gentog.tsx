'use client';
import Image from "next/image"
import { useEffect, useState } from "react"
type GentogProps = {
    src: string;
    alt: string;
    index?: number;
    selected ?: boolean;
    onClick?: () => void;
}
export default function Gentog({src,alt,selected,onClick}:GentogProps) {
    const [toggle, setToggle] = useState(selected);
    useEffect(() => {
        setToggle(selected);
    }, [selected])
return(
    <button className="relative w-16 h-16 flex items-center justify-center cursor-pointer select-none [--webkit-user-drag: none]" onClick={() => { setToggle(!toggle); onClick?.(); }}>
    <Image src={src} alt={alt} width={80} height={80} className={toggle ? "" : "grayscale"}/>
    </button>
)
}