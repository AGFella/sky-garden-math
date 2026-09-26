const SVG = `
<svg class="kitten-svg" viewBox="0 0 180 240" aria-hidden="true">
  <g class="kitten-tail"><path d="M132 175c35 7 34-38 10-39"/></g>
  <g class="kitten-body">
    <ellipse cx="90" cy="174" rx="54" ry="48"/>
    <ellipse class="kitten-belly" cx="90" cy="181" rx="34" ry="34"/>
    <ellipse class="kitten-paw" cx="57" cy="213" rx="18" ry="12"/>
    <ellipse class="kitten-paw" cx="123" cy="213" rx="18" ry="12"/>
    <ellipse class="kitten-arm left" cx="46" cy="174" rx="13" ry="29" transform="rotate(15 46 174)"/>
    <ellipse class="kitten-arm right" cx="134" cy="174" rx="13" ry="29" transform="rotate(-15 134 174)"/>
  </g>
  <g class="kitten-head">
    <path class="kitten-ear" d="M41 72 47 20 78 52Z"/><path class="kitten-ear" d="m139 72-6-52-31 32Z"/>
    <path class="kitten-inner-ear" d="M49 55 52 34 67 52Z"/><path class="kitten-inner-ear" d="m131 55-3-21-15 18Z"/>
    <ellipse class="kitten-face" cx="90" cy="87" rx="61" ry="55"/>
    <ellipse class="kitten-cheek" cx="55" cy="105" rx="12" ry="7"/><ellipse class="kitten-cheek" cx="125" cy="105" rx="12" ry="7"/>
    <path class="kitten-brow left" d="M52 69q13-8 24 0"/><path class="kitten-brow right" d="M104 69q13-8 24 0"/>
    <ellipse class="kitten-eye left" cx="65" cy="83" rx="6" ry="9"/><ellipse class="kitten-eye right" cx="115" cy="83" rx="6" ry="9"/>
    <path class="kitten-sleep-eye left" d="M55 83h19"/><path class="kitten-sleep-eye right" d="M106 83h19"/>
    <path class="kitten-nose" d="m90 94-7-5h14Z"/>
    <path class="kitten-mouth happy-mouth" d="M90 95q-3 17-18 10m18-10q3 17 18 10"/>
    <path class="kitten-mouth neutral-mouth" d="M79 106h22"/>
    <path class="kitten-mouth sad-mouth" d="M77 111q13-13 26 0"/>
    <g class="whiskers"><path d="M51 96 21 88M51 103l-32 4M129 96l30-8M129 103l32 4"/></g>
    <ellipse class="tear tear-left" cx="65" cy="96" rx="4" ry="8"/><ellipse class="tear tear-right" cx="115" cy="96" rx="4" ry="8"/>
  </g>
  <g class="default-collar"><path d="m61 132 29 20 29-20"/><circle cx="90" cy="148" r="8"/></g>
  <g class="accessory neckwear acc-red-scarf"><path d="M54 132q36 22 72 0l-6 17q-30 14-60 0Z"/><path d="m103 146 20 44-17-5-12 12-4-45Z"/></g>
  <g class="accessory neckwear acc-bow-tie"><path d="m90 145-28-14v28Zm0 0 28-14v28Z"/><circle cx="90" cy="145" r="8"/></g>
  <g class="accessory neckwear acc-rainbow-scarf"><path d="M54 132q36 22 72 0l-6 17q-30 14-60 0Z"/><path d="m103 146 18 48-15-6-13 10-2-47Z"/></g>
  <g class="accessory badge acc-flower-badge"><circle cx="117" cy="163" r="5"/><circle cx="126" cy="163" r="5"/><circle cx="121" cy="155" r="5"/><circle cx="121" cy="171" r="5"/><circle cx="121" cy="163" r="4"/></g>
  <g class="accessory badge acc-maths-medal"><path d="m111 145 10 19 10-19"/><circle cx="121" cy="169" r="10"/><text x="121" y="174">+</text></g>
  <g class="accessory glasses acc-round-glasses"><circle cx="65" cy="84" r="16"/><circle cx="115" cy="84" r="16"/><path d="M81 84h18M49 80l-15-5m97 5 15-5"/></g>
  <g class="accessory glasses acc-star-glasses"><path d="m65 67 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1Z"/><path d="m115 67 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1Z"/><path d="M78 83h24"/></g>
  <g class="accessory glasses acc-sunglasses"><path d="M46 74h39l-4 22H55Zm49 0h39l-9 22H99Z"/><path d="M84 80h12M46 77l-14-6m102 6 14-6"/></g>
  <g class="accessory hat acc-captain-hat"><path d="M44 48q46-38 92 0l-9 18H53Z"/><path d="M39 58q51-13 102 0-7 17-51 17S46 75 39 58"/><circle cx="90" cy="50" r="8"/></g>
  <g class="accessory hat acc-wizard-hat"><path d="m45 60 51-65 31 70Z"/><path d="M34 61q56-14 112 0-10 17-56 17S44 78 34 61"/><circle cx="93" cy="26" r="5"/><path d="m111 42 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z"/></g>
  <g class="accessory hat acc-flower-crown"><path d="M43 57q47-25 94 0"/><g><circle cx="58" cy="49" r="8"/><circle cx="78" cy="42" r="8"/><circle cx="100" cy="42" r="8"/><circle cx="122" cy="49" r="8"/></g></g>
  <g class="accessory hat acc-golden-crown"><path d="m45 60 7-38 21 22 17-32 17 32 21-22 7 38Z"/><circle cx="90" cy="50" r="7"/></g>
  <g class="accessory handItem acc-pencil"><path d="m126 168 35-48 9 7-35 48Z"/><path d="m161 120 8-7 1 14Z"/></g>
  <g class="accessory handItem acc-small-book"><path d="M112 170q21-10 38 0v35q-18-10-38 0Zm0 0q-21-10-38 0v35q18-10 38 0Z"/></g>
  <g class="accessory handItem acc-watering-can"><path d="M117 171h42v32h-42Z"/><path d="M159 177q22-15 13 14M117 178 99 163"/><circle cx="99" cy="163" r="6"/></g>
  <g class="accessory effect acc-sparkles">
    <path class="magic-piece magic-one" d="m23 73 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/>
    <path class="magic-piece magic-two" d="m158 128 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/>
    <path class="magic-piece magic-three" d="m143 48 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/>
  </g>
  <g class="accessory effect acc-butterflies">
    <path class="magic-piece magic-one" d="M21 83q-13-13-10 8 3 12 10 1 7 11 10-1 3-21-10-8"/>
    <path class="magic-piece magic-two" d="M158 133q-13-13-10 8 3 12 10 1 7 11 10-1 3-21-10-8"/>
    <path class="magic-piece magic-three" d="M145 55q-9-9-7 6 2 8 7 1 5 7 7-1 2-15-7-6"/>
  </g>
</svg>
<div class="zzz z1" aria-hidden="true">Z</div><div class="zzz z2" aria-hidden="true">Z</div><div class="zzz z3" aria-hidden="true">Z</div>
<div class="speech" data-kitten-speech aria-hidden="true"></div>`;

export function renderKitten(container, profile, accessibleLabel = "Captain Kitten") {
  if (!container) return;
  if (!container.querySelector(".kitten-svg")) container.innerHTML = SVG;
  container.classList.add("kitten-avatar");
  container.setAttribute("role", "img");
  container.setAttribute("aria-label", accessibleLabel);
  for (const [category, id] of Object.entries(profile.equippedItems)) {
    container.dataset[category] = id ?? "none";
  }
}

const PREVIEW_BOXES = {
  hat: "25 0 130 82",
  glasses: "28 56 124 58",
  neckwear: "42 118 98 86",
  badge: "90 135 62 58",
  handItem: "68 106 112 112",
  effect: "0 48 180 120",
};

export function renderAccessoryPreview(container, item, accessibleLabel) {
  container.replaceChildren();
  const source = document.createElement("div");
  source.innerHTML = SVG;
  const accessory = source.querySelector(`.acc-${item.id}`);
  if (!accessory) return;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("accessory-preview-svg", "kitten-svg");
  svg.setAttribute("viewBox", PREVIEW_BOXES[item.category] ?? "0 0 180 240");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", accessibleLabel);
  const clone = accessory.cloneNode(true);
  clone.classList.add("preview-force");
  svg.append(clone);
  container.append(svg);
}
