import { useQuery } from "@tanstack/react-query";

import { getDeck } from "../api";

export default function useDeck(deckId) {
  let {
    status,
    data: deck,
    error,
    isFetching,
  } = useQuery(["decks", deckId], () => getDeck(deckId));

  return { status, deck, error, isFetching };
}
