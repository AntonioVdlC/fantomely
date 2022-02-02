import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  // Default Plans
  const plans = [
    {
      name: "Free",
      stripePriceId: "$some_price_id_free",
      priceValueInUSD: 0,
      includeEventsMax: 10_000,
      includeUsersMax: 1,
      includeWebsitesMax: 1,
      includeCustomEvents: false,
    },
    {
      name: "Casper",
      stripePriceId: "$some_price_id_casper",
      priceValueInUSD: 99,
      includeEventsMax: 100_000,
      includeUsersMax: 1,
      includeWebsitesMax: 3,
      includeCustomEvents: false,
    },
    {
      name: "Stretch",
      stripePriceId: "$some_price_id_stretch",
      priceValueInUSD: 499,
      includeEventsMax: 1_000_000,
      includeUsersMax: 5,
      includeWebsitesMax: 5,
      includeCustomEvents: false,
    },
    {
      name: "Fatso",
      stripePriceId: "$some_price_id_fatso",
      priceValueInUSD: 999,
      includeEventsMax: 10_000_000,
      includeUsersMax: 10,
      includeWebsitesMax: 10,
      includeCustomEvents: false,
    },
    {
      name: "Stinkie",
      stripePriceId: "$some_price_id_stinkie",
      priceValueInUSD: 1999,
      includeEventsMax: 1_000_000_000,
      includeUsersMax: 1_000,
      includeWebsitesMax: 1_000,
      includeCustomEvents: true,
    },
  ];

  await Promise.all(
    plans.map((plan) => {
      return db.plan.create({
        data: {
          ...plan,
        },
      });
    })
  );
}

// TODO: add Stripe prices
// seed();
