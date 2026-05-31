import { useCallback, useEffect, useState } from "react";
import * as Speech from "expo-speech";

import type { LanguageCode } from "@/lib/i18n/i18n";

const useSpeechSynthesis = () => {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = useCallback(
    async (text: string, language: LanguageCode, id?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      await Speech.stop();
      setSpeakingId(id ?? null);
      Speech.speak(trimmed.slice(0, Speech.maxSpeechInputLength), {
        language,
        pitch: 1,
        rate: 1,
        onDone: () => setSpeakingId(null),
        onStopped: () => setSpeakingId(null),
        onError: () => setSpeakingId(null),
      });
    },
    [],
  );

  const stop = useCallback(async () => {
    await Speech.stop();
    setSpeakingId(null);
  }, []);

  return { speak, stop, speakingId };
};

export { useSpeechSynthesis };
