# Helprr

A mobile app designed to support blind and deaf people, developed using React Native and Expo.

## Project Status

Helprr is in development. It is not published to the App Store, Google Play, Expo Application Services channels, or any production release target.

There is currently no checked-in `eas.json`, production EAS project setup, CI pipeline, or public legal/support website dedicated to the app.

## Tech Stack

- Expo SDK 56, React Native 0.85, and React 19.
- Expo Router file-based routing under `src/app`.
- TypeScript with Expo's base TypeScript configuration.
- NativeWind and Tailwind CSS for styling.
- Expo SQLite and Drizzle ORM for local persistence.
- Expo Speech Recognition for speech-to-text.
- Expo Speech for text-to-speech playback.
- i18next and React i18next for English/Arabic localization.
- React Native Vision Camera for camera preview and frame output.
- React Native ExecuTorch for on-device object detection.
- `patch-package` for temporary native dependency compatibility patches.

Expo SDK 56 targets Node 22.13.x or newer. Use the SDK 56 documentation when changing Expo, React Native, native modules, or app config: https://docs.expo.dev/versions/v56.0.0/

## Project Structure

```text
|-- assets/                         # App icons, splash assets, and images
|-- patches/                        # patch-package patches applied after install
|-- scripts/                        # Project maintenance scripts
|-- src/
|   |-- app/                        # Expo Router route tree
|   |   |-- (tabs)/                 # Home, Listen, See, and Settings tabs
|   |   |   |-- listen/             # Conversations and conversation detail routes
|   |   |   |-- settings/           # Settings, legal, permissions, and app info routes
|   |   |   `-- see.tsx             # Camera/object-detection route
|   |   `-- _layout.tsx             # Root layout and global CSS import
|   |-- components/                 # Shared UI and feature components
|   |-- constants/                  # Theme, language, and URL constants
|   |-- data/                       # Legal text and generated OSS notice data
|   |-- hooks/                      # Speech, language, navigation, and chat hooks
|   |-- lib/                        # Database, i18n, permissions, platform, share, and utilities
|   |-- types/                      # Local type declarations
|   `-- global.css                  # NativeWind/Tailwind global CSS
|-- app.json                        # Expo app config, permissions, plugins, and identifiers
|-- drizzle.config.ts               # Drizzle schema generation config
|-- metro.config.js                 # Expo Metro config with NativeWind
|-- package.json                    # Scripts and dependency manifest
|-- package-lock.json               # npm lockfile; use npm for this repo
|-- tailwind.config.js              # Tailwind content/theme config
|-- tsconfig.json                   # TypeScript config
`-- README.md
```

## Prerequisites

- Node.js 22.13.x or newer.
- npm. This repository includes `package-lock.json`, so npm is the expected package manager.
- Expo CLI through `npx expo`.
- Android Studio, Android SDK, and a configured emulator or physical Android device for Android development.
- Xcode on macOS for iOS development builds.
- Physical Android and iOS devices are recommended for release confidence. Speech recognition, speech playback, camera, and object detection should not be signed off using simulators alone.

## Environment Variables

No required environment variables are currently defined.

The app does not currently include a backend API, remote deployment target, analytics service, crash reporting service, authentication provider, or checked-in `.env` template.

## Runbook

### 1. Install dependencies

```bash
npm install
```

`npm install` runs `patch-package` through the `postinstall` script. If patch application fails, stop and fix the dependency version or patch before running the app.

### 2. Verify the repo

Run the checks that should pass before merging to `main`:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run legal:check
```

`legal:check` regenerates open-source notice data and fails if `src/data/legal/generated/open-source-notice-data.ts` is stale.

### 3. Start Metro for a development build

```bash
npx expo start --dev-client
```

Use a development build, not Expo Go. Native modules such as speech recognition, Vision Camera, Executorch, Nitro modules, SQLite, and the native patches require a real native binary.

### 4. Build and run Android locally

```bash
npm run android
```

This runs `expo run:android`. Because native Android files are not checked in, Expo may generate the native project locally during the run. Use this when native dependencies, app config, Android permissions, or patches change.

### 5. Build and run iOS locally

```bash
npm run ios
```

This runs `expo run:ios` on macOS. Because native iOS files are not checked in, Expo may generate the native project locally during the run. Use this when native dependencies, app config, iOS permissions, or patches change.

### 6. Update generated legal notices after dependency changes

Whenever `package.json` or `package-lock.json` changes:

```bash
npm run legal:generate
npm run legal:check
```

Commit the regenerated `src/data/legal/generated/open-source-notice-data.ts` with the dependency change.

### 7. Generate Drizzle schema files only when needed

```bash
npm run db:generate
```

The runtime database bootstrap currently creates the SQLite tables directly in `src/lib/db/client.ts`. If the schema evolves, align the runtime migration path, generated Drizzle output, and release notes before shipping.

## Core Scripts

```text
npm start             # expo start
npm run android       # expo run:android
npm run ios           # expo run:ios
npm run format        # prettier --write .
npm run format:check  # prettier --check .
npm run lint          # expo lint
npm run typecheck     # tsc --noEmit
npm run legal:generate
npm run legal:check
npm run db:generate
```

## Dependency Patches

This repo intentionally uses `patch-package`. The patches are applied automatically after `npm install`.

### `react-native-css-interop@0.2.4`

- Maps NativeWind `text-start` and `text-end` to React Native-compatible `left` and `right` text alignment values during CSS parsing.
- Updates the Metro virtual style change event payload from the older `eventsQueue` shape to the current `changes` shape expected by the Metro version used with Expo SDK 56 / React Native 0.85.
- Wraps NativeWind/CSS interop upgrade-warning prop serialization in `safeStringify` so circular or otherwise non-serializable props do not crash logging.

Keep this patch until NativeWind / CSS interop provides an upstream version compatible with this Expo and Metro stack.

### `react-native-vision-camera@5.0.10`

- Changes Android `ImageProxy.getPixelBuffer()` to prefer the CPU-readable single-plane buffer for RGB/RGBA frame outputs before trying the hardware-buffer path.
- This supports the app's Vision Camera frame-output pipeline and reduces failures around hardware-buffer locking for object detection frames.

Re-test this patch whenever Vision Camera, Android camera output settings, or ExecuTorch frame processing changes.

### `react-native-executorch@0.8.4`

- Changes the computer-vision worklet bridge to pass `frame.getPixelBuffer()`, `width`, `height`, and `bytesPerRow` instead of `frame.getNativeBuffer()`.
- Updates the native C++ frame extractor to accept either `nativeBuffer` or `pixelBuffer`.
- This aligns ExecuTorch object detection with the Vision Camera frame output used by Helprr.

Treat this as a compatibility patch. Before production, either replace it with an upstream fix, vendor-reviewed fork, or documented long-term patch policy.

## Development Notes

- The app currently targets iOS and Android through `app.json`.
- The Listen flow stores conversations and messages locally in Expo SQLite.
- Conversation messages support English and Arabic language metadata.
- The app UI is localized in English and Arabic through `src/lib/i18n/resources`.
- The app language preference is stored locally in SQLite and initialized from the stored preference or device locale.
- Arabic switches the app to RTL with React Native `I18nManager`; direction changes require an app reload so native RTL layout flags are applied consistently.
- Directional icons opt into RTL mirroring through the shared `Icon` wrapper's `autoMirror` prop.
- Speech recognition requests permission from the feature flow.
- Camera permission is requested from the See flow.
- Object detection currently uses [`SSDLITE_320_MOBILENET_V3_LARGE`](https://huggingface.co/software-mansion/react-native-executorch-ssdlite320-mobilenet-v3-large) through [React Native ExecuTorch object detection](https://docs.swmansion.com/react-native-executorch/docs/0.5.x/hooks/computer-vision/useObjectDetection). The underlying model is TorchVision's [SSDLite320 MobileNetV3 Large](https://pytorch.org/vision/main/models/generated/torchvision.models.detection.ssdlite320_mobilenet_v3_large.html).
- The app has no server-side storage today; privacy statements must be revisited if cloud sync, analytics, AI APIs, crash reporting, or account features are added.

## Deployment

There is no deployment yet.

The app has not been published to the App Store, Google Play, Expo Application Services channels, or any other production release target. Future deployment work needs production Expo/EAS configuration, app signing, release profiles, store assets, privacy disclosures, legal review, and full physical-device testing.

Future deployment should use an Expo Application Services release process:

- Add `eas.json` with `development`, `preview`, and `production` build profiles.
- Use EAS Build for Android and iOS binaries.
- Use internal distribution for preview builds.
- Use EAS Submit when store credentials and metadata are ready.
- Use Expo Launch from GitHub when the app is ready for guided store launch work.
- Use EAS Workflows only after local EAS builds are successful and credentials are configured.
- Use EAS Update only with a clear runtime-version policy.
- Avoid OTA updates for changes involving native modules, app config, permissions, patches, model binaries, or dependency changes that alter native code.

## Future Improvements and Production Readiness

### Product and feature readiness

- Validate the core accessibility workflows with real users where possible.
- Decide whether See/object detection is a production feature or a beta/experimental feature.
- Review accessibility, safety, medical, emergency, navigation, and reliability claims.
- Add onboarding or first-run education to improve permission timing and user understanding.

### Native and device readiness

- Test Android and iOS on physical devices across supported OS versions.
- Verify microphone, speech recognition, speech playback, camera, and object detection behavior under denied permissions, airplane mode, low power mode, backgrounding, and app restarts.
- Profile object detection for frame rate, battery use, heat, memory, and crash risk.
- Confirm model download/bundling behavior, model licensing, and offline behavior.
- Revisit every `patch-package` patch during dependency upgrades and before release.

### CI/CD

- Add GitHub Actions for pull requests:
  - `npm ci`,
  - `npm run format:check`,
  - `npm run lint`,
  - `npm run typecheck`,
  - `npm run legal:check`.
- Add manual EAS preview builds for Android first, then iOS once Apple credentials are ready.
- Add protected branch requirements before merging to `main`.
- Add production release workflows only after EAS credentials, store metadata, legal review, and testing gates exist.
- Add release tagging, changelog generation, and stored release notes.
- Add a policy for when EAS Update is allowed versus when a new binary is required.

### Observability and operations

- Add crash reporting before any public release.
- Decide whether analytics are necessary; if added, update privacy policy, consent, and store disclosures first.
- Add support/contact handling and a monitored support email.
- Define incident response expectations for crashes, unsafe behavior, accessibility regressions, or incorrect app store disclosures.

### Store and release assets

- Create final app icons, splash assets, screenshots, preview videos, descriptions, keywords, support URLs, privacy URLs, and release notes.
- Verify asset ownership and licenses for icons, images, generated images, fonts, screenshots, and model assets.
- Complete App Store Connect and Google Play Console setup.
- Complete content rating, target audience, permissions, app access, App Privacy, and Google Play Data safety forms.

## Legal Release Readiness

This section is an engineering checklist, not legal advice. Before publishing Helprr to any app store, the final policies, store disclosures, disclaimers, and release text should be reviewed by a qualified lawyer for every country where the app will be distributed.

### Required ownership and contact details

- Decide the legal publisher identity: individual name, company name, address country, support email, privacy email, and legal email.
- Create a production support/privacy/legal email before release, preferably on the final app or publisher domain.
- Replace the current personal contact email, `mohammad.helaly@outlook.com`, anywhere it appears in `src/data/legal/legal-document-data.ts`, store metadata, public policy pages, support pages, and release materials.
- Create a production public site before release with support, Privacy Policy, Terms of Use, and contact information.
- Replace the current personal site, `https://helaly.vercel.app`, anywhere it appears in app legal content, store metadata, website links, support URLs, Privacy Policy URLs, Terms URLs, and release materials.
- Review all legal document text in `src/data/legal/legal-document-data.ts` before release and keep the in-app text aligned with the production email, production site, public policies, and store disclosures.
- Create a public support/contact destination for store listings, such as a support page or monitored support email.
- Decide whether the app is published by an individual or legal entity and make sure that matches Apple Developer, Google Play Console, website, privacy policy, and terms.

### Public legal website

- Publish a public Privacy Policy URL. Apple App Store Connect and Google Play require privacy disclosures to be available outside the app.
- Publish public Terms of Use, or use and link Apple's standard EULA for iOS if that is the chosen approach.
- Publish support/contact information.
- If accounts, cloud sync, or server-side storage are added later, publish data deletion instructions and any required account deletion flow.
- Keep the website policies and in-app Legal pages synchronized. Store metadata, website text, and the app must describe the same data practices.

### In-app legal pages

- Keep `Settings -> Legal -> Privacy Policy` available in the app.
- Keep `Settings -> Legal -> Terms of Use` available in the app.
- Keep `Settings -> Legal -> Safety Notice` available because Helprr is an accessibility-support app and should clearly state its limitations.
- Keep `Settings -> Legal -> License` available for Helprr's MIT license.
- Keep `Settings -> Legal -> Acknowledgements` available for third-party open-source notices.
- Update and thoroughly review all legal content.

### Open-source licensing and attribution

- Keep `LICENSE` and the `license` field in `package.json` accurate for Helprr's own source code.
- Run `npm run legal:generate` whenever dependencies change.
- Commit `src/data/legal/generated/open-source-notice-data.ts` after dependency changes.
- Run `npm run legal:check` in CI after `npm ci` so pull requests fail when generated notices are stale.
- Review generated notices for `UNKNOWN`, GPL-family, AGPL, LGPL, SSPL, or custom licenses before release.
- Confirm third-party assets, icons, fonts, generated images, app store screenshots, and model assets have documented usage rights. Source-code dependency notices do not cover every visual, content, or ML asset.
- If patches are shipped through `patch-package`, review whether any patch changes affect third-party license obligations or notice text.

### Privacy and data mapping

- Create a data inventory for every feature: typed text, speech recognition, microphone input, speech output, local conversation history, language settings, camera access, object detection frames, model assets, crash logs, analytics, device identifiers, and diagnostics.
- Confirm whether speech recognition audio or transcripts leave the device on iOS and Android during real physical-device testing.
- Confirm whether text-to-speech processing is fully on-device or uses any OS/provider network service.
- Confirm whether object detection frames stay on-device and whether any model/provider collects diagnostics.
- Verify iOS and Android permission prompts for microphone, speech recognition, and camera on physical devices.
- Make permission purpose strings specific, accurate, and consistent with real behavior in `app.json`.

### Accessibility, safety, and product claims

- Review all app store descriptions, screenshots, onboarding, and in-app copy for claims about helping blind, deaf, or disabled users.
- Avoid implying that Helprr is a medical device, emergency service, safety system, navigation aid, or professional substitute unless the app is legally reviewed and certified for that use.
- Keep the Safety Notice visible and plain-language: speech recognition, speech output, camera features, and object detection can be inaccurate, delayed, or unavailable.
- Test with accessibility settings enabled, including screen readers, larger text, reduced motion, RTL layout, and platform contrast settings.

### Apple App Store checklist

- Add a valid Privacy Policy URL in App Store Connect.
- Complete App Privacy details for all data types collected by Helprr and any third-party SDKs.
- Ensure App Privacy answers match the public Privacy Policy and the app's actual behavior.
- Decide whether to use Apple's standard EULA or custom terms, then configure links accordingly.
- Verify app metadata, screenshots, subtitle, description, keywords, and support URL do not overstate accessibility, safety, medical, or emergency capabilities.
- Confirm Expo SDK 56's iOS/Xcode requirements and current Apple submission requirements before building for release.

### Google Play checklist

- Add a valid Privacy Policy URL in Google Play Console.
- Complete the Data safety form for Helprr and all third-party SDKs.
- Ensure Data safety answers match the public Privacy Policy and the app's actual behavior.
- Complete content rating, target audience, permissions, and app access declarations.
- If sensitive data collection or sharing is added, implement Google Play compliant prominent disclosure and consent.
- Confirm Expo SDK 56's Android target SDK support and current Google Play submission requirements before building for release.

### Release governance

- Add `npm run legal:check`, `npm run typecheck`, `npm run lint`, and `npm run format:check` to CI.
- Require legal checklist review before each store submission, not only before the first release.
- Re-run legal review whenever adding a new SDK, permission, backend service, AI provider, analytics tool, crash reporter, payment flow, data export path, or object-detection model.
- Keep dated copies of submitted Privacy Policy, Terms of Use, App Privacy answers, Google Play Data safety answers, release notes, and store screenshots for audit history.

Reference policies and docs:

- Expo SDK 56 reference: https://docs.expo.dev/versions/v56.0.0/
- Expo Launch: https://launch.expo.dev/
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/
- EAS Workflows: https://docs.expo.dev/eas/workflows/get-started/
- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data safety form guidance: https://support.google.com/googleplay/android-developer/answer/10787469

## License

This project is licensed under the MIT License. See `LICENSE` for details.
