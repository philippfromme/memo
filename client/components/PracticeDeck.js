import React, { useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Button, Loading, Stack, Tile } from "carbon-components-react";

import { Close } from "@carbon/icons-react";

import { debounce } from "lodash";

import dayjs from "dayjs";

import Card from "./Card";

import useCards from "../hooks/useCards";
import useDeck from "../hooks/useDeck";
import useUpdateCards from "../hooks/useUpdateCards";

import { SpacedRepetition } from "../spacedRepetition";

export default function PracticeDeck() {
  let navigate = useNavigate();

  const { deckId } = useParams();

  const {
    cards,
    error: cardsError,
    isFetching: isFetchingCards,
  } = useCards(deckId);

  const {
    deck,
    error: deckError,
    isFetching: isFetchingDeck,
  } = useDeck(deckId);

  const error = cardsError || deckError;
  const isFetching = isFetchingCards || isFetchingDeck;

  const [cardsFetched, setCardsFetched] = useState(false);

  useEffect(() => {
    if (cards) {
      setSpacedRepetition(
        new SpacedRepetition(cards.filter((card) => !isPaused(card)))
      );

      setCardsFetched(true);
    }
  }, [cards]);

  const [spacedRepetition, setSpacedRepetition] = useState(null);

  const [isUpdatingCards, setIsUpdatingCards] = useState(false);
  const [cardUpdates, setCardUpdates] = useState({});

  const updateCards = useUpdateCards(deckId);

  const updateCardsDebounced = useCallback(debounce((foo) => {
    if (Object.keys(foo).length) {
      updateCards(foo);
    }
  }, 5000), []);

  useEffect(() => updateCardsDebounced(cardUpdates), [cardUpdates]);

  const onClose = async () => {
    setIsUpdatingCards(true);

    updateCardsDebounced.cancel();

    if (Object.keys(cardUpdates).length) {
      await updateCards(cardUpdates);
    }

    navigate(-1);
  };

  const onAnswer = (answer) => {
    const card = spacedRepetition.getCard();

    setCardUpdates({
      ...cardUpdates,
      [card._id]: {
        ...spacedRepetition.answerCard(answer),
        modified: dayjs().toISOString(),
      },
    });
  };

  if (error) {
    return (
      <Tile>
        <Stack gap={6}>
          <h2>{error.message}</h2>
          <Button onClick={() => navigate("/")}>Back</Button>
        </Stack>
      </Tile>
    );
  }

  const loading = isUpdatingCards || (isFetching && !cardsFetched);

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack gap={6} className="practice-deck">
      <div className="page__header">
        <h2>{deck.name}</h2>
        <Button
          renderIcon={Close}
          kind="secondary"
          iconDescription="Exit"
          hasIconOnly
          onClick={onClose}
        ></Button>
      </div>
      {spacedRepetition?.getCard() ? (
        <Card card={spacedRepetition.getCard()} onAnswer={onAnswer} />
      ) : null}
    </Stack>
  );
}

function isPaused(card) {
  const { paused = false } = card;

  return paused;
}
