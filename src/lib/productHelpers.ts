import { Product } from './supabase';

type Language = 'ru' | 'en';
type TranslationFunction = (key: string) => string;

export function getDisplayName(product: Product, language: Language): string {
  if (language === 'en' && product.name_en?.trim()) {
    return product.name_en.trim();
  }
  return product.name;
}

export function getDisplayDescription(product: Product, language: Language): string {
  if (language === 'en' && product.description_en?.trim()) {
    return product.description_en.trim();
  }
  return product.description;
}

export function getDisplayLocation(product: Product, language: Language): string {
  if (language === 'en' && product.location_en?.trim()) {
    return product.location_en.trim();
  }
  return product.location;
}

export function getDisplayFeatures(product: Product, language: Language): string[] {
  if (language === 'en' && product.features_en && product.features_en.length > 0) {
    return product.features_en;
  }
  return product.features;
}

export function getDisplayCategory(
  product: Product,
  language: Language,
  t: TranslationFunction
): string {
  // If English mode and category_en is provided, use it
  if (language === 'en' && product.category_en?.trim()) {
    return product.category_en.trim();
  }

  // Otherwise fall back to translation or original category
  const translationKey = `category.${product.category}`;
  const translated = t(translationKey);

  // If translation exists (not just the key echoed back), use it
  return translated !== translationKey ? translated : product.category;
}
