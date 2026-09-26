import { CATALOGUE, CATEGORIES } from "./catalogue.js";
import { renderAccessoryPreview, renderKitten } from "./kitten.js";

const CATEGORY_KEYS = {
  hat: "category_hats", glasses: "category_glasses", neckwear: "category_neckwear",
  badge: "category_badges", handItem: "category_hand_items", effect: "category_effects", theme: "category_themes",
};

function button(text, className, action, itemId) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.textContent = text;
  element.dataset.action = action;
  if (itemId) element.dataset.itemId = itemId;
  return element;
}

export function renderShop({ container, preview, profile, strings, activeCategory = "hat" }) {
  renderKitten(preview, profile, strings.kitten_label);
  container.replaceChildren();
  const tabs = document.createElement("div");
  tabs.className = "shop-tabs";
  tabs.setAttribute("role", "tablist");
  CATEGORIES.forEach((category) => {
    const tab = button(strings[CATEGORY_KEYS[category]], "shop-tab", "category");
    tab.dataset.category = category;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(category === activeCategory));
    tab.classList.toggle("active", category === activeCategory);
    tabs.append(tab);
  });
  const grid = document.createElement("div");
  grid.className = "shop-grid";
  CATALOGUE.filter((item) => item.category === activeCategory).forEach((item) => {
    const owned = profile.ownedItems.includes(item.id);
    const equipped = item.category === "theme" ? profile.activeTheme === item.id : profile.equippedItems[item.category] === item.id;
    const card = document.createElement("article");
    card.className = `shop-item shop-item-${item.category}`;
    card.dataset.itemId = item.id;
    card.tabIndex = 0;
    const visual = document.createElement("div");
    visual.className = `shop-item-visual preview-${item.id}`;
    if (item.category === "theme") {
      const themeMark = document.createElement("span");
      themeMark.textContent = "☁";
      themeMark.setAttribute("aria-hidden", "true");
      visual.append(themeMark);
    } else {
      renderAccessoryPreview(visual, item, strings[item.translationKey]);
    }
    const name = document.createElement("h4");
    name.textContent = strings[item.translationKey];
    const price = document.createElement("p");
    price.className = "shop-price";
    price.textContent = item.achievementRequired ? strings.shop_achievement_item : `${item.price} ${strings.coins_short}`;
    let action;
    if (equipped && item.category !== "theme") action = button(strings.remove, "btn ghost small", "remove", item.id);
    else if (equipped) action = button(strings.equipped, "btn active small", "none", item.id);
    else if (owned) action = button(strings.equip, "btn primary small", "equip", item.id);
    else if (item.achievementRequired) action = button(strings.locked, "btn ghost small", "none", item.id);
    else if (profile.coins >= item.price) action = button(strings.buy, "btn primary small", "buy", item.id);
    else action = button(strings.not_enough_coins, "btn ghost small", "none", item.id);
    action.disabled = action.dataset.action === "none";
    card.append(visual, name, price, action);
    grid.append(card);
  });
  container.append(tabs, grid);
}
