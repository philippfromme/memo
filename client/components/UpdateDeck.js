import React, { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  FormGroup,
  InlineNotification,
  Loading,
  TextInput,
  Stack,
} from "carbon-components-react";

import { Close } from "@carbon/icons-react";

import Error from "./Error";

import useDeck from "../hooks/useDeck";
import useUpdateDeck from "../hooks/useUpdateDeck";

export default function UpdateDeck() {
  let navigate = useNavigate();

  const { deckId } = useParams();

  const { deck, error, isFetching } = useDeck(deckId);

  const [name, setName] = useState("");
  const [updatingDeck, setUpdatingDeck] = useState(false);
  const [sucess, setSuccess] = useState(false);

  const updateDeck = useUpdateDeck(deckId);

  const onUpdate = async () => {
    setSuccess(false);

    let options = {
      name
    };

    const success = await updateDeck(options);

    if (success) {
      setSuccess(true);
    }
  };

  const onExit = () => navigate(-1);

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
          title="Deck updated"
        />
      ) : null}
      <div className="page__header">
        <h1>Update Deck</h1>
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
          <TextInput
            spellCheck="false"
            autoComplete="off"
            id="name"
            value={name}
            labelText="Name"
            onInput={({ target }) => {
              setSuccess(false);
              setName(target.value);
            }}
          />
        </Stack>
      </FormGroup>
      <Button onClick={onUpdate}>Update</Button>
    </Stack>
  );
}
