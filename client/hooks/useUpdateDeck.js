import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeck } from "../api";

export default function useUpdateDeck(deckId) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    (options) => updateDeck(deckId, options),
    {
      onMutate: async (options) => {
        await queryClient.cancelQueries(["decks", deckId]);

        const previousDeck = queryClient.getQueryData(["decks", deckId]);

        queryClient.setQueryData(["decks", deckId], (old = {}) => {
          return {
            ...old,
            ...options,
          };
        });

        return { previousDeck };
      },
      onError: (err, options, context) => {
        queryClient.setQueryData(["decks", deckId], context.previousDeck);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["decks", deckId]);
      },
    }
  );

  return (options) => mutateAsync(options);
}
