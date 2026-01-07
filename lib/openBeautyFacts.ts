// ============================================================================
// OPEN BEAUTY FACTS API SERVICE
// Free, open-source cosmetics database with product images and ingredients
// API Docs: https://wiki.openfoodfacts.org/API
// ============================================================================

const BASE_URL = 'https://world.openbeautyfacts.org/api/v2';

export interface OpenBeautyFactsProduct {
  code: string; // Barcode
  product_name: string;
  brands: string;
  image_url: string;
  image_front_url: string;
  image_front_small_url: string;
  image_ingredients_url: string;
  ingredients_text: string;
  ingredients_text_en: string;
  categories: string;
  categories_tags: string[];
  labels: string;
  labels_tags: string[];
  countries: string;
  stores: string;
  quantity: string;
}

export interface ProductSearchResult {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: OpenBeautyFactsProduct[];
}

export interface ProductLookupResult {
  code: string;
  status: number;
  status_verbose: string;
  product?: OpenBeautyFactsProduct;
}

/**
 * Search for products by name/brand
 */
export async function searchProducts(
  query: string,
  page: number = 1,
  pageSize: number = 24
): Promise<ProductSearchResult> {
  const url = `${BASE_URL}/search?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&json=true`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HanSkin/1.0 (skincare app)',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Open Beauty Facts search error:', error);
    return { count: 0, page: 1, page_count: 0, page_size: pageSize, products: [] };
  }
}

/**
 * Look up a product by barcode
 */
export async function getProductByBarcode(barcode: string): Promise<ProductLookupResult> {
  const url = `${BASE_URL}/product/${barcode}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HanSkin/1.0 (skincare app)',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Open Beauty Facts barcode lookup error:', error);
    return {
      code: barcode,
      status: 0,
      status_verbose: 'error',
    };
  }
}

/**
 * Search for Korean beauty products specifically
 */
export async function searchKoreanBeautyProducts(
  query: string = '',
  page: number = 1,
  pageSize: number = 24
): Promise<ProductSearchResult> {
  // Search with Korea-related terms
  const searchTerms = query
    ? `${query} korea`
    : 'korean skincare';

  return searchProducts(searchTerms, page, pageSize);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  category: string,
  page: number = 1,
  pageSize: number = 24
): Promise<ProductSearchResult> {
  const categoryMap: Record<string, string> = {
    cleanser: 'face-cleansers',
    toner: 'toners',
    serum: 'serums',
    essence: 'essences',
    moisturizer: 'moisturizers',
    sunscreen: 'sunscreens',
    mask: 'face-masks',
    eye_cream: 'eye-creams',
  };

  const apiCategory = categoryMap[category] || category;
  const url = `${BASE_URL}/category/${apiCategory}?page=${page}&page_size=${pageSize}&json=true`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HanSkin/1.0 (skincare app)',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Open Beauty Facts category error:', error);
    return { count: 0, page: 1, page_count: 0, page_size: pageSize, products: [] };
  }
}

/**
 * Convert Open Beauty Facts product to our app's format
 */
export function convertToAppProduct(obfProduct: OpenBeautyFactsProduct): {
  id: string;
  barcode: string;
  brand: string;
  name: string;
  image_url: string | null;
  raw_inci_text: string | null;
  category: string | null;
  store: string | null;
} {
  // Try to determine category from tags
  let category: string | null = null;
  const categoryTags = obfProduct.categories_tags || [];

  if (categoryTags.some(t => t.includes('cleanser') || t.includes('wash'))) {
    category = 'cleanser';
  } else if (categoryTags.some(t => t.includes('toner'))) {
    category = 'toner';
  } else if (categoryTags.some(t => t.includes('serum'))) {
    category = 'serum';
  } else if (categoryTags.some(t => t.includes('essence'))) {
    category = 'essence';
  } else if (categoryTags.some(t => t.includes('moistur') || t.includes('cream'))) {
    category = 'moisturizer';
  } else if (categoryTags.some(t => t.includes('sunscreen') || t.includes('spf'))) {
    category = 'sunscreen';
  } else if (categoryTags.some(t => t.includes('mask'))) {
    category = 'mask';
  } else if (categoryTags.some(t => t.includes('eye'))) {
    category = 'eye_cream';
  }

  return {
    id: obfProduct.code,
    barcode: obfProduct.code,
    brand: obfProduct.brands || 'Unknown Brand',
    name: obfProduct.product_name || 'Unknown Product',
    image_url: obfProduct.image_front_url || obfProduct.image_url || null,
    raw_inci_text: obfProduct.ingredients_text_en || obfProduct.ingredients_text || null,
    category,
    store: obfProduct.stores || null,
  };
}

/**
 * Fetch popular K-beauty brands
 */
export const POPULAR_KBEAUTY_BRANDS = [
  'COSRX',
  'Innisfree',
  'Laneige',
  'Etude House',
  'Missha',
  'Some By Mi',
  'Klairs',
  'Purito',
  'Beauty of Joseon',
  'Sulwhasoo',
  'Dr. Jart+',
  'Banila Co',
  'Heimish',
  'Neogen',
  'Torriden',
  'Anua',
  'Isntree',
  'Round Lab',
  'Skin1004',
  'Benton',
];

/**
 * Search for products from popular K-beauty brands
 */
export async function searchKBeautyBrands(
  page: number = 1,
  pageSize: number = 24
): Promise<ProductSearchResult> {
  // Pick a random brand to search
  const randomBrand = POPULAR_KBEAUTY_BRANDS[Math.floor(Math.random() * POPULAR_KBEAUTY_BRANDS.length)];
  return searchProducts(randomBrand, page, pageSize);
}
