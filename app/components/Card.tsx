import Image from "next/image";
import Link from "next/link";

interface Pokemon {
  name: string;
  sprites?: {
    front_default?: string | null;
  };
}

interface CardProps {
  p: Pokemon;
}

const Card: React.FC<CardProps> = ({ p }) => {
  return (
    <div>
      <Link
        href={`/pokemon/${p.name}`}
        className="bg-white dark:bg-[var(--background)] shadow p-4 rounded hover:scale-105 transition flex flex-col items-center text-center border border-gray-100 dark:border-gray-700"
      >
        {p.sprites?.front_default ? (
          <div className="relative w-20 h-20 mb-2">
            <Image
              fill
              src={p.sprites.front_default}
              alt={p.name}
              className="object-contain"
            />
          </div>
        ) : null}
        <p className="capitalize font-bold mb-1">{p.name}</p>
        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1 text-sm">
          Details
        </span>
      </Link>
    </div>
  );
};

export default Card;
