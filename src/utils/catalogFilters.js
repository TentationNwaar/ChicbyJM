// src/utils/catalogFilters.js
/* ---------- Normalization helpers ---------- */
export const normalize = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD") // strip accents
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/* ---------- Synonyms (extend freely) ---------- */
const COLOR_SYNONYMS = {
  "noir": ["noir", "noire", "noirs", "noires", "black"],
  "blanc": ["blanc", "blanche", "blancs", "blanches", "white"],
  "rouge": ["rouge", "red"],
  "bleu": ["bleu", "bleus", "blue"],
  "bleu fonce": ["bleu foncé", "bleu fonce", "marine", "navy", "dark blue"],
  "vert": ["vert", "verte", "green"],
  "gris": ["gris", "grise", "gray", "grey"],
  "beige": ["beige", "ecru", "écru", "ivory"],
  "rose": ["rose", "pink"],
  "jaune": ["jaune", "yellow"],
  "orange": ["orange"],
  "marron": ["marron", "brun", "brown"],
  "violet": ["violet", "violette", "purple"],
  "turquoise": ["turquoise", "teal", "aqua"],
};

const CANONICAL_BY_ALIAS = (() => {
  const map = new Map();
  Object.entries(COLOR_SYNONYMS).forEach(([canon, aliases]) => {
    const canonN = normalize(canon);
    aliases.forEach(a => map.set(normalize(a), canonN));
  });
  return map;
})();

export const canonicalizeColor = (raw) => {
  const n = normalize(raw);
  return CANONICAL_BY_ALIAS.get(n) || n;
};



/* ---------- Variant extractors ---------- */
export const extractVariantColors = (node) => {
  const set = new Set();
  (node?.sync_variants || []).forEach(v => {
    const hay = normalize(`${v?.name || ""}`);
    // try to pick the last token or full phrase hits
    // we simply scan every alias and map to canonical
    Object.keys(COLOR_SYNONYMS).forEach(canon => {
      const aliases = COLOR_SYNONYMS[canon];
      aliases.forEach(alias => {
        if (hay.includes(normalize(alias))) set.add(normalize(canon));
      });
    });
  });
  return set;
};

// --- helpers communs ---
export const stripAccents = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]+/g, "").toLowerCase().trim();

const singularizeFr = (word = "") => {
  let w = stripAccents(word);
  // règles très simples pour le e-commerce (on évite la linguistique lourde)
  if (w.endsWith("aux")) return w.slice(0, -3) + "al"; // généraux -> général
  if (w.endsWith("eaux")) return w.slice(0, -1);       // manteaux -> manteau
  if (w.endsWith("x")) return w.slice(0, -1);          // bijoux -> bijou
  if (w.endsWith("es")) return w.slice(0, -2);         // robes -> robe, jupes -> jupe
  if (w.endsWith("s")) return w.slice(0, -1);          // t-shirts -> t-shirt
  return w;
};

// Synonymes / variantes → canon
const TYPE_SYNONYMS = {
  "t-shirt": ["t-shirt", "tshirt", "tee shirt", "tee", "shirt"],
  "sweatshirt": ["sweatshirt", "sweat", "crewneck"],
  "hoodie": ["hoodie", "sweat capuche", "capuche"],
  "pantalon": ["pantalon", "pants", "trousers"],
  "jean": ["jean", "denim"],
  "jogging": ["jogging", "survetement", "survêtement", "jogger", "joggers"],
  "short": ["short", "shorts"],
  "robe": ["robe", "dress"],
  "jupe": ["jupe", "skirt"],
  "chemise": ["chemise", "shirt dress", "button down"],
  "pull": ["pull", "sweater", "knit"],
  "manteau": ["manteau", "coat", "overcoat"],
  "veste": ["veste", "blouson", "jacket"],
  "debardeur": ["debardeur", "débardeur", "tank", "tank top"],
  "casquette": ["casquette", "cap", "snapback", "dad cap", "trucker"],
  "bonnet": ["bonnet", "beanie"],
  "echarpe": ["echarpe", "écharpe", "scarf"],
  "gants": ["gant", "gants", "gloves"],
  "ceinture": ["ceinture", "belt"],
  "sac": ["sac", "bag", "tote", "sacoche"],
  "bijou": ["bijou", "bijoux", "jewelry", "bracelet", "collier", "necklace", "ring", "bague"],
};

const TYPE_CANON_BY_TOKEN = (() => {
  const m = new Map();
  for (const [canon, forms] of Object.entries(TYPE_SYNONYMS)) {
    for (const f of forms) {
      m.set(singularizeFr(f), canon);
    }
  }
  return m;
})();

const toCanonTypes = (arr = []) =>
  Array.from(
    new Set(
      arr
        .map((v) => singularizeFr(v))
        .map((t) => TYPE_CANON_BY_TOKEN.get(t) || t) // si pas dans les synonymes, garder le token normalisé
    )
  );

const productHasType = (productNode, selectedCanonTypes) => {
  if (!selectedCanonTypes?.length) return true;
  const haystacks = [
    productNode?.name || "",
    ...(productNode?.sync_variants || []).map((v) => v?.name || ""),
  ];
  // tokeniser grossièrement
  const tokens = new Set(
    haystacks
      .map(stripAccents)
      .flatMap((txt) => txt.split(/[^a-z0-9]+/).filter(Boolean))
      .map(singularizeFr)
      .map((t) => TYPE_CANON_BY_TOKEN.get(t) || t)
  );
  // match si au moins un type sélectionné apparaît
  return selectedCanonTypes.some((canon) => tokens.has(canon));
};

export const extractVariantSizes = (node) => {
  const sizes = ["xxs","xs","s","m","l","xl","xxl","one size","onesize"];
  const set = new Set();
  (node?.sync_variants || []).forEach(v => {
    const hay = normalize(`${v?.name || ""}`);
    sizes.forEach(sz => { if (hay.includes(sz)) set.add(sz.toUpperCase()); });
  });
  return set;
};



export const getMinPrice = (variants = []) => {
  if (!variants?.length) return Infinity;
  return Math.min(...variants.map(v => parseFloat(v?.retail_price || "0") || 0));
};

/* ---------- Price range predicate ---------- */
const rangePredicate = (rangeLabel, price) => {
  switch (rangeLabel) {
    case "Moins de 50 CHF":   return price < 50;
    case "50 - 100 CHF":      return price >= 50 && price < 100;
    case "100 - 200 CHF":     return price >= 100 && price < 200;
    case "Plus de 200 CHF":   return price >= 200;
    default: return true;
  }
};

/* ---------- Main matcher ---------- */
export const productMatchesActiveFilters = (node, activeFilters) => {
  const colorsSet = extractVariantColors(node);    // canonical colors present in variants
  const sizesSet  = extractVariantSizes(node);     // sizes present in variants
  const productNameN = normalize(node?.name || "");

  // For performance, precompute min price once
  const minPrice = getMinPrice(node?.sync_variants);

  for (const [category, values] of Object.entries(activeFilters || {})) {
    if (!values?.length) continue;

    const cat = normalize(category);
    if (cat === "couleurs") {
      // value list is in UI form (“Noir”, “Bleu foncé”…), canonicalize and check intersection
      const wanted = new Set(values.map(canonicalizeColor));
      const hasAny = [...wanted].some(c => colorsSet.has(c));
      if (!hasAny) return false;
    } else if (cat === "taille") {
      const wanted = new Set(values.map(v => normalize(v).toUpperCase()));
      const hasAny = [...wanted].some(s => sizesSet.has(s));
      if (!hasAny) return false;
    } else if (cat === "type de produits") {
      // canonical type matching (singulier, accents, synonymes)
      const selectedCanonTypes = toCanonTypes(values);
      const ok = productHasType(node, selectedCanonTypes);
      if (!ok) return false;
    } else if (cat === "prix") {
      // Any of the selected ranges must pass at variant level
      const pass = (node?.sync_variants || []).some(v => {
        const p = parseFloat(v?.retail_price || "0") || 0;
        return values.some(range => rangePredicate(range, p));
      });
      if (!pass) return false;
    }
  }
  return true;
};

/* ---------- Filter + sort in one helper ---------- */
export const filterAndSort = (edges, activeFilters, sortOption) => {
  const filtered = edges.filter(({ node }) => productMatchesActiveFilters(node, activeFilters));

  if (sortOption === "priceAsc") {
    filtered.sort((a, b) => getMinPrice(a.node.sync_variants) - getMinPrice(b.node.sync_variants));
  } else if (sortOption === "priceDesc") {
    filtered.sort((a, b) => getMinPrice(b.node.sync_variants) - getMinPrice(a.node.sync_variants));
  } else if (sortOption === "alphabet") {
    filtered.sort((a, b) => a.node.name.localeCompare(b.node.name, "fr", { sensitivity: "base" }));
  }
  return filtered;
};