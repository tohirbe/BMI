export default function Spinner({ fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-purple-500/10 rounded-full" />
        <div className="absolute inset-2 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-500" />
      </div>
      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">Loading Analytics...</p>
      
      <style jsx>{`
        .animation-delay-500 {
          animation-delay: -0.5s;
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center">
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}