# Helprr

A mobile app designed to support blind and deaf people, developed using React Native and Expo.

## Project Status

There is no production deployment, app store release, EAS build setup, CI pipeline, crash reporting, analytics, public legal website, or hosted support destination yet. Development should use Expo development builds because the app depends on native modules that are not available in Expo Go.

## Tech Stack

- Expo SDK 56, React Native 0.85, React 19, and React Native Web 0.21.
- Expo Router file-based routing under `src/app`.
- TypeScript with Expo's base TypeScript configuration.
- NativeWind and Tailwind CSS for styling.
- Expo SQLite and Drizzle ORM for local persistence.
- Expo Speech Recognition for speech-to-text.
- Expo Speech for text-to-speech playback.
- i18next and React i18next for English/Arabic UI localization.
- React Native Vision Camera for camera preview and frame output.
- React Native Executorch for on-device object detection.
- `patch-package` for temporary dependency compatibility patches.

Expo SDK 56 targets Node 22.13.x or newer according to the Expo SDK 56 docs. Use the SDK 56 documentation when changing Expo, React Native, native modules, or app config: https://docs.expo.dev/versions/v56.0.0/

## Project Structure

```text
|-- assets/                         # Expo app icons and image assets
|-- patches/                        # patch-package patches applied after npm install
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
|   |-- hooks/                      # Speech, language, and chat hooks
|   |-- lib/                        # Database, permissions, platform, share, and utility code
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
- npm. The repository includes `package-lock.json`, so npm is the expected package manager.
- Expo CLI through `npx expo`.
- Android Studio, Android SDK, and a configured emulator or physical Android device.
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

This runs `expo run:android` against the checked-in Android project. Use this when native dependencies, app config, Android permissions, or patches change.

### 5. Build and run iOS locally

```bash
npm run ios
```

This runs `expo run:ios` against the checked-in iOS project. Use this when native dependencies, app config, iOS permissions, or patches change.

### 6. Run the web target when useful

```bash
npm run web
```

The app has a web target, but native-module-dependent flows are mobile-first. Use web mainly for route/layout smoke checks unless a feature is explicitly designed for web.

### 7. Update generated legal notices after dependency changes

Whenever `package.json` or `package-lock.json` changes:

```bash
npm run legal:generate
npm run legal:check
```

Commit the regenerated `src/data/legal/generated/open-source-notice-data.ts` with the dependency change.

### 8. Generate Drizzle schema files only when needed

```bash
npm run db:generate
```

The runtime database bootstrap currently creates the SQLite tables directly in `src/lib/db/client.ts`. If the schema evolves, align the runtime migration path, generated Drizzle output, and any release notes before shipping.

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

Re-test this patch whenever Vision Camera, Android camera output settings, or Executorch frame processing changes.

### `react-native-executorch@0.8.4`

- Changes the computer-vision worklet bridge to pass `frame.getPixelBuffer()`, `width`, `height`, and `bytesPerRow` instead of `frame.getNativeBuffer()`.
- Updates the native C++ frame extractor to accept either `nativeBuffer` or `pixelBuffer`.
- This aligns Executorch object detection with the Vision Camera frame output used by Helprr.

Treat this as a compatibility patch. Before production, either replace it with an upstream fix, vendor-reviewed fork, or a documented long-term patch policy.

## Core Scripts

```text
npm start             # expo start
npm run android       # expo run:android
npm run ios           # expo run:ios
npm run web           # expo start --web
npm run format        # prettier --write .
npm run format:check  # prettier --check .
npm run lint          # expo lint
npm run typecheck     # tsc --noEmit
npm run legal:generate
npm run legal:check
npm run db:generate
```

## Development Notes

- The Listen flow stores conversations and messages locally in Expo SQLite.
- Conversation messages support English and Arabic language metadata.
- The app UI is localized in English and Arabic through `src/lib/i18n/resources`.
- The app language preference is stored locally in SQLite and is initialized from the stored preference or the device locale.
- Arabic switches the app to RTL with React Native `I18nManager`; direction changes require an app reload so native RTL layout flags are applied consistently.
- Directional icons opt into RTL mirroring through the shared `Icon` wrapper's `autoMirror` prop.
- Speech recognition requests permission from the feature flow.
- Camera permission is requested from the See flow.
- Object detection currently uses [`SSDLITE_320_MOBILENET_V3_LARGE`](https://huggingface.co/software-mansion/react-native-executorch-ssdlite320-mobilenet-v3-large) through [React Native ExecuTorch object detection](https://docs.swmansion.com/react-native-executorch/docs/0.5.x/hooks/computer-vision/useObjectDetection). The underlying model is TorchVision's [SSDLite320 MobileNetV3 Large](https://pytorch.org/vision/main/models/generated/torchvision.models.detection.ssdlite320_mobilenet_v3_large.html).
- The app has no server-side storage today; privacy statements must be revisited if cloud sync, analytics, AI APIs, crash reporting, or account features are added.

## Deployment

There is no deployment yet.

The app has not been published to the App Store, Google Play, Expo Application Services channels, or any other production release target. Future deployment work needs production Expo/EAS configuration, app signing, release profiles, store assets, privacy disclosures, legal review, and full physical-device testing.

Recommended future EAS direction:

- create `eas.json` with `development`, `preview`, and `production` build profiles,
- use internal distribution for preview builds,
- use EAS Submit when store credentials and metadata are ready,
- use EAS Update only with a clear runtime-version policy,
- avoid OTA updates for changes involving native modules, app config, permissions, patches, model binaries, or dependency changes that alter native code.

## Future Improvements and Production Readiness

### Product and feature readiness

- Finish and validate the core accessibility workflows with real users where possible.
- Decide whether See/object detection is a production feature or a beta/experimental feature.
- Add clear in-app affordances for deleting local conversation history.
- Implement full UI localization if Arabic support is part of the release promise.
- Review all copy for accessibility, safety, medical, emergency, navigation, and reliability claims.
- Add onboarding or first-run education only if it improves permission timing and user understanding.

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
- Replace all placeholder legal contact values in `src/data/legal/legal-document-data.ts`.
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
- Remove internal-only checklists, such as store disclosure notes, from production user-facing navigation unless intentionally shipping them.

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
- Confirm that conversations stored with Expo SQLite remain local, and document where deletion happens.
- Add an in-app way to delete stored conversations before release if conversation history is shipped.
- If analytics, crash reporting, AI APIs, authentication, cloud sync, ads, payments, or remote object detection are added, update the privacy policy, store disclosures, and consent flows before release.
- Document whether any data is encrypted in transit, encrypted at rest, shared with third parties, linked to the user, used for tracking, or retained by a provider.

### App permissions and consent

- Verify iOS and Android permission prompts for microphone, speech recognition, and camera on physical devices.
- Make permission purpose strings specific, accurate, and consistent with real behavior in `app.json`.
- Do not request camera, microphone, or speech recognition permissions before the user reaches a feature that needs them.
- If any sensitive data is collected or shared beyond what users reasonably expect, add prominent in-app disclosure and consent before collection.
- Confirm the app remains usable or clearly explains limitations when permissions are denied.

### Accessibility, safety, and product claims

- Review all app store descriptions, screenshots, onboarding, and in-app copy for claims about helping blind, deaf, or disabled users.
- Avoid implying that Helprr is a medical device, emergency service, safety system, navigation aid, or professional substitute unless the app is legally reviewed and certified for that use.
- Keep the Safety Notice visible and plain-language: speech recognition, speech output, camera features, and object detection can be inaccurate, delayed, or unavailable.
- Test with accessibility settings enabled, including screen readers, larger text, reduced motion, RTL layout, and platform contrast settings.
- If the app targets children or families, complete a separate child privacy and store policy review before release.

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
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/
- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data safety form guidance: https://support.google.com/googleplay/android-developer/answer/10787469

## License

This project is licensed under the MIT License. See `LICENSE` for details.
