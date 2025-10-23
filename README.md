# 🔥 전국 산불 통계 분석 시스템

리액트와 파이어베이스를 활용한 대한민국 산불 데이터 시각화 웹 애플리케이션

## 주요 기능

- 📍 구글 지도를 통한 전국 산불 발생 위치 시각화
- 📊 산불 통계 대시보드 (총 건수, 피해면적, 원인별 통계)
- 🔍 산불 발생 정보 상세 보기 (InfoWindow)
- 🔥 Firebase Firestore를 통한 실시간 데이터 연동

## 기술 스택

- **Frontend**: React 18 + Vite
- **Maps**: Google Maps API (@react-google-maps/api)
- **Backend**: Firebase (Firestore, Auth)
- **Styling**: CSS (TailwindCSS 추가 가능)

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 API 키를 입력하세요:

```bash
cp .env.example .env
```

필요한 API 키:
- **Google Maps API Key**: [Google Cloud Console](https://console.cloud.google.com/)에서 발급
- **Firebase 설정**: [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성 후 설정 정보 입력

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. 프로덕션 빌드

```bash
npm run build
```

## 프로젝트 구조

```
wildfire-stats/
├── src/
│   ├── components/
│   │   ├── WildfireMap.jsx      # 구글 지도 컴포넌트
│   │   └── Statistics.jsx       # 통계 대시보드 컴포넌트
│   ├── config/
│   │   └── firebase.js          # Firebase 설정
│   ├── data/
│   │   └── sampleData.js        # 샘플 산불 데이터
│   ├── App.jsx                  # 메인 앱 컴포넌트
│   └── main.jsx                 # 엔트리 포인트
├── .env.example                 # 환경 변수 템플릿
└── package.json
```

## Firebase 데이터 구조

Firestore 컬렉션: `wildfires`

각 문서 구조:
```javascript
{
  id: number,
  location: string,        // 발생 지역
  latitude: number,        // 위도
  longitude: number,       // 경도
  date: string,           // 발생일 (YYYY-MM-DD)
  area: number,           // 피해면적 (ha)
  cause: string,          // 발생 원인
  casualties: string      // 인명피해 (선택)
}
```

## 현재 상태

- ✅ 기본 UI 구조 완성
- ✅ Google Maps 통합
- ✅ 샘플 데이터로 동작
- ⏳ Firebase 실제 연동 필요
- ⏳ 데이터 필터링 기능 추가 예정

## 다음 단계

1. Firebase 프로젝트 생성 및 Firestore 설정
2. Google Maps API 키 발급
3. 실제 산불 데이터 수집 및 입력
4. 필터링 기능 추가 (연도별, 지역별, 원인별)
5. 차트 라이브러리 추가 (Chart.js, Recharts 등)
6. Firebase Hosting 배포

## 라이선스

MIT
