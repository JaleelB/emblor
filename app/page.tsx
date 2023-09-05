"use client"
import Hero from "@/components/sections/hero";
import Props from "@/components/sections/props";
import Setup from "@/components/sections/setup";
import Usage from "@/components/sections/usage";
import Variants from "@/components/sections/variants";
import React from 'react'


export default function Home() {

  return (
    <>
      <div className="container max-w-5xl py-40 flex justify-between">
        <main className="w-full flex min-h-screen flex-col items-center justify-between scroll-smooth">
          <Hero/>
          <Setup/>
          <Usage/> 
          <Variants/>
          <Props/>       
        </main>
        <aside className="ml-20 hidden text-sm xl:block">
          <div className="sticky top-10 text-sm">
            <h3 className="font-medium mb-6 whitespace-nowrap">On this page</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#setup" className="text-muted-foreground font-light">Setup</a>
              </li>
              <li>
                <a href="#usage" className="text-muted-foreground font-light">Usage</a>
              </li>
              <li>
                <a href="#variants" className="text-muted-foreground font-light">Variants</a>
              </li>
              <li>
                <a href="#props" className="text-muted-foreground font-light">Props</a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
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
