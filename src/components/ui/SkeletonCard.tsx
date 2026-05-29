export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-zinc-900/40 border border-white/[0.05] p-4 space-y-4 animate-pulse h-64 flex flex-col justify-end">
      <div className="h-4 bg-zinc-800 rounded-md w-1/3" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-zinc-800 rounded-md w-1/4" />
        <div className="h-8 bg-zinc-800 rounded-xl w-8" />
      </div>
    </div>
  );
}