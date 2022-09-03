import React, { useEffect, useState } from "react";

import { ButtonSet, Button, Tile, Stack } from "carbon-components-react";

import {
  PlayFilledAlt,
  FaceDissatisfied,
  FaceSatisfied,
} from "@carbon/icons-react";

import { ANSWERS } from "../spacedRepetition";

import { speak } from "../speech";

export default function Card(props) {
  const { card, onAnswer } = props;

  const [revealedOnce, setRevealedOnce] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (revealed && !revealedOnce) setRevealedOnce(true);
  }, [revealed]);

  useEffect(() => {
    setRevealed(false);
    setRevealedOnce(false);
  }, [card]);

  const play = (event) => {
    if (event) event.stopPropagation();

    setPlaying(true);

    speak(card.back, card.targetLanguage).then(() => setPlaying(false));
  };

  useEffect(() => {
    if (revealedOnce) play();
  }, [revealedOnce]);

  return (
    <Stack gap={6}>
      {revealed ? (
        <Tile className="card card__back" onClick={() => setRevealed(false)}>
          <h1>{card.back}</h1>
          {card.description?.length ? <div className="card__description">{card.description}</div> : null}
          <div className="card__back-play-button">
            <Button
              label="Play"
              hasIconOnly
              renderIcon={PlayFilledAlt}
              kind="ghost"
              disabled={playing || !revealed}
              onClick={play}
            >
              <PlayFilledAlt />
            </Button>
          </div>
        </Tile>
      ) : (
        <Tile className="card card__front" onClick={() => setRevealed(true)}>
          <h1>{card.front}</h1>
        </Tile>
      )}
      {revealedOnce ? (
        <ButtonSet className="full-width-buttons">
          <Button
            size="xl"
            className="full-width-buttons__button"
            kind="danger"
            onClick={() => onAnswer(ANSWERS.NO)}
          >
            Bad
            <FaceDissatisfied size={20} />
          </Button>
          <Button
            size="xl"
            className="full-width-buttons__button"
            onClick={() => onAnswer(ANSWERS.YES)}
          >
            Good
            <FaceSatisfied size={20} />
          </Button>
        </ButtonSet>
      ) : null}
    </Stack>
  );
}
