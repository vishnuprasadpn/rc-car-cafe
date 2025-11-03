"use client"

export default function ScrollIndicator() {
  const handleScroll = () => {
    const nextSection = document.getElementById('features-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <button 
        onClick={handleScroll}
        className="flex flex-col items-center text-white hover:text-red-400 transition-colors duration-300"
      >
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-4 bg-white/70 rounded-full mt-2"></div>
        </div>
        <div className="mt-2 text-xs font-semibold">Scroll Down</div>
      </button>
    </div>
  )
}
