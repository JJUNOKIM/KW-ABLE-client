# 개발 환경 설정

광운대학교 캠퍼스 접근성 지도

## 필요한 것

- Node.js 18+
- 카카오맵 API 키

## 설치

```bash
npm install
```

## 환경 변수

`.env` 파일 만들고:

```
VITE_KAKAO_MAP_KEY=여기에_카카오맵_키
VITE_API_BASE_URL=http://219.255.242.174:8082
```

카카오맵 키 발급: https://developers.kakao.com

## 실행

```bash
npm run dev
```

http://localhost:5173 에서 확인

## 폴더 구조

```
src/
├── components/   # 컴포넌트들
├── pages/        # 페이지
├── services/     # API 호출
├── hooks/        # 커스텀 훅
├── types/        # 타입 정의
└── utils/        # 유틸 함수
```

## 빌드

```bash
npm run build
npm run preview
```

## 백엔드 API

http://219.255.242.174:8082
Swagger: http://219.255.242.174:8082/swagger-ui/index.html

## 디자인

Figma: https://www.figma.com/design/sBqialLbdpWxwvOWwzqCOR/kmap?node-id=98-649
