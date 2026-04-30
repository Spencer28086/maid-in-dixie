import { SquareClient } from "square";

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
});

export const locationId = process.env.SQUARE_LOCATION_ID!;
