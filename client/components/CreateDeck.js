import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Button,
  ButtonSet,
  FormGroup,
  TextInput,
  Stack,
} from "carbon-components-react";

import { Close } from "@carbon/icons-react";

import * as api from "../api";

export default function CreateDeck() {
  let navigate = useNavigate();

  const [name, setName] = useState("");

  const onCreate = async () => {
    const newDeck = await api.createDeck({
      name,
    });

    if (newDeck) {
      navigate(-1);
    }
  };

  const onExit = () => navigate(-1);

  return (
    <Stack gap={6}>
      <div className="page__header">
        <h1>Create Deck</h1>
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
              setName(target.value);
            }}
          />
        </Stack>
      </FormGroup>
      <Button onClick={onCreate}>Create</Button>
    </Stack>
  );
}
