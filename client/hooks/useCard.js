import { useQuery } from "@tanstack/react-query";

import { getCard } from "../api";

import { defaultOptions } from "./options";

export default function useCard(deckId, cardId) {
  let {
    status,
    data: card,
    error,
    isFetching,
  } = useQuery(
    ["decks", deckId, "cards", cardId],
    () => getCard(deckId, cardId),
    defaultOptions
  );

  return { status, card, error, isFetching };
}
