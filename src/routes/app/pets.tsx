import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/pets")({
  component: PetsPage,
});

const pets = [
  {
    name: "Max",
    breed: "Golden Retriever",
    age: "7 years",
    color: "bg-amber-spark",
  },
  {
    name: "Luna",
    breed: "Siamese Cat",
    age: "3 years",
    color: "bg-plum-voltage",
  },
  {
    name: "Milo",
    breed: "French Bulldog",
    age: "1 year",
    color: "bg-lichen",
  },
];

function PetsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-heading font-semibold mb-2">My Pets</h1>
      <p className="text-smoke mb-8">
        Manage profiles for all your furry companions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div
            key={pet.name}
            className="border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center"
          >
            {/* Avatar */}
            <div
              className={`w-16 h-16 rounded-full ${pet.color} mb-4 flex items-center justify-center text-bone text-xl font-bold`}
            >
              {pet.name[0]}
            </div>
            <h3 className="text-lg font-semibold text-bone">{pet.name}</h3>
            <p className="text-smoke text-sm mt-1">{pet.breed}</p>
            <p className="text-smoke text-xs mt-0.5">{pet.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
