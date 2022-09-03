import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCards } from "../api";

export default function useDeleteCards(deckId) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    (cardIds) => deleteCards(deckId, cardIds),
    {
      onMutate: async (cardIds) => {
        await queryClient.cancelQueries(["decks", deckId, "cards"]);

        const previousCards = queryClient.getQueryData(["decks", deckId, "cards"]);

        queryClient.setQueryData(["decks", deckId, "cards"], (old = []) =>
          old.filter((card) => !cardIds.includes(card._id))
        );

        return { previousCards };
      },
      onError: (err, cardIds, context) => {
        queryClient.setQueryData(["decks", deckId, "cards"], context.previousCards);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["decks", deckId, "cards"]);
      },
    }
  );

  return (cardIds) => mutateAsync(cardIds);
}
