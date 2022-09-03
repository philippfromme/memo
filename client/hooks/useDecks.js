import { useQuery } from "@tanstack/react-query";

import { getDecks } from "../api";

export default function useDecks() {
  let {
    status,
    data: decks = [],
    error,
    isFetching,
  } = useQuery(["decks"], getDecks);

  return { status, decks, error, isFetching };
}
