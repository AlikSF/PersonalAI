import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE_URL = "https://phuketvibe.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Product {
  id: string;
  slug: string | null;
  name: string;
  updated_at: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products, error } = await supabase
      .from("products")
      .select("id, slug, name, updated_at")
      .eq("is_active", true)
      .order("priority", { ascending: true, nullsLast: true });

    if (error) {
      throw error;
    }

    const today = new Date().toISOString().split("T")[0];

    const staticPages = [
      { loc: SITE_URL, priority: "1.0", changefreq: "daily" },
      { loc: `${SITE_URL}/privacy-policy`, priority: "0.3", changefreq: "monthly" },
      { loc: `${SITE_URL}/terms-and-conditions`, priority: "0.3", changefreq: "monthly" },
      { loc: `${SITE_URL}/refund-policy`, priority: "0.3", changefreq: "monthly" },
      { loc: `${SITE_URL}/cookie-policy`, priority: "0.3", changefreq: "monthly" },
    ];

    const tourPages = (products || []).map((product: Product) => {
      const slug = product.slug || generateSlug(product.name);
      const lastmod = product.updated_at ? product.updated_at.split("T")[0] : today;
      return {
        loc: `${SITE_URL}/tour/${encodeURIComponent(slug)}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod,
      };
    });

    const allPages = [...staticPages, ...tourPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <priority>1.0</priority>
  </url>
</urlset>`,
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/xml; charset=utf-8",
        },
        status: 200,
      }
    );
  }
});
