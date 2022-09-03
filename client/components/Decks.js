import React from "react";

import { useNavigate } from "react-router-dom";

import { Button, ClickableTile, Loading, Stack } from "carbon-components-react";

import { Menu } from "@carbon/icons-react";

import classNames from "classnames";

import Error from "./Error";

import useDecks from "../hooks/useDecks";

export default function Decks() {
  const navigate = useNavigate();

  const { decks, error, isFetching } = useDecks();

  if (error) {
    return <Error error={error} />;
  }

  if (isFetching) {
    return <Loading />;
  }

  return (
    <Stack gap={6} className="decks">
      <Stack gap={6} className="decks__list">
        <h1>Decks</h1>
        {decks.map((deck) => {
          const hasCardsDue = deck.cardsCount.due > 0;

          return (
            <ClickableTile
              className={classNames("decks__list-deck", {
                "decks__list-deck--due": hasCardsDue,
              })}
              key={deck._id}
              onClick={() => navigate(`/decks/${deck._id}`)}
            >
              <h2>{deck.name}</h2>
              <div className="decks__list-deck-cards-count">
                <h2>{hasCardsDue ? deck.cardsCount.due : deck.cardsCount.all}</h2>
                <Menu style={{ justifySelf: "flex-end" }} size={34} />
              </div>
            </ClickableTile>
          );
        })}
      </Stack>
      <Button kind="primary" onClick={() => navigate("/create-deck")}>
        Create Deck
      </Button>
    </Stack>
  );
}
