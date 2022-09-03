import { useQuery } from "@tanstack/react-query";

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
    () => getCards(deckId),
    defaultOptions
  );

  return { status, cards, error, isFetching };
}
