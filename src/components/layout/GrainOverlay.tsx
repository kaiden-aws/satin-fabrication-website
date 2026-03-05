export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] motion-reduce:hidden"
      style={{
        backgroundImage: 'url(/textures/grain.png)',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  )
}
