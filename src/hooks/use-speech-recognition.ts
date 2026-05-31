import { useCallback, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  type ExpoSpeechRecognitionErrorEvent,
  type ExpoSpeechRecognitionResultEvent,
} from "expo-speech-recognition";

import { speechRecognitionLocales } from "@/constants/language";
import type { LanguageCode } from "@/lib/i18n/i18n";

type RecognitionStatus = "idle" | "listening" | "error" | "permission-denied";

interface Options {
  language: LanguageCode;
  onFinalResult: (text: string) => void;
}

const useSpeechRecognition = (options: Options) => {
  const [status, setStatus] = useState<RecognitionStatus>("idle");
  const [partialTranscript, setPartialTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useSpeechRecognitionEvent("start", () => {
    setStatus("listening");
    setErrorMessage(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setStatus("idle");
  });

  useSpeechRecognitionEvent(
    "result",
    (event: ExpoSpeechRecognitionResultEvent) => {
      const transcript = event.results[0]?.transcript?.trim() ?? "";
      setPartialTranscript(transcript);

      if (event.isFinal && transcript) {
        options.onFinalResult(transcript);
        setPartialTranscript("");
      }
    },
  );

  useSpeechRecognitionEvent(
    "error",
    (event: ExpoSpeechRecognitionErrorEvent) => {
      setStatus(event.error === "not-allowed" ? "permission-denied" : "error");
      setErrorMessage(event.message || event.error);
    },
  );

  const start = useCallback(async () => {
    setErrorMessage(null);
    setPartialTranscript("");

    const permission =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setStatus("permission-denied");
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: speechRecognitionLocales[options.language],
      interimResults: true,
      maxAlternatives: 1,
      addsPunctuation: true,
    });
  }, [options.language]);

  const stop = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  return {
    status,
    partialTranscript,
    errorMessage,
    isListening: status === "listening",
    start,
    stop,
  };
};

export { useSpeechRecognition };
