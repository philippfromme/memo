import * as bcp47 from "bcp-47";

import { random } from "lodash";

const synth = window.speechSynthesis;

export function speak(text, language) {
  return new Promise((resolve) => {
    const speakText = new SpeechSynthesisUtterance(text.split('/').join(', '));

    speakText.voice = synth
      .getVoices()
      .find(
        ({ lang }) =>
          bcp47.parse(lang).language === bcp47.parse(language).language
      );

    speakText.rate = random(0.5, 0.9);

    speakText.pitch = 1;

    synth.speak(speakText);

    speakText.onerror = (error) => {
      throw error;
    };

    speakText.onend = () => {
      resolve();
    };
  });
}