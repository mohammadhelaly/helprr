import { ScrollView, Text, View } from "react-native";

import type { LegalDocumentData } from "@/data/legal/legal-document-data";

type Props = {
  document: LegalDocumentData;
};

const LegalDocumentContent = (props: Props) => {
  const { document } = props;

  return (
    <ScrollView className="flex-1" contentContainerClassName="items-center">
      <View className="w-full max-w-screen-sm px-4">
        <Text className="mt-4 text-2xl font-bold text-foreground dark:text-foreground-dark">
          {document.title}
        </Text>
        <Text className="mt-2 text-xs font-semibold text-muted dark:text-muted-dark">
          {document.status}
        </Text>
        <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
          Last updated: {document.updatedAt}
        </Text>

        <View className="py-4">
          {document.sections.map((section) => (
            <View className="mb-5 gap-2" key={section.heading}>
              <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
                {section.heading}
              </Text>
              {section.body.map((paragraph) => (
                <Text
                  className="text-sm leading-5 text-foreground dark:text-foreground-dark"
                  key={paragraph}
                >
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export { LegalDocumentContent };
