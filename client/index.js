import React from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import { Button, Stack, Tile } from "carbon-components-react";

import App from "./components/App";
import CreateCard from "./components/CreateCard";
import CreateDeck from "./components/CreateDeck";
import Deck from "./components/Deck";
import Decks from "./components/Decks";
import PracticeDeck from "./components/PracticeDeck";
import UpdateCard from "./components/UpdateCard";
import UpdateDeck from "./components/UpdateDeck";

import "./index.scss";

const container = document.getElementById("app");

const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Decks />} />
        <Route path="create-card" element={<CreateCard />} />
        <Route path="create-deck" element={<CreateDeck />} />
        <Route path="decks">
          <Route index element={<Decks />} />
          <Route path=":deckId">
            <Route index element={<Deck />} />
            <Route path="cards">
              <Route path=":cardId">
                <Route path="update" element={<UpdateCard />} />
              </Route>
            </Route>
            <Route path="practice" element={<PracticeDeck />} />
            <Route path="update" element={<UpdateDeck />} />
          </Route>
        </Route>
        <Route path="*" element={<Empty />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

function Empty() {
  const navigate = useNavigate();

  return (
    <Tile>
      <Stack gap={6}>
        <h2>This page doesn't exist.</h2>
        <Button onClick={() => navigate("/")}>Back</Button>
      </Stack>
    </Tile>
  );
}

console.log(`Memo v${process.env.APP_VERSION}`);
