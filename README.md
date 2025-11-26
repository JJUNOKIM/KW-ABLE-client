# KW-ABLE

광운대학교 캠퍼스 접근성 지도 서비스

## 개발 환경

React + TypeScript + Vite로 개발했습니다.

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Kakao Maps API

## 설치 및 실행

```bash
npm install
npm run dev
```

카카오맵 API 키가 필요합니다. `.env` 파일에 `VITE_KAKAO_MAP_KEY` 설정하세요.

## 기능

- 캠퍼스 지도 및 건물 검색
- 건물별 접근성 정보 (엘리베이터, 휠체어, 장애인 화장실 등)
- 출발지/도착지 경로 검색 및 안내
- 접근성을 고려한 경로 표시

## 폴더 구조

```
src/
├── components/  # 컴포넌트
├── pages/       # 페이지
├── services/    # API
├── hooks/       # 커스텀 훅
├── types/       # 타입
└── utils/       # 유틸
```

## API

백엔드: http://219.255.242.174:8082

Swagger: http://219.255.242.174:8082/swagger-ui/index.html

## 빌드

```bash
npm run build
```
