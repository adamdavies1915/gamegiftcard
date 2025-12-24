import { NextRequest, NextResponse } from "next/server";
import { GameData } from "../types";

interface EpicKeyImage {
  type: string;
  url: string;
}

interface EpicGame {
  title: string;
  description: string;
  keyImages: EpicKeyImage[];
  productSlug: string | null;
  urlSlug: string;
  catalogNs?: {
    mappings?: Array<{ pageSlug: string }>;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Game slug is required" }, { status: 400 });
  }

  try {
    const searchTerms = slug.replace(/-/g, " ");

    // Use Epic's catalog API that returns many games
    const response = await fetch(
      `https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Epic Games Store is currently unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const elements = data?.data?.Catalog?.searchStore?.elements as EpicGame[] | undefined;

    if (!elements || elements.length === 0) {
      return NextResponse.json(
        { error: "Could not load Epic Games catalog" },
        { status: 502 }
      );
    }

    // Search for matching game by slug or title
    const game = elements.find((g) => {
      const slugLower = slug.toLowerCase();
      const searchLower = searchTerms.toLowerCase();

      return (
        g.urlSlug?.toLowerCase() === slugLower ||
        g.urlSlug?.toLowerCase().includes(slugLower) ||
        g.productSlug?.toLowerCase().includes(slugLower) ||
        g.title?.toLowerCase() === searchLower ||
        g.title?.toLowerCase().includes(searchLower) ||
        g.catalogNs?.mappings?.some(m => m.pageSlug?.toLowerCase().includes(slugLower))
      );
    });

    if (!game) {
      // Return available games hint
      const availableGames = elements
        .filter(g => g.urlSlug && g.title)
        .slice(0, 5)
        .map(g => g.title)
        .join(", ");

      return NextResponse.json(
        {
          error: `Game "${searchTerms}" not found. Try one of the featured games: ${availableGames}`
        },
        { status: 404 }
      );
    }

    // Find the best image
    const headerImage = game.keyImages?.find(
      (img) => img.type === "OfferImageWide" || img.type === "DieselStoreFrontWide"
    )?.url || game.keyImages?.find(
      (img) => img.type === "featuredMedia" || img.type === "Thumbnail"
    )?.url || game.keyImages?.[0]?.url || "";

    const pageSlug = game.catalogNs?.mappings?.[0]?.pageSlug ||
                     game.productSlug?.split("/")[0] ||
                     game.urlSlug ||
                     slug;

    const result: GameData = {
      name: game.title,
      headerImage: headerImage,
      shortDescription: game.description?.substring(0, 200) || "",
      storeId: slug,
      store: "epic",
      storeUrl: `https://store.epicgames.com/p/${pageSlug}`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Epic Games API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Epic Games Store" },
      { status: 500 }
    );
  }
}
