import { useQuery } from "@tanstack/react-query";

import { sortBy } from "lodash";

import { getCards } from "../api";

import { defaultOptions } from "./options";

export default function useDeck(deckId) {
  let {
    status,
    data: cards,
    error,
    isFetching,
  } = useQuery(
    ["decks", deckId, "cards"],
    async () => {
      const cards = await getCards(deckId);

      return sortBy(cards, "front");
    },
    defaultOptions
  );

  return { status, cards, error, isFetching };
}
