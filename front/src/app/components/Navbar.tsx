'use client'
import Image from "next/image";
import { usePathname } from 'next/navigation';



const Navbar = () => {

  const pathname = usePathname();
  if (pathname === '/signin' || pathname === '/signup') return null;
  return (
    <div className="fixed bottom-10 w-180 left-1/2 transform -translate-x-1/2
     bg-gray-400 text-white px-2 py-3 rounded-md shadow-md z-50 flex gap-4">
      <Image
        src="/logo/logo.svg"
        width={80}
        height={80}
        alt="Home page"
      />
      <div className="flex judtify-items gap-2 bg-black py-2 px-2 rounded-md ">
        <button className="border-1 border-white rounded-md w-25 p-2">Dashboard</button>
        <button className="border-1 border-white rounded-md w-25 p-2">Chat</button>
        <button className="border-1 border-white rounded-md w-25 p-2">Pingpong</button>
        <button className="border-1 border-white rounded-md w-25 p-2">Chess</button>
        <button className="border-1 border-white rounded-md w-25 p-2">Profil</button>
      </div>
    </div>
  );
};

export default Navbar;
