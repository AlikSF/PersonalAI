import { Product } from './supabase';

type Language = 'ru' | 'en' | 'kk' | 'ky' | 'az';
type TranslationFunction = (key: string) => string;

export function getDisplayName(product: Product, language: Language): string {
  // Try language-specific field first
  const langField = `name_${language}` as keyof Product;
  const langValue = product[langField];
  if (langValue && typeof langValue === 'string' && langValue.trim()) {
    return langValue.trim();
  }

  // Fallback to Russian
  return product.name || '';
}

export function getDisplayDescription(product: Product, language: Language): string {
  // Try language-specific field first
  const langField = `description_${language}` as keyof Product;
  const langValue = product[langField];
  if (langValue && typeof langValue === 'string' && langValue.trim()) {
    return langValue.trim();
  }

  // Fallback to Russian
  return product.description || '';
}

export function getDisplayLocation(product: Product, language: Language): string {
  // Try language-specific field first
  const langField = `location_${language}` as keyof Product;
  const langValue = product[langField];
  if (langValue && typeof langValue === 'string' && langValue.trim()) {
    return langValue.trim();
  }

  // Fallback to Russian
  return product.location || '';
}

export function getDisplayFeatures(product: Product, language: Language): string[] {
  // Try language-specific field first
  const langField = `features_${language}` as keyof Product;
  const langValue = product[langField];
  if (langValue && Array.isArray(langValue) && langValue.length > 0) {
    return langValue;
  }

  // Fallback to Russian
  return product.features || [];
}

export function getDisplayCategory(
  product: Product,
  language: Language,
  t: TranslationFunction
): string {
  // Try language-specific field first
  const langField = `category_${language}` as keyof Product;
  const langValue = product[langField];
  if (langValue && typeof langValue === 'string' && langValue.trim()) {
    return langValue.trim();
  }

  // Otherwise fall back to translation or original category
  const translationKey = `category.${product.category}`;
  const translated = t(translationKey);

  // If translation exists (not just the key echoed back), use it
  return translated !== translationKey ? translated : product.category;
}
