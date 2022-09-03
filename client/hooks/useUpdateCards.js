import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCards } from "../api";

export default function useUpdateCards(deckId) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    (options) => updateCards(deckId, options),
    {
      onMutate: async (options) => {
        await queryClient.cancelQueries(["decks", deckId, "cards"]);

        const previousCards = queryClient.getQueryData(["decks", deckId, "cards"]);

        const cardIds = Object.keys(options);

        queryClient.setQueryData(["decks", deckId, "cards"], (old = []) =>
          old.map((card) => {
            if (cardIds.includes(card._id)) {
              return {
                ...card,
                ...options[card._id],
              };
            }

            return card;
          })
        );

        return { previousCards };
      },
      onError: (err, options, context) => {
        queryClient.setQueryData(["decks", deckId, "cards"], context.previousCards);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["decks", deckId]);
        queryClient.invalidateQueries(["decks", deckId, "cards"]);
      },
    }
  );

  return (options) => mutateAsync(options);
}
