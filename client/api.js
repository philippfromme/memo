/**
 * Get all decks.
 */
export async function getDecks() {
  const response = await fetch("/api/decks");

  if (response.ok) {
    const json = await response.json();

    return json;
  }

  return Promise.reject("Decks not found");
}

/**
 * Get deck with ID.
 */
export async function getDeck(deckId) {
  const response = await fetch(`/api/decks/${deckId}`);

  if (response.ok) {
    const json = await response.json();

    return json;
  }

  return Promise.reject("Deck not found");
}

/**
 * Create deck.
 */
export async function createDeck(options = {}) {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const response = await fetch("/api/decks", {
    method: "POST",
    headers,
    body: JSON.stringify({
      deck: options,
    }),
  });

  if (response.ok) {
    const json = await response.json();

    return json;
  }

  return Promise.reject("Deck not created");
}

/**
 * Update deck.
 */
export async function updateDeck(deckId, options = {}) {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const response = await fetch(`/api/decks/${deckId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      deck: options,
    }),
  });

  if (response.ok) {
    return true;
  }

  return Promise.reject("Deck not updated");
}

/**
 * Delete deck.
 */
export async function deleteDeck(deckId) {
  const response = await fetch(`/api/decks/${deckId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return true;
  }

  return Promise.reject("Deck not deleted");
}

/**
 * Get card with ID.
 */
export async function getCard(deckId, cardId) {
  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`);

  if (response.ok) {
    const json = await response.json();

    return json;
  }

  return Promise.reject("Card not found");
}

/**
 * Get cards or cards count for deck ID.
 */
export async function getCards(deckId, count = false) {
  const response = await fetch(`/api/decks/${deckId}/cards?count=${count}`);

  if (response.ok) {
    const json = await response.json();

    return json;
  }

  return Promise.reject("Cards not found");
}

/**
 * Create card.
 */
export async function createCard(options = {}, deckId) {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const response = await fetch(`/api/decks/${deckId}/cards`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      card: options,
    }),
  });

  if (response.ok) {
    const json = await response.json();

    return json;
  }

  return Promise.reject("Card not created");
}

/**
 * Update card.
 */
export async function updateCard(deckId, cardId, options = {}) {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      card: options,
    }),
  });

  if (response.ok) {
    return true;
  }

  return Promise.reject("Card not updated");
}

/**
 * Update cards.
 */
export async function updateCards(deckId, options = {}) {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");

  const response = await fetch(`/api/decks/${deckId}/cards`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      cards: options,
    }),
  });

  if (response.ok) {
    return true;
  }

  return Promise.reject("Cards not updated");
}

/**
 * Delete card.
 */
export async function deleteCard(deckId, cardId) {
  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return true;
  }

  return Promise.reject("Card not deleted");
}

/**
 * Delete cards.
 */
export async function deleteCards(deckId, cardIds) {
  const response = await fetch(
    `/api/decks/${deckId}/cards?cards=${cardIds.join(",")}`,
    {
      method: "DELETE",
    }
  );

  if (response.ok) {
    return true;
  }

  return Promise.reject("Cards not deleted");
}
