import React from "react";

import { useNavigate } from "react-router-dom";

import { Button, Stack, Tile } from "carbon-components-react";

import { ErrorOutline } from "@carbon/icons-react";

import { isNull } from "lodash";

export default function Error(props) {
  const { error = {} } = props;

  let message = 'Unknown error';

  if (!isNull(error)) {
    (message = { error });
  }

  const navigate = useNavigate();

  return (
    <Tile className="error">
      <Stack gap={6}>
        <h2>
          <ErrorOutline size={22} className="error__icon" />
          {message}
        </h2>
        <Button kind="tertiary" onClick={() => navigate("/")}>Back</Button>
      </Stack>
    </Tile>
  );
}
