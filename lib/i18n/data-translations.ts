/**
 * Translations for database-driven content (categories, charts, columns, etc.)
 * These translate seed data from English to Spanish at display time.
 */

import type { Locale } from "./index";

// Category names by slug
const categoryNames: Record<string, Record<Locale, string>> = {
  mens: { en: "Men's", es: "Hombre" },
  womens: { en: "Women's", es: "Mujer" },
  boys: { en: "Boys", es: "Niños" },
  girls: { en: "Girls", es: "Niñas" },
};

// Subcategory names by slug
const subcategoryNames: Record<string, Record<Locale, string>> = {
  tops: { en: "Tops", es: "Partes superiores" },
  bottoms: { en: "Bottoms", es: "Partes inferiores" },
  footwear: { en: "Footwear", es: "Calzado" },
  gloves: { en: "Gloves", es: "Guantes" },
  headwear: { en: "Headwear", es: "Gorros" },
  socks: { en: "Socks", es: "Calcetines" },
  bras: { en: "Bras", es: "Sostenes deportivos" },
  "plus-sizes": { en: "Plus Sizes", es: "Tallas grandes" },
};

// Chart names by slug
const chartNames: Record<string, Record<Locale, string>> = {
  "mens-tops": { en: "Tops", es: "Partes superiores" },
  "mens-bottoms": { en: "Bottoms", es: "Partes inferiores" },
  "mens-footwear": { en: "Footwear", es: "Calzado" },
  "mens-gloves": { en: "Gloves", es: "Guantes" },
  "mens-headwear": { en: "Headwear", es: "Gorros" },
  "mens-socks": { en: "Socks", es: "Calcetines" },
  "womens-tops": { en: "Tops", es: "Partes superiores" },
  "womens-sports-bras": { en: "Sports Bras", es: "Sostenes deportivos" },
  "womens-bottoms": { en: "Bottoms", es: "Partes inferiores" },
  "womens-plus-sizes": { en: "Plus Sizes", es: "Tallas grandes" },
  "womens-footwear": { en: "Footwear", es: "Calzado" },
  "womens-gloves": { en: "Gloves", es: "Guantes" },
  "womens-headwear": { en: "Headwear", es: "Gorros" },
  "womens-socks": { en: "Socks", es: "Calcetines" },
  "youth-big-kids-tops": { en: "Big Kids (8-20)", es: "Niños grandes (8-20)" },
  "youth-big-kids-bottoms": { en: "Big Kids (8-20)", es: "Niños grandes (8-20)" },
  "youth-little-kids": { en: "Little Kids (4-7)", es: "Niños pequeños (4-7)" },
  "youth-toddler": { en: "Toddler (2T-4T)", es: "Bebés grandes (2T-4T)" },
  "youth-infant": { en: "Infant (0-24M)", es: "Bebés (0-24M)" },
  "youth-footwear": { en: "Youth Footwear", es: "Calzado juvenil" },
  "youth-gloves": { en: "Youth Gloves", es: "Guantes juveniles" },
  "youth-headwear": { en: "Youth Headwear", es: "Gorros juveniles" },
  "youth-socks": { en: "Youth Socks", es: "Calcetines juveniles" },
};

// Chart descriptions by slug
const chartDescriptions: Record<string, Record<Locale, string>> = {
  "mens-tops": {
    en: "Men's shirts, t-shirts, polos, hoodies, and jackets. Based on standard athletic sizing.",
    es: "Camisas, camisetas, polos, sudaderas y chaquetas para hombre. Basado en tallas atléticas estándar.",
  },
  "mens-bottoms": {
    en: "Men's pants, shorts, joggers, and athletic bottoms. Based on standard athletic sizing.",
    es: "Pantalones, shorts, joggers y partes inferiores deportivas para hombre. Basado en tallas atléticas estándar.",
  },
  "mens-footwear": {
    en: "Men's athletic shoes and sneakers. Based on standard athletic sizing.",
    es: "Zapatillas deportivas y tenis para hombre. Basado en tallas atléticas estándar.",
  },
  "mens-gloves": {
    en: "Men's training and running gloves",
    es: "Guantes de entrenamiento y carrera para hombre",
  },
  "mens-headwear": {
    en: "Men's caps, beanies, and headbands",
    es: "Gorras, gorros y cintas para la cabeza para hombre",
  },
  "mens-socks": {
    en: "Men's athletic and training socks",
    es: "Calcetines deportivos y de entrenamiento para hombre",
  },
  "womens-tops": {
    en: "Women's shirts, t-shirts, tanks, hoodies, and jackets. Based on standard athletic sizing.",
    es: "Camisas, camisetas, tops, sudaderas y chaquetas para mujer. Basado en tallas atléticas estándar.",
  },
  "womens-sports-bras": {
    en: "Sports bras with band and cup sizing. Based on standard athletic sizing.",
    es: "Sostenes deportivos con talla de banda y copa. Basado en tallas atléticas estándar.",
  },
  "womens-bottoms": {
    en: "Women's pants, leggings, shorts, and athletic bottoms. Based on standard athletic sizing.",
    es: "Pantalones, leggings, shorts y partes inferiores deportivas para mujer. Basado en tallas atléticas estándar.",
  },
  "womens-plus-sizes": {
    en: "Women's plus size tops and bottoms. Extended sizing based on standard athletic sizing.",
    es: "Partes superiores e inferiores de talla grande para mujer. Tallas extendidas basadas en tallas atléticas estándar.",
  },
  "womens-footwear": {
    en: "Women's athletic shoes and sneakers. Based on standard athletic sizing. Women's sizes are 1.5 sizes larger than men's.",
    es: "Zapatillas deportivas y tenis para mujer. Basado en tallas atléticas estándar. Las tallas de mujer son 1.5 tallas más grandes que las de hombre.",
  },
  "womens-gloves": {
    en: "Women's training and running gloves",
    es: "Guantes de entrenamiento y carrera para mujer",
  },
  "womens-headwear": {
    en: "Women's caps, beanies, and headbands",
    es: "Gorras, gorros y cintas para la cabeza para mujer",
  },
  "womens-socks": {
    en: "Women's athletic and training socks",
    es: "Calcetines deportivos y de entrenamiento para mujer",
  },
  "youth-big-kids-tops": {
    en: "Youth tops for ages 6-16. Based on standard athletic sizing.",
    es: "Partes superiores juveniles para edades 6-16. Basado en tallas atléticas estándar.",
  },
  "youth-big-kids-bottoms": {
    en: "Youth bottoms for ages 6-16. Based on standard athletic sizing.",
    es: "Partes inferiores juveniles para edades 6-16. Basado en tallas atléticas estándar.",
  },
  "youth-little-kids": {
    en: "Youth clothing for ages 4-7. Based on standard athletic sizing.",
    es: "Ropa juvenil para edades 4-7. Basado en tallas atléticas estándar.",
  },
  "youth-toddler": {
    en: "Toddler clothing for ages 2-4. Based on standard athletic sizing.",
    es: "Ropa para bebés grandes de 2-4 años. Basado en tallas atléticas estándar.",
  },
  "youth-infant": {
    en: "Infant clothing for ages 0-24 months. Based on standard athletic sizing.",
    es: "Ropa para bebés de 0-24 meses. Basado en tallas atléticas estándar.",
  },
  "youth-footwear": {
    en: "Kids' and youth athletic shoes. Based on standard athletic sizing. Includes Big Kids (3.5Y-7Y) sizes.",
    es: "Zapatillas deportivas para niños y jóvenes. Basado en tallas atléticas estándar. Incluye tallas de niños grandes (3.5Y-7Y).",
  },
  "youth-gloves": {
    en: "Youth training and sport gloves",
    es: "Guantes deportivos y de entrenamiento juveniles",
  },
  "youth-headwear": {
    en: "Youth caps, beanies, and headbands",
    es: "Gorras, gorros y cintas para la cabeza juveniles",
  },
  "youth-socks": {
    en: "Youth athletic and training socks",
    es: "Calcetines deportivos y de entrenamiento juveniles",
  },
};

// Column header names
const columnNames: Record<string, Record<Locale, string>> = {
  Size: { en: "Size", es: "Talla" },
  Chest: { en: "Chest", es: "Pecho" },
  Waist: { en: "Waist", es: "Cintura" },
  Hips: { en: "Hips", es: "Cadera" },
  Bust: { en: "Bust", es: "Busto" },
  Inseam: { en: "Inseam", es: "Entrepierna" },
  Height: { en: "Height", es: "Altura" },
  "US Size": { en: "US Size", es: "Talla US" },
  "Band Size": { en: "Band Size", es: "Talla de banda" },
  "Cup Size": { en: "Cup Size", es: "Talla de copa" },
  "Hand Circumference": { en: "Hand Circumference", es: "Circunferencia de mano" },
  "Hand Length": { en: "Hand Length", es: "Largo de mano" },
  "Head Circumference": { en: "Head Circumference", es: "Circunferencia de cabeza" },
  "US Shoe Size": { en: "US Shoe Size", es: "Talla de zapato US" },
  Age: { en: "Age", es: "Edad" },
  "Weight (lbs)": { en: "Weight (lbs)", es: "Peso (lbs)" },
};

// Measurement instruction names
const instructionNames: Record<string, Record<Locale, string>> = {
  "Chest/Bust": { en: "Chest/Bust", es: "Pecho/Busto" },
  Waist: { en: "Waist", es: "Cintura" },
  Hip: { en: "Hip", es: "Cadera" },
  Inseam: { en: "Inseam", es: "Entrepierna" },
  Height: { en: "Height", es: "Altura" },
  "Foot Length": { en: "Foot Length", es: "Largo del pie" },
  "Hand Circumference": { en: "Hand Circumference", es: "Circunferencia de mano" },
  "Hand Length": { en: "Hand Length", es: "Largo de mano" },
  "Head Circumference": { en: "Head Circumference", es: "Circunferencia de cabeza" },
  "Band Size": { en: "Band Size", es: "Talla de banda" },
  "Cup Size": { en: "Cup Size", es: "Talla de copa" },
};

// Measurement instruction texts
const instructionTexts: Record<string, Record<Locale, string>> = {
  "Measure around the fullest part of your chest, keeping the tape parallel to the floor.": {
    en: "Measure around the fullest part of your chest, keeping the tape parallel to the floor.",
    es: "Mide alrededor de la parte más ancha de tu pecho, manteniendo la cinta paralela al suelo.",
  },
  "Measure around the narrowest part of your natural waistline, typically just above the belly button.": {
    en: "Measure around the narrowest part of your natural waistline, typically just above the belly button.",
    es: "Mide alrededor de la parte más estrecha de tu cintura natural, generalmente justo encima del ombligo.",
  },
  "Measure around the fullest part of your hips, about 8 inches below your waist.": {
    en: "Measure around the fullest part of your hips, about 8 inches below your waist.",
    es: "Mide alrededor de la parte más ancha de tus caderas, aproximadamente 20 cm debajo de tu cintura.",
  },
  "Measure from the crotch seam to the bottom of the leg along the inner leg.": {
    en: "Measure from the crotch seam to the bottom of the leg along the inner leg.",
    es: "Mide desde la costura de la entrepierna hasta el bajo del pantalón por la parte interior de la pierna.",
  },
  "Measure from the top of your head to the floor while standing straight without shoes.": {
    en: "Measure from the top of your head to the floor while standing straight without shoes.",
    es: "Mide desde la parte superior de tu cabeza hasta el suelo estando de pie sin zapatos.",
  },
  "Stand on a piece of paper and trace your foot. Measure from heel to longest toe.": {
    en: "Stand on a piece of paper and trace your foot. Measure from heel to longest toe.",
    es: "Párate sobre una hoja de papel y traza el contorno de tu pie. Mide desde el talón hasta el dedo más largo.",
  },
  "Measure around your palm at the widest point, excluding the thumb.": {
    en: "Measure around your palm at the widest point, excluding the thumb.",
    es: "Mide alrededor de tu palma en el punto más ancho, excluyendo el pulgar.",
  },
  "Measure from the base of your palm to the tip of your middle finger.": {
    en: "Measure from the base of your palm to the tip of your middle finger.",
    es: "Mide desde la base de tu palma hasta la punta de tu dedo medio.",
  },
  "Measure around the largest part of your head, about 1 inch above your eyebrows.": {
    en: "Measure around the largest part of your head, about 1 inch above your eyebrows.",
    es: "Mide alrededor de la parte más grande de tu cabeza, aproximadamente 2.5 cm por encima de tus cejas.",
  },
  "Measure snugly around your ribcage, directly under your bust. Round to nearest even number.": {
    en: "Measure snugly around your ribcage, directly under your bust. Round to nearest even number.",
    es: "Mide ajustadamente alrededor de tu caja torácica, directamente debajo del busto. Redondea al número par más cercano.",
  },
  "Measure around the fullest part of your bust. Subtract band size to determine cup.": {
    en: "Measure around the fullest part of your bust. Subtract band size to determine cup.",
    es: "Mide alrededor de la parte más llena de tu busto. Resta la talla de banda para determinar la copa.",
  },
};

// --- Public helper functions ---

/**
 * Translate a category name by its slug.
 */
export function translateCategoryName(slug: string, name: string, locale: Locale): string {
  return categoryNames[slug]?.[locale] ?? name;
}

/**
 * Translate a subcategory name by its slug.
 */
export function translateSubcategoryName(slug: string, name: string, locale: Locale): string {
  return subcategoryNames[slug]?.[locale] ?? name;
}

/**
 * Translate a chart name by its slug.
 */
export function translateChartName(slug: string, name: string, locale: Locale): string {
  return chartNames[slug]?.[locale] ?? name;
}

/**
 * Translate a chart description by its slug.
 */
export function translateChartDescription(slug: string, description: string | null, locale: Locale): string | null {
  if (!description) return null;
  return chartDescriptions[slug]?.[locale] ?? description;
}

/**
 * Translate a column header name.
 */
export function translateColumnName(name: string, locale: Locale): string {
  return columnNames[name]?.[locale] ?? name;
}

/**
 * Translate a measurement instruction name.
 */
export function translateInstructionName(name: string, locale: Locale): string {
  return instructionNames[name]?.[locale] ?? name;
}

/**
 * Translate a measurement instruction text.
 */
export function translateInstructionText(text: string, locale: Locale): string {
  return instructionTexts[text]?.[locale] ?? text;
}
