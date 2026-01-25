const SITE_URL = 'https://phuketvibetour.com';
const SITE_NAME = 'Phuket Vibe Tours';
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attr}="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function updateSEO(config: SEOConfig) {
  const { title, description, canonical, image, type = 'website', noIndex } = config;

  document.title = title;

  setMetaTag('description', description);

  if (noIndex) {
    setMetaTag('robots', 'noindex, nofollow');
  } else {
    setMetaTag('robots', 'index, follow');
  }

  setMetaTag('og:title', title, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:type', type, true);
  setMetaTag('og:site_name', SITE_NAME, true);
  setMetaTag('og:image', image || DEFAULT_IMAGE, true);
  setMetaTag('og:url', canonical || window.location.href, true);
  setMetaTag('og:locale', 'en_US', true);

  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  setMetaTag('twitter:image', image || DEFAULT_IMAGE);

  setLinkTag('canonical', canonical || window.location.href);
}

export function addStructuredData(id: string, data: object) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function removeStructuredData(id: string) {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TravelAgency", "TouristInformationCenter"],
    "@id": `${SITE_URL}/#organization`,
    "name": "PhuketVibe",
    "alternateName": "Phuket Vibe Tours",
    "description": "Premium tour operator in Phuket, Thailand offering island tours, boat trips, transfers, and adventure experiences. Book Phi Phi, Similan Islands, James Bond Island tours and more.",
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.jpg`,
      "width": 200,
      "height": 200
    },
    "image": [
      `${SITE_URL}/logo.jpg`,
      "https://aswrvvwbzhfsunioyglv.supabase.co/storage/v1/object/public/Photos/Admin%20Panel%20Images/backround.jpg"
    ],
    "telephone": "+66972137197",
    "email": "info@phuketvibe.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "105 Phangmuang Sai Kor Rd",
      "addressLocality": "Patong",
      "addressRegion": "Phuket",
      "postalCode": "83150",
      "addressCountry": "TH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 7.8965,
      "longitude": 98.2963
    },
    "hasMap": "https://maps.google.com/?q=7.8965,98.2963",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "22:00"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "THB, USD, EUR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "areaServed": [
      {
        "@type": "City",
        "name": "Phuket",
        "containedInPlace": {
          "@type": "Country",
          "name": "Thailand"
        }
      },
      {
        "@type": "Place",
        "name": "Patong Beach"
      },
      {
        "@type": "Place",
        "name": "Kata Beach"
      },
      {
        "@type": "Place",
        "name": "Karon Beach"
      }
    ],
    "sameAs": [
      "https://t.me/PhuketVibemanager",
      "https://wa.me/66972137197"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": "Island Tours"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": "Speedboat Tours"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Airport Transfer"
        }
      }
    ]
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": "Book the best tours and excursions in Phuket, Thailand. Island hopping, boat trips, transfers, and adventure tours.",
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function getTourSchema(tour: {
  name: string;
  description: string;
  images: string[];
  price: number;
  features: string[];
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${SITE_URL}/tour/${tour.slug}`,
    "name": tour.name,
    "description": tour.description,
    "image": tour.images,
    "touristType": ["Adventure tourism", "Cultural tourism", "Beach tourism"],
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": "THB",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0],
      "url": `${SITE_URL}/tour/${tour.slug}/book`,
      "seller": {
        "@id": `${SITE_URL}/#organization`
      }
    },
    "provider": {
      "@id": `${SITE_URL}/#organization`
    },
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": tour.features.map((feature, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": feature
      }))
    }
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_IMAGE };
