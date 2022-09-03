import React, { useEffect, useState } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

import {
  Button,
  Dropdown,
  FormGroup,
  Loading,
  InlineNotification,
  Stack,
  TextArea,
  TextInput,
} from "carbon-components-react";

import { Close } from "@carbon/icons-react";

import { matchesProperty, sortBy } from "lodash";

import Error from "./Error";
import TagsInput from "./TagsInput";

import useDecks from "../hooks/useDecks";

import { createCard } from '../api'

export default function CreateCard() {
  const [search, _] = useSearchParams();

  const deckId = search.get("deck");

  const navigate = useNavigate();

  const { decks, error, isFetching } = useDecks();

  const [creatingCard, setCreatingCard] = useState(false);
  const [sucess, setSuccess] = useState(false);

  const [deck, setDeck] = useState(deckId);
  const [front, setFront] = useState("");
  const [tags, setTags] = useState([]);
  const [back, setBack] = useState("");
  const [description, setDescription] = useState("");

  const [frontInvalid, setFrontInvalid] = useState(false);
  const [backInvalid, setBackInvalid] = useState(false);

  const loading = creatingCard || isFetching;

  useEffect(() => {
    if (decks.length && !deck) {
      setDeck(decks[0].id);
    }
  }, [decks]);

  const onCreate = async () => {
    if (!front.length) setFrontInvalid(true);

    if (!back.length) setBackInvalid(true);

    if (!front.length || !back.length) return;

    setSuccess(false);
    setCreatingCard(true);

    let options = {
      front,
      back,
    };

    if (description.length) {
      options = {
        ...options,
        description,
      };
    }

    if (tags.length) {
      options = {
        ...options,
        tags,
      };
    }

    const card = await createCard(options, deck);

    if (card) {
      setSuccess(true);
    }

    setCreatingCard(false);

    setFront("");
    setBack("");
    setDescription("");
  };

  const onExit = () => navigate(-1);

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack gap={6}>
      {sucess ? (
        <InlineNotification
          style={{ maxWidth: "100%" }}
          kind="success"
          onClose={() => setSuccess(false)}
          onCloseButtonClick={() => setSuccess(false)}
          statusIconDescription="notification"
          title="Card created"
        />
      ) : null}
      <div className="page__header">
        <h1>Create Card</h1>
        <Button
          renderIcon={Close}
          kind="secondary"
          iconDescription="Exit"
          tooltipPosition="right"
          hasIconOnly
          onClick={onExit}
        ></Button>
      </div>
      <FormGroup legendText="">
        <Stack>
          <Dropdown
            id="deck"
            titleText="Deck"
            selectedItem={decks.find(matchesProperty("_id", deckId))}
            items={sortBy(decks, (deck) => deck.name.toLowerCase().trim())}
            itemToString={({ name }) => name}
            onChange={({ selectedItem }) => {
              setSuccess(false);
              setDeck(selectedItem);
            }}
            label="Deck"
          />
          <TextInput
            invalid={frontInvalid}
            invalidText="Required"
            spellCheck="false"
            autoComplete="off"
            id="front"
            value={front}
            labelText="Front"
            onInput={({ target }) => {
              setSuccess(false);
              setFront(target.value);

              if (target.value.length) setFrontInvalid(false);
            }}
          />
          <TextInput
            invalid={backInvalid}
            invalidText="Required"
            spellCheck="false"
            autoComplete="off"
            id="back"
            value={back}
            labelText="Back"
            onInput={({ target }) => {
              setSuccess(false);
              setBack(target.value);

              if (target.value.length) setBackInvalid(false);
            }}
          />
          <TextArea
            spellCheck="false"
            autoComplete="off"
            id="description"
            value={description}
            labelText="Description"
            onInput={({ target }) => {
              setSuccess(false);
              setDescription(target.value);
            }}
          />
          <TagsInput
            tags={tags}
            onChange={(tags) => {
              setSuccess(false);
              setTags(tags);
            }}
          />
        </Stack>
      </FormGroup>
      <Button onClick={onCreate}>Create</Button>
    </Stack>
  );
}
