import Link from 'next/link'

export default function Home() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-between py-28">
      <section className="z-10 max-w-5xl w-full flex flex-col items-center text-center">
        <h1 className='scroll-m-20 text-4xl font-bold tracking-tight mb-3'>Shadcn Tag Input</h1>
        <p className='text-muted-foreground max-w-[450px]'>An implementation of a Tag Input component built on top of Shadcn UI&nbsp;s input component.</p>
        <div>
          <Link href="#try">Try it out</Link>
          <Link href="https://github.com/JaleelB/shadcn-tag-input"></Link>
        </div>
      </section>

      
    </main>
  )
}
