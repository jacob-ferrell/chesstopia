interface AuthHeroProps {
  title: string;
  subtitle?: string;
}

export default function AuthHero({ title, subtitle }: AuthHeroProps) {
  return (
    <div className="flex flex-col items-center gap-3 pt-2 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-yellow-500 to-yellow-700 font-chess text-4xl leading-none text-yellow-950 shadow-lg shadow-yellow-900/40">
        ♞
      </span>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-50 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
