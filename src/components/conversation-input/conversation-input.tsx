import { Icon } from "@/components/icon";
import { LanguageToggle } from "@/components/language-toggle";
import { VoiceRecordButton } from "@/components/voice-record-button";
import { sizes } from "@/constants/theme";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { i18n, type LanguageCode } from "@/lib/i18n/i18n";
import { useAppTheme } from "@/lib/theme/theme-provider";
import { useState } from "react";
import { Platform, Pressable, TextInput, View } from "react-native";

interface Props {
  language: LanguageCode;
  onToggleLanguage: () => void;
  onAddTextToSpeech: (text: string) => void;
  onAddSpeechToText: (text: string) => void;
}

const ConversationInput = (props: Props) => {
  const { language, onToggleLanguage, onAddTextToSpeech, onAddSpeechToText } =
    props;
  const direction = i18n.dir(language);
  const { colors } = useAppTheme();

  const [message, setMessage] = useState("");
  const { speak } = useSpeechSynthesis();
  const recognition = useSpeechRecognition({
    language,
    onFinalResult: onAddSpeechToText,
  });

  const send = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    onAddTextToSpeech(trimmed);
    speak(trimmed, language);
    setMessage("");
  };

  return (
    <View className="relative flex min-h-16 flex-row items-center gap-3 bg-background px-4 py-2 dark:bg-background-dark">
      <VoiceRecordButton
        isListening={recognition.isListening}
        errorMessage={recognition.errorMessage}
        partialTranscript={recognition.partialTranscript}
        onStart={recognition.start}
        onStop={recognition.stop}
      />
      <LanguageToggle language={language} onToggle={onToggleLanguage} />
      <TextInput
        className={`min-h-10 flex-1 rounded-3xl border border-neutral bg-neutral px-4 dark:border-neutral-dark dark:bg-neutral-dark ${Platform.OS === "ios" ? "py-auto" : "py-0"} text-base text-foreground dark:text-foreground-dark ${direction === "rtl" ? "text-end" : "text-start"}`}
        multiline
        placeholderTextColor={colors.muted}
        value={message}
        onChangeText={setMessage}
      />
      <Pressable
        className="h-10 w-10 items-center justify-center rounded-full bg-foreground dark:bg-foreground-dark"
        onPress={send}
      >
        <Icon
          name="arrow-forward-sharp"
          autoMirror
          size={sizes.icon.sm}
          color={colors.background}
        />
      </Pressable>
    </View>
  );
};

export { ConversationInput };
