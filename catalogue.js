export const THEMES = ["sky-garden", "sunset-sky", "starry-night", "spring-meadow"];

export const CATALOGUE = [
  { id: "captain-hat", category: "hat", price: 20, translationKey: "item_captain_hat" },
  { id: "wizard-hat", category: "hat", price: 25, translationKey: "item_wizard_hat" },
  { id: "flower-crown", category: "hat", price: 25, translationKey: "item_flower_crown" },
  { id: "golden-crown", category: "hat", price: 0, translationKey: "item_golden_crown", achievementRequired: "perfect-pilot" },
  { id: "round-glasses", category: "glasses", price: 15, translationKey: "item_round_glasses" },
  { id: "star-glasses", category: "glasses", price: 0, translationKey: "item_star_glasses", achievementRequired: "streak-star" },
  { id: "sunglasses", category: "glasses", price: 20, translationKey: "item_sunglasses" },
  { id: "red-scarf", category: "neckwear", price: 15, translationKey: "item_red_scarf" },
  { id: "bow-tie", category: "neckwear", price: 15, translationKey: "item_bow_tie" },
  { id: "rainbow-scarf", category: "neckwear", price: 30, translationKey: "item_rainbow_scarf" },
  { id: "flower-badge", category: "badge", price: 0, translationKey: "item_flower_badge", achievementRequired: "first-bloom" },
  { id: "maths-medal", category: "badge", price: 25, translationKey: "item_maths_medal" },
  { id: "pencil", category: "handItem", price: 15, translationKey: "item_pencil" },
  { id: "small-book", category: "handItem", price: 20, translationKey: "item_small_book" },
  { id: "watering-can", category: "handItem", price: 25, translationKey: "item_watering_can" },
  { id: "sparkles", category: "effect", price: 35, translationKey: "item_sparkles" },
  { id: "butterflies", category: "effect", price: 40, translationKey: "item_butterflies" },
  { id: "sky-garden", category: "theme", price: 0, translationKey: "theme_sky_garden", defaultOwned: true },
  { id: "sunset-sky", category: "theme", price: 50, translationKey: "theme_sunset_sky" },
  { id: "starry-night", category: "theme", price: 60, translationKey: "theme_starry_night" },
  { id: "spring-meadow", category: "theme", price: 50, translationKey: "theme_spring_meadow" },
];

export const CATEGORIES = ["hat", "glasses", "neckwear", "badge", "handItem", "effect", "theme"];

export function findItem(id) {
  return CATALOGUE.find((item) => item.id === id) ?? null;
}
