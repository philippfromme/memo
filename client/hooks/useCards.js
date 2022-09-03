import { useQuery } from "@tanstack/react-query";

import { getCards } from "../api";

export default function useDeck(deckId) {
  let {
    status,
    data: cards,
    error,
    isFetching,
  } = useQuery(["decks", deckId, "cards"], () => getCards(deckId));

  return { status, cards, error, isFetching };
}
