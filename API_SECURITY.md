# 🔐 Google Maps API 키 보안 설정 가이드

## ⚠️ 긴급: API 키가 노출되었나요?

API 키를 채팅, 공개 저장소, 또는 다른 곳에 공유했다면 **즉시** 아래 조치를 취하세요.

---

## 🚨 1단계: 즉시 조치 (필수)

### 옵션 A: API 키 제한 설정 (권장)
빠르고 간단하며, 기존 코드 수정 없음

### 옵션 B: API 키 삭제 및 재생성
가장 안전하지만, 새 키로 교체 필요

---

## 🛡️ 옵션 A: HTTP 리퍼러 제한 설정 (권장)

### 1. Google Cloud Console 접속
https://console.cloud.google.com/apis/credentials

### 2. API 키 편집
- 해당 API 키 옆의 **연필 아이콘** 클릭
- 또는 API 키 이름을 직접 클릭

### 3. 애플리케이션 제한사항 설정

**"애플리케이션 제한사항"** 섹션에서:
- ✅ **"HTTP 리퍼러(웹사이트)"** 선택
- ❌ "없음" 선택 해제

### 4. 웹사이트 제한사항 추가

**"웹사이트 제한사항"** 에서 **"+ 항목 추가"** 클릭 후 아래 URL 입력:

```
http://localhost:*
http://127.0.0.1:*
http://localhost:5173/*
```

**프로덕션 환경이 있다면 추가:**
```
https://yourdomain.com/*
https://*.yourdomain.com/*
```

**설명:**
- `*` = 모든 경로 허용
- `localhost:*` = 모든 로컬 포트 허용
- 특정 포트만: `localhost:5173/*`

### 5. API 제한사항 설정

**"API 제한사항"** 섹션에서:
- ✅ **"키 제한"** 선택
- ❌ "API 제한사항 적용 안함" 해제

**"API 선택"** 드롭다운에서:
- ✅ **Maps JavaScript API** 체크

### 6. 저장 및 확인

1. 하단 **"저장"** 버튼 클릭
2. "사용자 인증 정보가 업데이트됨" 메시지 확인
3. **5분 정도 기다림** (변경사항 적용 시간)

### 7. 테스트

```bash
# 개발 서버 재시작
cd wildfire-stats
npm run dev
```

브라우저에서 http://localhost:5173 접속
- ✅ 지도가 정상 표시되면 성공!
- ❌ 에러 발생 시 → 리퍼러 설정 재확인

---

## 🔄 옵션 B: API 키 재생성 (가장 안전)

### 1. 기존 API 키 삭제
https://console.cloud.google.com/apis/credentials

1. 노출된 API 키 찾기
2. 오른쪽 **⋮ (점 3개)** 클릭
3. **"사용자 인증 정보 삭제"** 클릭
4. 확인 대화상자에서 **"삭제"** 클릭

### 2. 새 API 키 생성
1. **"+ 사용자 인증 정보 만들기"** 클릭
2. **"API 키"** 선택
3. 새 API 키 복사

### 3. 새 키로 제한 설정 (위의 옵션 A 참고)
바로 위의 옵션 A의 3~6단계 진행

### 4. .env 파일 업데이트
```bash
# .env 파일 열기
nano wildfire-stats/.env
```

새 API 키로 교체:
```env
VITE_GOOGLE_MAPS_API_KEY=새로운_API_키_입력
```

### 5. 서버 재시작
```bash
cd wildfire-stats
npm run dev
```

---

## ✅ 제한 설정 확인 방법

### Google Cloud Console에서 확인
1. https://console.cloud.google.com/apis/credentials
2. API 키 클릭
3. 다음 항목 확인:
   - **애플리케이션 제한사항:** HTTP 리퍼러(웹사이트)
   - **웹사이트 제한사항:** localhost 등록됨
   - **API 제한사항:** Maps JavaScript API만 선택됨

### 실제 테스트
1. 개발 서버 실행: `npm run dev`
2. http://localhost:5173 접속 → ✅ 지도 표시됨
3. 다른 도메인에서 API 키 사용 시도 → ❌ 차단됨

---

## 📊 보안 수준 비교

| 설정 | 보안 수준 | 위험도 | 권장 |
|------|---------|--------|------|
| 제한 없음 | ⚠️ 매우 낮음 | 높음 | ❌ 절대 사용 금지 |
| HTTP 리퍼러 제한 | ✅ 높음 | 낮음 | ✅ 권장 |
| HTTP 리퍼러 + API 제한 | ✅ 매우 높음 | 매우 낮음 | ✅ 최고 권장 |
| IP 제한 (백엔드) | ✅ 최고 | 없음 | 서버 전용 |

---

## 💰 비용 모니터링

### 예산 알림 설정
1. https://console.cloud.google.com/billing
2. "예산 및 알림" 클릭
3. "예산 만들기" 클릭
4. 한도 설정 (예: 월 $10)
5. 알림 임계값: 50%, 90%, 100%

### 사용량 확인
https://console.cloud.google.com/apis/dashboard

- 일일/월간 요청 수 확인
- 비정상적인 트래픽 감지

---

## 🆘 문제 해결

### Q: 제한 설정 후 지도가 안 나옵니다
**A:**
1. 5분 정도 기다림 (설정 적용 시간)
2. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
3. 개발 서버 재시작
4. F12 콘솔에서 에러 확인
5. 리퍼러 URL 정확히 입력했는지 재확인

### Q: "This API key is not authorized to use this service" 에러
**A:**
- API 제한사항에서 "Maps JavaScript API" 체크 확인
- 해당 API가 활성화되어 있는지 확인

### Q: 프로덕션 배포 후 지도가 안 나옵니다
**A:**
- 실제 도메인을 리퍼러에 추가했는지 확인
- HTTPS 사용 시 `https://` 로 시작하는지 확인
- 와일드카드 `*` 사용 확인

---

## 📋 체크리스트

설정을 완료했다면 다음을 확인하세요:

- [ ] HTTP 리퍼러 제한 설정 완료
- [ ] localhost 리퍼러 추가
- [ ] Maps JavaScript API만 제한
- [ ] 로컬에서 테스트 성공
- [ ] .env 파일이 .gitignore에 포함됨
- [ ] 예산 알림 설정 (선택)
- [ ] 사용량 모니터링 확인 (선택)

---

## 🔗 참고 자료

- [Google Maps API 키 보안 권장사항](https://developers.google.com/maps/api-security-best-practices)
- [API 키 제한 설정 공식 문서](https://cloud.google.com/docs/authentication/api-keys)
- [Google Cloud 비용 관리](https://cloud.google.com/billing/docs/how-to/budgets)

---

**💡 팁:** API 키는 절대 Git에 커밋하지 마세요! 이미 커밋했다면 Git 히스토리에서도 완전히 제거해야 합니다.
