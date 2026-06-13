export type LegalDocumentSection = {
  heading: string;
  body: string[];
};

export type LegalDocumentData = {
  title: string;
  status: string;
  updatedAt: string;
  sections: LegalDocumentSection[];
};

export const privacyPolicyDocumentData: LegalDocumentData = {
  title: "Privacy Policy",
  status: "Effective May 24, 2026.",
  updatedAt: "June 13, 2026",
  sections: [
    {
      heading: "Who provides Helprr",
      body: [
        "Helprr is provided by Mohammad Helaly. Privacy questions can be sent to mohammad.helaly@outlook.com. Public project and support information is available at https://helaly.vercel.app.",
      ],
    },
    {
      heading: "Data Helprr handles",
      body: [
        "Helprr may process typed text, dictated speech text, spoken playback text, conversation history, selected language settings, microphone input for speech recognition, and camera input when camera features are enabled.",
        "Current app conversations are stored locally on the device. The current app does not include a Helprr account system, Helprr backend, advertising SDK, analytics SDK, or remote sync service.",
      ],
    },
    {
      heading: "Speech recognition and speech output",
      body: [
        "When speech recognition is used, audio may be processed by the operating system or speech recognition provider available on the device. Helprr should disclose the exact platform behavior for iOS and Android after physical-device testing.",
        "When text-to-speech is used, text is provided to the device speech service so it can be spoken aloud.",
      ],
    },
    {
      heading: "Camera access",
      body: [
        "Helprr requests camera permission only for features that need camera input. If object detection or image understanding is added later, update this policy to explain whether images are processed on device, sent to a server, retained, or shared.",
      ],
    },
    {
      heading: "How data is used",
      body: [
        "Data is used to provide accessibility-support features such as speech-to-text, text-to-speech, conversation history, language selection, and camera-based assistance when enabled.",
        "Do not use collected data for advertising, profiling, sale, or unrelated analytics unless this policy, store disclosures, consent flows, and the app implementation are updated first.",
      ],
    },
    {
      heading: "Sharing",
      body: [
        "Helprr does not currently sell personal data. Helprr does not currently share user content with a Helprr backend because no backend is currently included.",
        "Device operating systems, app stores, and speech services may process data as needed to provide permissions, downloads, updates, crash handling, speech recognition, and speech output. Review and disclose each provider before release.",
      ],
    },
    {
      heading: "Retention and deletion",
      body: [
        "Conversation history remains on the device until the user deletes it through app functionality, app storage controls, or by uninstalling the app. Before release, verify the exact deletion paths and add any missing in-app deletion controls.",
      ],
    },
    {
      heading: "Children",
      body: [
        "Helprr is not currently intended for children under 13. If the app will be offered to children or families, complete a separate legal review for child privacy, parental consent, and store family policies.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "For privacy questions, contact mohammad.helaly@outlook.com or visit https://helaly.vercel.app.",
      ],
    },
  ],
};

export const termsOfUseDocumentData: LegalDocumentData = {
  title: "Terms of Use",
  status: "Effective May 24, 2026.",
  updatedAt: "June 13, 2026",
  sections: [
    {
      heading: "Acceptance",
      body: [
        "By using Helprr, users agree to these Terms. If they do not agree, they should not use the app.",
      ],
    },
    {
      heading: "Purpose",
      body: [
        "Helprr provides accessibility-support tools such as speech-to-text, text-to-speech, local conversation history, language selection, and camera-based assistance when enabled.",
      ],
    },
    {
      heading: "No emergency or professional reliance",
      body: [
        "Helprr is not an emergency service, medical device, legal service, safety system, navigation system, or substitute for professional support. Users should not rely on Helprr where an error, delay, missed transcription, incorrect speech output, or incorrect camera result could cause harm.",
      ],
    },
    {
      heading: "User responsibility",
      body: [
        "Users are responsible for checking outputs before relying on them, using the app lawfully, and respecting the privacy and rights of other people when recording speech, entering text, or using camera features.",
      ],
    },
    {
      heading: "Open source license",
      body: [
        "Helprr source code is licensed under the MIT License unless a file says otherwise. Third-party dependencies remain under their own licenses and are listed in Acknowledgements.",
      ],
    },
    {
      heading: "No warranties",
      body: [
        "Helprr is provided as is and as available. To the maximum extent permitted by law, Helprr makes no warranties that the app will be uninterrupted, accurate, accessible in every situation, or free from defects.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the maximum extent permitted by law, Helprr and its contributors are not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the app. Have counsel adapt this clause for the app's distribution countries.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "For legal questions, contact mohammad.helaly@outlook.com or visit https://helaly.vercel.app.",
      ],
    },
  ],
};

export const safetyNoticeDocumentData: LegalDocumentData = {
  title: "Safety Notice",
  status: "Effective May 24, 2026.",
  updatedAt: "June 13, 2026",
  sections: [
    {
      heading: "Use as assistance only",
      body: [
        "Helprr is an assistance tool. Speech recognition, speech output, translations between language settings, camera previews, and future object detection may be incomplete, delayed, unavailable, or wrong.",
      ],
    },
    {
      heading: "High-risk situations",
      body: [
        "Do not use Helprr as the only source of information in traffic, medical, emergency, financial, legal, security, navigation, or other high-risk situations.",
      ],
    },
    {
      heading: "Permissions",
      body: [
        "Microphone, speech recognition, and camera permissions can be revoked in system settings. Some features will not work without the relevant permission.",
      ],
    },
    {
      heading: "Device testing",
      body: [
        "Before release, test safety-critical wording, permission prompts, speech recognition behavior, and speech output on physical iOS and Android devices.",
      ],
    },
  ],
};

export const dataPracticesDocumentData: LegalDocumentData = {
  title: "Store Disclosure Notes",
  status: "Current as of May 24, 2026.",
  updatedAt: "June 13, 2026",
  sections: [
    {
      heading: "Apple App Store Connect",
      body: [
        "Add a working public Privacy Policy URL in App Store Connect and make the same policy easily accessible in the app.",
        "Complete App Privacy answers for microphone audio, speech recognition text, camera data, diagnostics, identifiers, and any future analytics or backend services.",
        "Confirm purpose strings for microphone, speech recognition, and camera match the real feature behavior.",
      ],
    },
    {
      heading: "Google Play Console",
      body: [
        "Add a working public Privacy Policy URL in the store listing.",
        "Complete Data safety answers for microphone, camera, speech/text data, local storage, sharing, encryption in transit if any network transfer is added, deletion, and account status.",
        "Confirm prominent disclosure and consent if any sensitive data is collected or shared beyond what users reasonably expect.",
      ],
    },
    {
      heading: "Release blockers to resolve",
      body: [
        "Review the publisher name, support email, privacy email, legal email, website, Privacy Policy URL, Terms URL, and store metadata before release.",
        "Verify whether speech recognition audio leaves the device on each supported platform.",
        "Add or document an in-app way to delete stored conversations if conversation history ships.",
        "Update these drafts if analytics, crash reporting, authentication, cloud sync, AI APIs, ads, payments, or object detection are added.",
      ],
    },
  ],
};
