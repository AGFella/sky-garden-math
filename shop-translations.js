const commonItems = {
  item_captain_hat: ["Captain Hat", "Капитанская фуражка", "Cappello da capitano"],
  item_wizard_hat: ["Wizard Hat", "Шляпа волшебника", "Cappello da mago"],
  item_flower_crown: ["Flower Crown", "Цветочная корона", "Corona di fiori"],
  item_golden_crown: ["Golden Crown", "Золотая корона", "Corona d'oro"],
  item_round_glasses: ["Round Glasses", "Круглые очки", "Occhiali rotondi"],
  item_star_glasses: ["Star Glasses", "Звёздные очки", "Occhiali a stella"],
  item_sunglasses: ["Sunglasses", "Солнечные очки", "Occhiali da sole"],
  item_red_scarf: ["Red Scarf", "Красный шарф", "Sciarpa rossa"],
  item_bow_tie: ["Bow Tie", "Галстук-бабочка", "Papillon"],
  item_rainbow_scarf: ["Rainbow Scarf", "Радужный шарф", "Sciarpa arcobaleno"],
  item_flower_badge: ["Flower Badge", "Цветочный значок", "Distintivo fiore"],
  item_maths_medal: ["Maths Medal", "Математическая медаль", "Medaglia di matematica"],
  item_pencil: ["Pencil", "Карандаш", "Matita"],
  item_small_book: ["Small Book", "Книжка", "Libricino"],
  item_watering_can: ["Watering Can", "Лейка", "Annaffiatoio"],
  item_sparkles: ["Sparkles", "Искорки", "Scintille"],
  item_butterflies: ["Butterflies", "Бабочки", "Farfalle"],
  theme_sky_garden: ["Sky Garden", "Небесный сад", "Giardino nel cielo"],
  theme_sunset_sky: ["Sunset Sky", "Закатное небо", "Cielo al tramonto"],
  theme_starry_night: ["Starry Night", "Звёздная ночь", "Notte stellata"],
  theme_spring_meadow: ["Spring Meadow", "Весенний луг", "Prato di primavera"],
};

const achievementDescriptions = {
  achievement_first_bloom_description: ["Complete your first round", "Заверши первый раунд", "Completa il primo round"],
  achievement_perfect_pilot_description: ["Finish a round with 10 correct answers", "Ответь правильно на все 10 вопросов", "Completa un round con 10 risposte corrette"],
  achievement_streak_star_description: ["Reach a streak of 10", "Достигни серии из 10 ответов", "Raggiungi una serie di 10"],
  achievement_garden_explorer_description: ["Complete five rounds", "Заверши пять раундов", "Completa cinque round"],
  achievement_speedy_captain_description: ["Complete a timed round", "Заверши раунд с таймером", "Completa un round con il timer"],
  achievement_master_skies_description: ["Complete every difficulty", "Заверши все уровни сложности", "Completa tutte le difficoltà"],
};

export const shopI18n = {
  en: {
    coins: "Sky Coins", coins_short: "coins", shop: "Shop", shop_title: "Captain Kitten's Shop",
    category_hats: "Hats", category_glasses: "Glasses", category_neckwear: "Scarves", category_badges: "Badges",
    category_hand_items: "Treasures", category_effects: "Magic", category_themes: "Themes",
    buy: "Buy", equip: "Equip", equipped: "Equipped", remove: "Remove", owned: "Owned", locked: "Locked",
    not_enough_coins: "Need more coins", purchase_title: "Buy this treasure?", purchase_confirm: (name, price) => `Buy ${name} for ${price} Sky Coins?`,
    purchase_success: (name) => `${name} is yours!`, shop_achievement_item: "Achievement reward", kitten_label: "Captain Kitten wearing selected accessories",
    coin_earned: (amount) => `+${amount} Sky Coin${amount === 1 ? "" : "s"}`, streak_coin_bonus: "Streak bonus!",
    round_coin_bonus: (amount) => `Round reward: +${amount} coins`, perfect_coin_bonus: "Perfect round bonus!",
    achievement_unlocked: "Achievement unlocked!", achievement_first_bloom: "First Bloom", achievement_perfect_pilot: "Perfect Pilot",
    achievement_streak_star: "Streak Star", achievement_garden_explorer: "Garden Explorer", achievement_speedy_captain: "Speedy Captain",
    achievement_master_skies: "Master of the Skies", yes_buy: "Yes, buy it",
  },
  ru: {
    coins: "Небесные монеты", coins_short: "монет", shop: "Магазин", shop_title: "Магазин Капитана Котёнка",
    category_hats: "Шляпы", category_glasses: "Очки", category_neckwear: "Шарфы", category_badges: "Значки",
    category_hand_items: "Сокровища", category_effects: "Волшебство", category_themes: "Темы",
    buy: "Купить", equip: "Надеть", equipped: "Надето", remove: "Снять", owned: "Куплено", locked: "Закрыто",
    not_enough_coins: "Нужно больше монет", purchase_title: "Купить сокровище?", purchase_confirm: (name, price) => `Купить «${name}» за ${price} небесных монет?`,
    purchase_success: (name) => `Теперь «${name}» твоё!`, shop_achievement_item: "Награда за достижение", kitten_label: "Капитан Котёнок в выбранных аксессуарах",
    coin_earned: (amount) => `+${amount} небесных монет`, streak_coin_bonus: "Бонус за серию!",
    round_coin_bonus: (amount) => `Награда за раунд: +${amount} монет`, perfect_coin_bonus: "Бонус за идеальный раунд!",
    achievement_unlocked: "Новое достижение!", achievement_first_bloom: "Первый цветок", achievement_perfect_pilot: "Идеальный пилот",
    achievement_streak_star: "Звезда серии", achievement_garden_explorer: "Исследователь сада", achievement_speedy_captain: "Быстрый капитан",
    achievement_master_skies: "Повелитель небес", yes_buy: "Да, купить",
  },
  it: {
    coins: "Monete del cielo", coins_short: "monete", shop: "Negozio", shop_title: "Negozio del Capitano Gattino",
    category_hats: "Cappelli", category_glasses: "Occhiali", category_neckwear: "Sciarpe", category_badges: "Distintivi",
    category_hand_items: "Tesori", category_effects: "Magia", category_themes: "Temi",
    buy: "Compra", equip: "Indossa", equipped: "Indossato", remove: "Togli", owned: "Posseduto", locked: "Bloccato",
    not_enough_coins: "Servono più monete", purchase_title: "Comprare questo tesoro?", purchase_confirm: (name, price) => `Comprare ${name} per ${price} monete del cielo?`,
    purchase_success: (name) => `${name} è tuo!`, shop_achievement_item: "Premio obiettivo", kitten_label: "Capitano Gattino con gli accessori scelti",
    coin_earned: (amount) => `+${amount} monet${amount === 1 ? "a" : "e"}`, streak_coin_bonus: "Bonus serie!",
    round_coin_bonus: (amount) => `Premio round: +${amount} monete`, perfect_coin_bonus: "Bonus round perfetto!",
    achievement_unlocked: "Obiettivo sbloccato!", achievement_first_bloom: "Prima fioritura", achievement_perfect_pilot: "Pilota perfetto",
    achievement_streak_star: "Stella della serie", achievement_garden_explorer: "Esploratore del giardino", achievement_speedy_captain: "Capitano veloce",
    achievement_master_skies: "Maestro dei cieli", yes_buy: "Sì, compra",
  },
};

for (const [key, values] of Object.entries(commonItems)) {
  shopI18n.en[key] = values[0];
  shopI18n.ru[key] = values[1];
  shopI18n.it[key] = values[2];
}
for (const [key, values] of Object.entries(achievementDescriptions)) {
  shopI18n.en[key] = values[0]; shopI18n.ru[key] = values[1]; shopI18n.it[key] = values[2];
}
