import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center w-full p-50 grid grid-cols-2">
      <Link href={"/classic"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">classic</button></Link>
      <Link href={"/infinite"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">infinite</button></Link>
      <Link href={"/versus"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">versus</button></Link>
      <Link href={"/stattle"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">stattle</button></Link>
      <Link href={"/diary"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">diary</button></Link>
      <Link href={"/custom"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">custom</button></Link>  
    </div>
  );
}
