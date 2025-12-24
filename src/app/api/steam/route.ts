import { NextRequest, NextResponse } from "next/server";
import { GameData } from "../types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const appId = searchParams.get("appId");

  if (!appId) {
    return NextResponse.json({ error: "App ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Steam API" },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!data[appId] || !data[appId].success) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const gameData = data[appId].data;

    const result: GameData = {
      name: gameData.name,
      headerImage: gameData.header_image,
      shortDescription: gameData.short_description,
      storeId: appId,
      store: "steam",
      storeUrl: `https://store.steampowered.com/app/${appId}`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Steam API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch game data" },
      { status: 500 }
    );
  }
}
