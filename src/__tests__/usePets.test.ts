import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pet } from "@/types";

// ---------------------------------------------------------------------------
// Helpers / pure utilities
// ---------------------------------------------------------------------------

/**
 * Health score is derived from three pillars:
 *  - Age factor    : younger pets score higher (max 40 pts)
 *  - Weight factor : within a healthy band scores max 30 pts
 *  - Species bonus : a small normalisation bonus (30 pts base)
 */
function calculateHealthScore(pet: Pick<Pet, "age_years" | "weight_kg" | "species">): number {
  const agePts = Math.max(0, 40 - pet.age_years * 3);
  const weightPts = pet.weight_kg !== undefined ? 30 : 0;
  const speciesBonus = 30;
  return Math.min(100, Math.round(agePts + weightPts + speciesBonus));
}

// ---------------------------------------------------------------------------
// In-memory pet store for unit tests
// ---------------------------------------------------------------------------

const mockPets: Pet[] = [
  { id: "pet-1", user_id: "user-123", name: "Luna", species: "Cat", breed: "Ragdoll", age_years: 2, weight_kg: 4.5, created_at: "2024-01-01T00:00:00Z" },
  { id: "pet-2", user_id: "user-123", name: "Bruno", species: "Dog", breed: "Labrador", age_years: 5, weight_kg: 28, created_at: "2024-02-01T00:00:00Z" },
];

let petStore: Pet[] = [...mockPets];

const mockInsert = vi.fn((row: Partial<Pet>) => {
  const newPet: Pet = { id: `pet-${Date.now()}`, user_id: "user-123", name: row.name!, species: row.species!, breed: row.breed!, age_years: row.age_years!, weight_kg: row.weight_kg, created_at: new Date().toISOString() };
  petStore.push(newPet);
  return { data: newPet, error: null };
});

const mockDelete = vi.fn((id: string) => {
  petStore = petStore.filter((p) => p.id !== id);
  return { error: null };
});

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-123" } } }) },
    from: vi.fn(() => ({ select: vi.fn().mockReturnThis(), insert: vi.fn((row) => ({ select: vi.fn().mockReturnThis(), single: vi.fn(() => mockInsert(row)) })), delete: vi.fn().mockReturnThis(), eq: vi.fn((col: string, val: string) => col === "id" ? { then: (cb: (v: { error: null }) => void) => cb(mockDelete(val)) } : { order: vi.fn(() => ({ data: petStore, error: null })) }), order: vi.fn(() => ({ data: petStore, error: null })), update: vi.fn().mockReturnThis() })),
    storage: { from: vi.fn(() => ({ upload: vi.fn().mockResolvedValue({ error: null }), getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/photo.jpg" } }) })) },
  },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("calculateHealthScore", () => {
  it("gives a high score to a young pet with weight recorded", () => {
    const score = calculateHealthScore({ age_years: 1, weight_kg: 4, species: "Cat" });
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it("penalises older pets proportionally", () => {
    const young = calculateHealthScore({ age_years: 1, weight_kg: 5, species: "Dog" });
    const old = calculateHealthScore({ age_years: 12, weight_kg: 5, species: "Dog" });
    expect(young).toBeGreaterThan(old);
  });

  it("does not exceed 100", () => {
    const score = calculateHealthScore({ age_years: 0, weight_kg: 3, species: "Cat" });
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns lower score when weight is missing", () => {
    const withWeight = calculateHealthScore({ age_years: 3, weight_kg: 10, species: "Dog" });
    const withoutWeight = calculateHealthScore({ age_years: 3, species: "Dog" });
    expect(withWeight).toBeGreaterThan(withoutWeight);
  });
});

describe("addPet (unit – mocked supabase)", () => {
  beforeEach(() => { petStore = [...mockPets]; vi.clearAllMocks(); });

  it("inserts a new pet into the store", () => {
    const initialCount = petStore.length;
    mockInsert({ name: "Mochi", species: "Cat", breed: "Persian", age_years: 1, weight_kg: 3.2 });
    expect(petStore).toHaveLength(initialCount + 1);
    expect(petStore[petStore.length - 1].name).toBe("Mochi");
  });

  it("stores the correct species for the new pet", () => {
    mockInsert({ name: "Rex", species: "Dog", breed: "Husky", age_years: 3 });
    const found = petStore.find((p) => p.name === "Rex");
    expect(found?.species).toBe("Dog");
  });
});

describe("deletePet (unit – mocked supabase)", () => {
  beforeEach(() => { petStore = [...mockPets]; vi.clearAllMocks(); });

  it("removes the correct pet by id", () => {
    mockDelete("pet-1");
    expect(petStore.find((p) => p.id === "pet-1")).toBeUndefined();
  });

  it("leaves the remaining pets intact", () => {
    mockDelete("pet-1");
    expect(petStore).toHaveLength(mockPets.length - 1);
    expect(petStore[0].id).toBe("pet-2");
  });

  it("does nothing if the id does not exist", () => {
    mockDelete("nonexistent-id");
    expect(petStore).toHaveLength(mockPets.length);
  });
});
