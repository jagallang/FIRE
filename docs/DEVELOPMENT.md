# 💻 산불 통합 관리 플랫폼 - 개발문서

**React 18 + Vite + Firebase + Google Maps | 버전 1.0**

---

## 📑 목차

1. [시작하기](#1-시작하기)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [Firebase 설정](#3-firebase-설정)
4. [Google Maps API 설정](#4-google-maps-api-설정)
5. [주요 컴포넌트 구현](#5-주요-컴포넌트-구현)
6. [상태 관리](#6-상태-관리)
7. [빌드 및 배포](#7-빌드-및-배포)
8. [성능 최적화](#8-성능-최적화)
9. [트러블슈팅](#9-트러블슈팅)
10. [참고 자료](#10-참고-자료)

---

## 1. 시작하기

### 1.1 개발 환경

| 항목 | 버전 |
|------|------|
| **Node.js** | v18.0.0 이상 |
| **npm** | v9.0.0 이상 |
| **Git** | v2.30.0 이상 |
| **IDE** | VS Code (권장) |

### 1.2 프로젝트 생성 (이미 완료)

현재 프로젝트는 이미 생성되어 있습니다:

```bash
# 프로젝트 디렉토리로 이동
cd wildfire-stats

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 1.3 설치된 패키지

**핵심 의존성:**
```json
{
  "firebase": "^latest",
  "@react-google-maps/api": "^latest",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

**개발 의존성:**
```json
{
  "@vitejs/plugin-react": "^latest",
  "vite": "^latest",
  "eslint": "^latest"
}
```

---

## 2. 프로젝트 구조

```
wildfire-stats/
├── public/                 # 정적 파일
│   └── vite.svg
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── WildfireMap.jsx      # 구글 지도 컴포넌트
│   │   └── Statistics.jsx       # 통계 대시보드
│   ├── config/           # 설정 파일
│   │   └── firebase.js         # Firebase 초기화
│   ├── data/             # 데이터 파일
│   │   └── sampleData.js       # 샘플 산불 데이터
│   ├── App.jsx           # 메인 앱 컴포넌트
│   ├── App.css           # 앱 스타일
│   ├── index.css         # 전역 스타일
│   └── main.jsx          # 엔트리 포인트
├── docs/                 # 문서
│   ├── REQUIREMENTS.md   # 기능요구서
│   └── DEVELOPMENT.md    # 개발문서 (현재 파일)
├── .env.example          # 환경 변수 템플릿
├── .gitignore
├── package.json
├── vite.config.js        # Vite 설정
├── eslint.config.js      # ESLint 설정
└── README.md             # 프로젝트 README

```

### 2.1 주요 디렉토리 설명

| 디렉토리 | 설명 |
|---------|------|
| `src/components/` | 재사용 가능한 React 컴포넌트 |
| `src/config/` | Firebase 등 설정 파일 |
| `src/data/` | 샘플 데이터 및 상수 |
| `docs/` | 프로젝트 문서 |

---

## 3. Firebase 설정

### 3.1 Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `wildfire-korea`)
4. Google Analytics 설정 (선택사항)
5. "프로젝트 만들기" 클릭

### 3.2 웹 앱 추가

1. Firebase 프로젝트 개요에서 "웹" 아이콘(</>) 클릭
2. 앱 닉네임 입력 (예: `wildfire-web`)
3. Firebase SDK 구성 정보 복사

### 3.3 환경 변수 설정

`.env.example` 파일을 `.env`로 복사:

```bash
cp .env.example .env
```

`.env` 파일 내용 (Firebase Console에서 복사한 값 입력):

```env
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=wildfire-korea.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wildfire-korea
VITE_FIREBASE_STORAGE_BUCKET=wildfire-korea.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**⚠️ 중요:** `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 업로드되지 않습니다.

### 3.4 Firebase 초기화 코드

`src/config/firebase.js` (이미 생성됨):

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
```

### 3.5 Firestore 데이터베이스 생성

1. Firebase Console에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. 프로덕션 모드로 시작 (또는 테스트 모드)
4. 위치 선택: `asia-northeast3` (서울) 권장

### 3.6 Firestore 컬렉션 구조

**컬렉션명:** `wildfires`

**문서 예시:**
```json
{
  "id": "1",
  "location": "강원도 속초시",
  "latitude": 38.2070,
  "longitude": 128.5918,
  "date": "2023-04-11",
  "area": 213.5,
  "cause": "입산자 실화",
  "casualties": "1명 사망, 11명 부상"
}
```

### 3.7 샘플 데이터 업로드 (선택사항)

Firebase Console에서 수동으로 데이터 추가하거나, 아래 코드로 프로그래밍 방식 추가:

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { sampleWildfireData } from './data/sampleData';

// 샘플 데이터 업로드
const uploadData = async () => {
  for (const fire of sampleWildfireData) {
    await addDoc(collection(db, 'wildfires'), fire);
  }
};
```

---

## 4. Google Maps API 설정

### 4.1 Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리" 이동
4. "Maps JavaScript API" 검색 후 사용 설정
5. "사용자 인증 정보" > "API 키 만들기"
6. API 키를 `.env` 파일의 `VITE_GOOGLE_MAPS_API_KEY`에 추가

### 4.2 API 키 제한 설정 (보안)

**애플리케이션 제한사항:**
- HTTP 리퍼러 (웹사이트)
- 허용된 리퍼러: `http://localhost:*`, `https://yourdomain.com/*`

**API 제한사항:**
- Maps JavaScript API만 선택

---

## 5. 주요 컴포넌트 구현

### 5.1 WildfireMap 컴포넌트

**파일:** `src/components/WildfireMap.jsx`

**핵심 기능:**
- Google Maps API 로딩
- 마커 표시 및 클러스터링
- InfoWindow 팝업
- 대한민국 중심 좌표 설정

**주요 코드:**
```javascript
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const WildfireMap = ({ wildfireData = [] }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  if (!isLoaded) {
    return <div>지도 로딩 중...</div>;
  }

  return (
    <GoogleMap
      center={{ lat: 36.5, lng: 127.5 }}
      zoom={7}
    >
      {/* 마커 렌더링 */}
    </GoogleMap>
  );
};
```

**Props:**
- `wildfireData` (array): 산불 데이터 배열

### 5.2 Statistics 컴포넌트

**파일:** `src/components/Statistics.jsx`

**핵심 기능:**
- 총 건수, 총 피해면적, 올해 건수 계산
- 원인별 통계 집계
- 반응형 카드 레이아웃

**주요 코드:**
```javascript
const Statistics = ({ wildfireData = [] }) => {
  const totalFires = wildfireData.length;
  const totalArea = wildfireData.reduce((sum, fire) => sum + fire.area, 0);
  const thisYearFires = wildfireData.filter(fire =>
    new Date(fire.date).getFullYear() === new Date().getFullYear()
  ).length;

  return (
    <div className="statistics">
      {/* 통계 카드 렌더링 */}
    </div>
  );
};
```

**Props:**
- `wildfireData` (array): 산불 데이터 배열

### 5.3 App 컴포넌트

**파일:** `src/App.jsx`

**핵심 기능:**
- 메인 레이아웃 구성
- 샘플 데이터 로딩
- 컴포넌트 조합

**구조:**
```javascript
function App() {
  const [wildfireData, setWildfireData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 샘플 데이터 로딩
    setWildfireData(sampleWildfireData);
    setLoading(false);
  }, []);

  return (
    <div>
      <header>헤더</header>
      <main>
        <Statistics wildfireData={wildfireData} />
        <WildfireMap wildfireData={wildfireData} />
      </main>
      <footer>푸터</footer>
    </div>
  );
}
```

---

## 6. 상태 관리

### 6.1 현재 상태 관리 방식

**React useState:**
- 현재는 `App.jsx`에서 `useState`로 데이터 관리
- Props drilling으로 하위 컴포넌트에 전달

### 6.2 향후 개선 방안

**React Query 도입 (Phase 2):**
```bash
npm install @tanstack/react-query
```

**Firestore 데이터 fetching:**
```javascript
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

const useWildfireData = () => {
  return useQuery({
    queryKey: ['wildfires'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'wildfires'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });
};
```

---

## 7. 빌드 및 배포

### 7.1 로컬 빌드

**개발 서버 실행:**
```bash
npm run dev
```
- 기본 주소: `http://localhost:5173`
- Hot Module Replacement (HMR) 지원

**프로덕션 빌드:**
```bash
npm run build
```
- 빌드 결과: `dist/` 디렉토리
- 최적화된 번들 생성

**빌드 미리보기:**
```bash
npm run preview
```

### 7.2 Firebase Hosting 배포

**1단계: Firebase CLI 설치**
```bash
npm install -g firebase-tools
```

**2단계: Firebase 로그인**
```bash
firebase login
```

**3단계: Firebase 초기화**
```bash
firebase init hosting
```

설정:
- Public directory: `dist`
- Single-page app: `Yes`
- Automatic builds: `No` (선택사항)

**4단계: 배포**
```bash
npm run build
firebase deploy --only hosting
```

### 7.3 firebase.json 설정 예시

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```

### 7.4 기타 배포 옵션

**Vercel:**
```bash
npm install -g vercel
vercel deploy
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 8. 성능 최적화

### 8.1 이미지 최적화

- 아이콘은 SVG 사용
- 이미지는 WebP 포맷 권장
- `loading="lazy"` 속성 활용

### 8.2 코드 스플리팅

```javascript
import { lazy, Suspense } from 'react';

const WildfireMap = lazy(() => import('./components/WildfireMap'));

<Suspense fallback={<div>로딩 중...</div>}>
  <WildfireMap />
</Suspense>
```

### 8.3 번들 크기 분석

```bash
npm install -D rollup-plugin-visualizer
npm run build
```

`vite.config.js`에 추가:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

### 8.4 메모이제이션

```javascript
import { useMemo, useCallback } from 'react';

const Statistics = ({ wildfireData }) => {
  const totalArea = useMemo(() =>
    wildfireData.reduce((sum, fire) => sum + fire.area, 0),
    [wildfireData]
  );

  return <div>{totalArea}</div>;
};
```

---

## 9. 트러블슈팅

### 9.1 자주 발생하는 문제

| 문제 | 원인 | 해결 방법 |
|------|------|----------|
| 지도가 표시되지 않음 | API 키 오류 | `.env` 파일 확인 |
| Firebase 연결 실패 | 환경 변수 미설정 | `.env.local` 파일 생성 |
| 마커가 보이지 않음 | 데이터 형식 오류 | latitude/longitude 타입 확인 |
| 빌드 실패 | 의존성 충돌 | `node_modules` 삭제 후 재설치 |

### 9.2 디버깅 도구

**React DevTools:**
- Chrome 확장 프로그램 설치
- 컴포넌트 상태 및 Props 확인

**Vite DevTools:**
- 브라우저 개발자 도구 (F12)
- Network 탭에서 API 요청 확인

**Firebase Emulator:**
```bash
firebase emulators:start
```

### 9.3 에러 메시지 해결

**"Cannot find module '@react-google-maps/api'"**
```bash
npm install @react-google-maps/api
```

**"Firebase: Error (auth/invalid-api-key)"**
- `.env` 파일의 API 키 확인
- Firebase Console에서 API 키 재발급

---

## 10. 참고 자료

### 10.1 공식 문서

- [React 공식 문서](https://react.dev)
- [Vite 공식 문서](https://vitejs.dev)
- [Firebase 문서](https://firebase.google.com/docs)
- [Google Maps API 문서](https://developers.google.com/maps/documentation/javascript)
- [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/)

### 10.2 유용한 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 미리보기 |
| `npm run lint` | ESLint 실행 |
| `firebase deploy` | Firebase에 배포 |

### 10.3 추천 VS Code 확장 프로그램

- **ES7+ React/Redux/React-Native snippets**: React 스니펫
- **Prettier**: 코드 포맷팅
- **ESLint**: 코드 린팅
- **Firebase**: Firebase 관리
- **Tailwind CSS IntelliSense**: CSS 자동완성

---

## 11. 다음 단계

### Phase 2 개발 계획

1. **필터링 기능 추가**
   - 날짜 범위 선택
   - 지역 필터
   - 원인별 필터

2. **차트 추가**
   ```bash
   npm install chart.js react-chartjs-2
   ```
   - 월별 발생 현황 (막대 그래프)
   - 지역별 비율 (원형 그래프)

3. **실시간 데이터 연동**
   - Firestore onSnapshot 활용
   - 실시간 업데이트

4. **검색 기능**
   - 지역명 검색
   - 날짜 검색

---

## 부록

### A. 환경 변수 전체 목록

```env
# Google Maps
VITE_GOOGLE_MAPS_API_KEY=

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### B. Git 워크플로우

```bash
# 새 기능 브랜치 생성
git checkout -b feature/filter-component

# 변경사항 커밋
git add .
git commit -m "feat: Add filter component"

# 원격 저장소에 푸시
git push origin feature/filter-component
```

---

**문서 작성일:** 2024-10-22
**작성자:** 개발팀
**버전:** 1.0

---

**🎉 개발 문서 끝**

추가 질문이나 문제가 있으시면 이슈를 등록해주세요!
