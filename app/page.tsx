"use client"
import Hero from "@/components/sections/hero";
import Setup from "@/components/sections/setup";
import Usage from "@/components/sections/usage";
import Variants from "@/components/sections/variants";
import React from 'react'


export default function Home() {

  return (
    <>
      <main className="container flex min-h-screen flex-col items-center justify-between py-40 scroll-smooth">
        <Hero/>
        <Setup/>
        <Usage/> 
        <Variants/>       
      </main>
      <footer className='py-6 md:px-8 md:py-0 border-t'>
        <div className="container max-w-5xl flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href={"https://twitter.com/jal_eelll"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Jaleel Bennett
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  )
}
