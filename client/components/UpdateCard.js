import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  ButtonSet,
  Checkbox,
  FormGroup,
  InlineNotification,
  Loading,
  Stack,
  TextArea,
  TextInput,
} from "carbon-components-react";

import { Close, TrashCan } from "@carbon/icons-react";

import Error from "./Error";
import TagsInput from "./TagsInput";

import useCard from "../hooks/useCard";
import useDeleteCards from "../hooks/useDeleteCards";
import useUpdateCards from "../hooks/useUpdateCards";

export default function CreateCard() {
  const { cardId, deckId } = useParams();

  const navigate = useNavigate();

  const { card, error, isFetching } = useCard(deckId, cardId);

  const [sucess, setSuccess] = useState(false);

  const [front, setFront] = useState("");
  const [tags, setTags] = useState([]);
  const [back, setBack] = useState("");
  const [description, setDescription] = useState("");
  const [paused, setPaused] = useState(false);

  const [frontInvalid, setFrontInvalid] = useState(false);
  const [backInvalid, setBackInvalid] = useState(false);

  useEffect(() => {
    if (!card) return;

    setFront(card.front);
    setBack(card.back);
    setDescription(card.description);
    setTags(card.tags);
    setPaused(card.paused || false);
  }, [card]);

  const updateCards = useUpdateCards(deckId);

  const onUpdate = async () => {
    if (!front.length) setFrontInvalid(true);

    if (!back.length) setBackInvalid(true);

    if (!front.length || !back.length) return;

    setSuccess(false);

    let options = {
      front,
      back,
      tags,
      paused,
    };

    const success = await updateCards({
      [card._id]: options,
    });

    console.log('success', success);

    if (success) {
      setSuccess(true);
    }
  };

  const onExit = () => navigate(-1);

  const deleteCards = useDeleteCards(deckId);

  const onDelete = async () => {
    const success = await deleteCards([cardId]);

    if (success) {
      navigate(-1);
    }
  };

  if (error) {
    return <Error error={error} />;
  }

  if (isFetching) {
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
          title="Card updated"
        />
      ) : null}
      <div className="page__header">
        <h1>Update Card</h1>
        <ButtonSet>
          <Button
            renderIcon={TrashCan}
            kind="ghost"
            iconDescription="Delete"
            tooltipPosition="right"
            hasIconOnly
            onClick={onDelete}
          ></Button>
          <Button
            renderIcon={Close}
            kind="secondary"
            iconDescription="Exit"
            tooltipPosition="right"
            hasIconOnly
            onClick={onExit}
          ></Button>
        </ButtonSet>
      </div>
      <FormGroup legendText="">
        <Stack>
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
          <Checkbox
            checked={paused}
            labelText={`Paused`}
            id="checkbox-label-1"
            onChange={({ target }) => {
              setSuccess(false);
              setPaused(!paused);
            }}
          />
        </Stack>
      </FormGroup>
      <Button onClick={onUpdate}>Update</Button>
    </Stack>
  );
}
