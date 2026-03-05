export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-display text-6xl text-cream">
        SATIN <span className="text-gold">FABRICATION</span>
      </h1>
      <p className="mt-4 font-body text-warm-gray text-lg tracking-wide uppercase">
        Custom Architectural Metalwork
      </p>
      <div className="mt-8 flex gap-4">
        <div className="h-16 w-16 rounded bg-void border border-gold" />
        <div className="h-16 w-16 rounded bg-charcoal border border-gold" />
        <div className="h-16 w-16 rounded bg-surface border border-gold-light" />
        <div className="h-16 w-16 rounded bg-gold" />
        <div className="h-16 w-16 rounded bg-cream" />
        <div className="h-16 w-16 rounded bg-warm-gray" />
      </div>
      <p className="mt-4 text-sm text-warm-gray">
        Color swatches above verify DSGN-01 tokens. Heading is Playfair Display (DSGN-02). Body is Raleway.
      </p>
    </main>
  )
}
