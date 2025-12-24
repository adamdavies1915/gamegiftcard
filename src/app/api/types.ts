export interface GameData {
  name: string;
  headerImage: string;
  shortDescription: string;
  storeId: string;
  store: "steam" | "epic" | "microsoft";
  storeUrl: string;
}
