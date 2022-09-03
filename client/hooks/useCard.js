import { useQuery } from "@tanstack/react-query";

import { getCard } from "../api";

export default function useCard(deckId, cardId) {
  let {
    status,
    data: card,
    error,
    isFetching,
  } = useQuery(["decks", deckId, "cards", cardId], () =>
    getCard(deckId, cardId)
  );

  return { status, card, error, isFetching };
}
