import Image from "next/image"
import Link from "next/link"
export default function RightBar() {
    return (
        <div className="flex fixed justify-between h-full inset-y-0 right-0 w-2/9">
            <div className="flex gap-3 m-3">
                <Link href={"/about"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">about</button></Link>   
                <Link href={"/reward"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">reward</button></Link>
                <Link href={"/setting"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">setting</button></Link>
                <Link href={"/user"}><button className="flex bg-white cursor-pointer text-blue-400 p-3 w-full rounded-xl">user</button></Link>
            </div>
        </div>
    )
}