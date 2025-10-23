# 🗺️ Google Maps API 설정 가이드

이 프로젝트는 Google Maps API를 사용하여 산불 발생 위치를 지도에 표시합니다.

## 📋 필요한 사전 준비

1. Google 계정 (Gmail)
2. 신용카드 (무료 크레딧 사용 가능, 실제 과금은 사용량 초과 시에만 발생)

---

## 🔑 1. Google Maps API 키 발급 받기

### Step 1: Google Cloud Console 접속
1. https://console.cloud.google.com/ 접속
2. Google 계정으로 로그인

### Step 2: 프로젝트 생성
1. 상단의 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: `wildfire-stats`)
4. "만들기" 클릭

### Step 3: Maps JavaScript API 활성화
1. 좌측 메뉴에서 "API 및 서비스" > "라이브러리" 클릭
2. "Maps JavaScript API" 검색
3. "Maps JavaScript API" 클릭
4. "사용 설정" 버튼 클릭

### Step 4: API 키 생성
1. 좌측 메뉴에서 "사용자 인증 정보" 클릭
2. 상단의 "+ 사용자 인증 정보 만들기" 클릭
3. "API 키" 선택
4. API 키가 생성됨 → **복사해서 안전한 곳에 보관**

### Step 5: API 키 제한 설정 (보안 강화) ⚠️ 필수!
> **중요:** API 키를 공개적으로 노출했다면 반드시 제한 설정을 해야 합니다!

1. 생성된 API 키 옆의 **편집 아이콘(연필)** 클릭
2. **"애플리케이션 제한사항"**에서 **"HTTP 리퍼러(웹사이트)"** 선택
3. **"웹사이트 제한사항"** 섹션에서 "+ 항목 추가" 클릭 후 입력:
   ```
   http://localhost:*
   http://127.0.0.1:*
   http://localhost:5173/*
   ```

   **프로덕션 배포 시 실제 도메인 추가:**
   ```
   https://your-domain.com/*
   https://*.your-domain.com/*
   ```

4. **"API 제한사항"**에서 **"키 제한"** 선택
5. 드롭다운에서 **"Maps JavaScript API"** 체크 ✓
6. 하단의 **"저장"** 버튼 클릭
7. 변경 사항이 적용되기까지 몇 분 대기

**효과:** 이제 허용된 도메인에서만 API 키가 작동합니다. 다른 사이트에서 도용해도 사용할 수 없습니다!

---

## ⚙️ 2. 프로젝트 설정

### Step 1: .env 파일 생성
프로젝트 루트의 `wildfire-stats` 폴더에서:

```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

### Step 2: API 키 입력
`.env` 파일을 열고 발급받은 API 키를 입력:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...발급받은_실제_키
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: 개발 서버 실행

```bash
# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 표시된 포트) 접속

---

## ✅ 3. 정상 작동 확인

### 성공 시:
- 지도가 대한민국 중심으로 표시됨
- 산불 발생 지점에 색상별 마커가 표시됨
- 마커 클릭 시 상세 정보 팝업

### 실패 시:
- "지도를 로드할 수 없습니다" 에러 메시지 표시
- 에러 원인 확인:
  1. API 키가 올바르게 입력되었는지 확인
  2. Google Cloud Console에서 Maps JavaScript API가 활성화되었는지 확인
  3. 브라우저 콘솔(F12)에서 상세 에러 확인

---

## 💰 4. 비용 관련 정보

### 무료 크레딧
- Google은 매월 $200 무료 크레딧 제공
- Maps JavaScript API: 월 28,500회 로드 무료
- 대부분의 개인 프로젝트는 무료 범위 내에서 사용 가능

### 비용 발생 방지
1. API 키 제한 설정 (위 Step 5 참고)
2. Google Cloud Console에서 예산 알림 설정
3. 불필요한 API 호출 최소화

---

## 🔒 5. 보안 주의사항

⚠️ **절대 하지 말아야 할 것:**
- `.env` 파일을 Git에 커밋하지 마세요
- API 키를 공개 저장소에 업로드하지 마세요
- API 키를 다른 사람과 공유하지 마세요

✅ **권장 사항:**
- `.env` 파일은 `.gitignore`에 포함되어 있음 (확인 필수)
- 프로덕션 배포 시 환경 변수로 관리
- API 키는 정기적으로 재생성

---

## 🆘 문제 해결

### 문제: "이 페이지에서 Google Maps를 올바르게 로드할 수 없습니다"
**해결책:**
1. 청구 계정이 활성화되었는지 확인
2. Maps JavaScript API가 사용 설정되었는지 확인
3. API 키 제한사항 확인 (localhost 허용 여부)

### 문제: 지도가 회색으로만 표시됨
**해결책:**
1. 브라우저 콘솔(F12)에서 에러 메시지 확인
2. API 키 오타 확인
3. 개발 서버 재시작 (`Ctrl+C` 후 `npm run dev`)

### 문제: API 키를 변경했는데 적용이 안 됨
**해결책:**
1. 개발 서버 완전히 종료
2. `.env` 파일 저장 확인
3. 브라우저 캐시 삭제 후 재시작
4. 개발 서버 재시작

---

## 📚 참고 문서

- [Google Maps JavaScript API 공식 문서](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)

---

## 📞 도움이 필요하신가요?

이슈가 있다면 프로젝트의 GitHub Issues에 등록해주세요.
