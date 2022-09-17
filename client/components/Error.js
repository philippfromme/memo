import React from "react";

import { useNavigate } from "react-router-dom";

import { Button, Stack, Tile } from "carbon-components-react";

import { ErrorOutline } from "@carbon/icons-react";

export default function Error(props) {
  const { error = 'Unknown error' } = props;

  const navigate = useNavigate();

  return (
    <Tile className="error">
      <Stack gap={6}>
        <h2>
          <ErrorOutline size={22} className="error__icon" />
          {error}
        </h2>
        <Button kind="tertiary" onClick={() => navigate("/")}>Back</Button>
      </Stack>
    </Tile>
  );
}
