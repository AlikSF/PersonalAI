import { Product } from './supabase';

type Language = 'ru' | 'en';

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
