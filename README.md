# 내 업무 비서 (App)

React Native (Expo) 기반 iOS/Android 공통 앱. 두 가지 핵심 기능을 제공한다.

1. **회의 요약** — 회의록/녹취록 텍스트를 붙여넣으면 Claude API가 Markdown 요약을 생성하고, GitHub 저장소에 커밋한다.
2. **오늘 일정** — 아침에 할 일을 등록하고 저녁에 체크하며 확인, GitHub 저장소에 Markdown으로 커밋한다.

## 폴더 구조

```
App.tsx                  # 네비게이션 루트
src/
  screens/                # 화면 4개: Home, MeetingSummary, Schedule, Settings
  lib/
    secureStore.ts        # GitHub PAT / Anthropic API Key를 기기 보안 저장소에 저장
    github.ts             # GitHub Contents API로 Markdown 파일 생성/업데이트
    claude.ts             # Anthropic Messages API 호출 (회의 요약)
    scheduleStore.ts       # 오늘 일정 로컬 저장(AsyncStorage) + Markdown 변환
  navigation/types.ts
```

## 로컬 개발 준비물

- Node.js LTS (설치됨: v24.19.0)
- Android 테스트: Android Studio + Android SDK (에뮬레이터 또는 실기기)
- iOS 테스트: 로컬 Mac 없이도 실기기에 **Expo Go** 앱을 설치해 QR로 바로 미리보기 가능
- 최종 iOS 빌드/배포: [Expo EAS Build](https://docs.expo.dev/eas/) (클라우드 빌드, Mac 불필요) + Apple Developer Program 계정($99/년, 필요해지는 시점에 등록)
- Android 배포: Google Play Console 계정($25 1회, 필요해지는 시점에 등록)

## 실행 방법

```bash
npm install
npm run android   # Android 에뮬레이터/실기기
npm run ios       # Mac에서만 (또는 EAS)
npm run web       # 브라우저 미리보기
```

Expo Go 앱으로 테스트하려면 `npx expo start` 실행 후 표시되는 QR코드를 스캔한다.

## 앱 내 설정

앱 실행 후 홈 화면 하단 "설정" 진입 → 아래 값을 입력하면 기기에 암호화 저장된다 (expo-secure-store).

- **GitHub Personal Access Token**: GitHub → Settings → Developer settings → Fine-grained tokens에서 발급. 대상 저장소에 `Contents: Read and write` 권한 필요.
- **GitHub 저장소 owner / repo**: 회의 요약(`meetings/`)과 일정(`schedules/`)을 커밋할 저장소.
- **Anthropic API Key**: [console.anthropic.com](https://console.anthropic.com)에서 발급.

## 알려진 제한사항 / 다음 단계

- API 키가 기기에 저장되어 클라이언트에서 직접 GitHub/Anthropic API를 호출한다. 개인 用途 MVP로는 충분하지만, 여러 사용자에게 배포할 계획이라면 백엔드 프록시로 키를 옮기는 것을 고려해야 한다.
- 회의 입력은 텍스트 붙여넣기만 지원한다. 추후 앱 내 녹음 + STT(Whisper 등) 연동으로 확장 가능.
- 아침/저녁 알림(Push Notification)은 아직 미구현.
- iOS 최종 빌드 전 `npx eas build --platform ios` 및 EAS 계정 설정이 필요하다.
