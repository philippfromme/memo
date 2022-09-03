import { useQuery } from "@tanstack/react-query";

import { getDecks } from "../api";

import { defaultOptions } from "./options";

export default function useDecks() {
  let {
    status,
    data: decks = [],
    error,
    isFetching,
  } = useQuery(["decks"], getDecks, defaultOptions);

  return { status, decks, error, isFetching };
}
