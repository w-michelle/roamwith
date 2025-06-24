import {
  Card,
  Cart,
  Category,
  Container,
  Image,
  Itinerary,
  Listing,
  User,
} from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeCategory = Omit<Category, "createdAt"> & {
  createdAt: string;
};

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
  images: Image[];
};

export type SafeCart = Omit<Cart, "createdAt" | "listings"> & {
  createdAt: string;
  listings: SafeListing[];
};

export type SafeImageListing = Omit<Listing, "images"> & {
  images: Image[];
};

export type SafeCard = Omit<Card, "listing" | "startTime" | "endTime"> & {
  listing: SafeImageListing;
  startTime: string | null;
  endTime: string | null;
};

export type SafeItinerary = Omit<
  Itinerary,
  "createdAt" | "startDate" | "endDate" | "cards" | "container"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  cards: SafeCard[];
  container: Container[];
};

export type SafeContainer = Omit<Container, "cards"> & {
  cards: SafeCard[];
};
export type SafeItinerary2 = Omit<
  Itinerary,
  "createdAt" | "startDate" | "endDate" | "cards" | "container"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  cards: SafeCard[];
  container: SafeContainer[];
};
