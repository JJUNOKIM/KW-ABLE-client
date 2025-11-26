# 모바일 최적화 메모

## 뷰포트 설정

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## CSS 주의사항

- 터치 타겟 최소 44px
- iOS 자동 줌 방지: input 폰트 16px 이상
- 100vh 대신 100dvh 사용 (iOS Safe Area)
- overscroll-behavior: none

## 터치 피드백

```css
active:scale-95
active:bg-gray-100
```

## 레이아웃

max-width: 448px로 모바일 화면 고정

## 테스트

로컬 네트워크 테스트:
```bash
npm run dev -- --host
```

크롬 개발자도구: F12 > Ctrl+Shift+M

## PWA

manifest.json 추가됨
standalone 모드, portrait 고정

## 알려진 버그

- iOS Safari: position fixed + input 버그 있음
- Android Chrome: pull-to-refresh 완전히 못막음

## 나중에 추가할 것

- Service Worker
- Push Notification
- GPS 추적
- 햅틱 피드백
