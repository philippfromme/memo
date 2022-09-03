import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

import { toUTCDate } from "./date";

dayjs.extend(relativeTime);

export const ANSWERS = {
  YES: "YES",
  NO: "NO",
};

export function isDueEarlier(a, b) {
  if (!a) return true;
  if (!b) return false;

  return dayjs(a).diff(b) < 0;
}

const intervals = [
  [1, "minute"],
  [10, "minutes"],
  [1, "hour"],
  [10, "hours"],
  [1, "day"],
  [10, "days"],
];

function updateSpacedRepetition(level = 0, answer) {
  if (answer === ANSWERS.NO) {
    return {
      level: 0,
      dueDate: toUTCDate(dayjs().add(...intervals[0])),
    };
  }

  const newLevel = Math.min(5, level + 1);

  return {
    level: newLevel,
    dueDate: toUTCDate(dayjs().add(...intervals[newLevel])),
  };
}

export class SpacedRepetition {
  constructor(cards) {
    this._cards = cards;
  }

  getCard() {
    if (this._cards.length === 1) {
      return this._cards[0];
    }

    const card = this._cards.find((card) => !card.dueDate);

    if (card) {
      return card;
    }

    return this._cards.reduce((cardDueEarliest, card) => {
      if (cardDueEarliest === null || isDueEarlier(card.dueDate, cardDueEarliest.dueDate)) {
        return card;
      }

      return cardDueEarliest;
    }, null);
  }

  answerCard(answer) {
    const card = this.getCard();

    const spacedRepetition = updateSpacedRepetition(card.level, answer);

    Object.assign(card, spacedRepetition);

    return spacedRepetition;
  }
}

export function isPaused(card) {
  const { paused = false } = card;

  return paused;
}
