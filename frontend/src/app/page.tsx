import Link from "next/link";

export default function Home() {
  return (
    <div className="py-20 px-20 border-2 bg-white">
      <h1 className="text-7xl text-center font-montserratfont-mono pb-7">Hello to the Video Chat</h1>
      <p className="max-w-[600px] text-center mx-auto font-open_sans">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
        consectetur sequi ipsa quibusdam est quia optio, autem quo voluptatibus
        officiis facilis repellendus odio sunt totam aliquid nihil, cum sint
        deserunt?
      </p>
      <div className="text-center mt-6">
        <Link href={"/dashboard"}>
      <button className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600 font-medium cursor-pointer hover:scale-105 duration-300 text-center">To Chat</button>
      </Link>
      </div>
    </div>
  );
}
