import { useQuery } from "@tanstack/react-query";

import { getDeck } from "../api";

import { defaultOptions } from "./options";

export default function useDeck(deckId) {
  let {
    status,
    data: deck,
    error,
    isFetching,
  } = useQuery(["decks", deckId], () => getDeck(deckId), defaultOptions);

  return { status, deck, error, isFetching };
}
