"use client";

import Image from "next/image";
import banner from "../public/banner.jpeg"
import Inicio from "@/app"



export default function Home() {
  
  return (
    <main className="text-center" style={{background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)"}}>
      <Image src={banner} alt="Banner Star Wars" style={{width: "100%", height: 200}}  quality={100}/>
      <div className="m-16">
      <Inicio />
      </div>
      
    </main>
  );
}
