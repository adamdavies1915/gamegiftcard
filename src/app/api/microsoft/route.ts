import { NextRequest, NextResponse } from "next/server";
import { GameData } from "../types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    // Microsoft Store API endpoint for product details
    const response = await fetch(
      `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${productId}&market=US&languages=en-us`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Microsoft Store API" },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!data.Products || data.Products.length === 0) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const product = data.Products[0];
    const localizedProps = product.LocalizedProperties?.[0];

    if (!localizedProps) {
      return NextResponse.json({ error: "Game data not available" }, { status: 404 });
    }

    // Find the best image (prefer SuperHeroArt or Poster)
    const images = localizedProps.Images || [];
    const headerImage = images.find(
      (img: { ImagePurpose: string }) =>
        img.ImagePurpose === "SuperHeroArt" ||
        img.ImagePurpose === "Poster" ||
        img.ImagePurpose === "BoxArt"
    ) || images.find(
      (img: { ImagePurpose: string }) => img.ImagePurpose === "Screenshot"
    ) || images[0];

    // Build image URL - Microsoft images need the Uri prefix
    let imageUrl = "";
    if (headerImage?.Uri) {
      imageUrl = headerImage.Uri.startsWith("//")
        ? `https:${headerImage.Uri}`
        : headerImage.Uri;
    }

    const result: GameData = {
      name: localizedProps.ProductTitle,
      headerImage: imageUrl,
      shortDescription: localizedProps.ShortDescription || localizedProps.ProductDescription?.substring(0, 200) || "",
      storeId: productId,
      store: "microsoft",
      storeUrl: `https://www.xbox.com/games/store/${localizedProps.ProductTitle?.toLowerCase().replace(/\s+/g, "-")}/${productId}`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Microsoft Store API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch game data" },
      { status: 500 }
    );
  }
}
