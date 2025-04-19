## 프로젝트

> TurboRepo 기반 모노레포 구조로 개발되는 React + Express + WebSocket 프로젝트  
> 프론트는 React (3000), 백엔드는 Express (4000), WebSocket 서버는 4500부터 포트가 증가하며 동작합니다.

---

## ✅ PowerShell에서 Git이나 Node 명령어 실행을 위한 일회성 권한 부여

### Windows 환경에서 `npx`, `npm` 명령어가 PowerShell에서 막힐 때:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope Process
```

> 이 명령어는 현재 PowerShell 세션에서만 스크립트 실행을 임시로 허용합니다.
> PowerShell을 재시작하면 다시 제한되므로, 항상 열 때마다 실행해 주세요.
> 영구 적용하고 싶다면 -Scope CurrentUser로 변경할 수 있습니다.

---

# 앞으로 SSL 설정을 위해 알아두면 좋은 것들

---

## 프로덕션에서 WebSocket과 Express 서버를 HTTPS + WSS로 운영하려면:

### 1. Let's Encrypt (무료 SSL 인증서 발급 도구)

> 무료 SSL 인증서를 발급해주는 서비스
> certbot을 사용해 Ubuntu 서버에서 간편하게 설정 가능
> Nginx와 통합 시 자동 갱신까지 가능

### 2. WebSocket은 반드시 HTTPS 환경에서 wss://로 동작해야 함

> 브라우저는 HTTP에서 ws:// 연결을 차단함
> 따라서 Nginx + SSL 설정이 필요함

### 3. 배포 예시 구조

```
[브라우저]
    ↓ HTTPS / WSS
[Nginx (SSL 처리)]
    ↓ Proxy
[Express 서버 + WebSocket 서버]
```
### 4. 포트 계획

> React 웹: 3000
> Express API: 4000
> WebSocket 서버: 4500부터 1씩 증가하며 추가 예정

---

# 앞으로 환경을 잡아가는 추천 순서

---

## 이 프로젝트는 백엔드와 프론트엔드가 동시에 성장하며 WebSocket을 포함한 실시간 기능을 개발하는 구조입니다.

## 추천 순서

### 1. .env 환경변수 세팅

> PORT, NODE_ENV, DB_URL 등 환경별로 분리된 값 관리

### 2. Express 폴더 구조 정리

> routes/, controllers/, middlewares/, services/ 디렉토리로 분리

### 3. 프론트 → 백엔드 API 연결 테스트

> React에서 fetch로 API 요청 및 응답 확인

### 4. WebSocket 서버 (ws) 기본 구조 생성

> 클라이언트 연결 감지, 메시지 수신/송신 테스트

### 5. CORS, 에러 핸들링 미들웨어 등 기본 Express 설정 정리

> 배포 시 Nginx + SSL + WebSocket 리버스 프록시 구성

### 6. Ubuntu + certbot + systemd or pm2 활용

> GitHub Actions, Docker, CI/CD 파이프라인 추가 (선택)


---

# 더 알아두면 좋은 것들

---

### ✅ TypeScript alias (paths) 적극 활용
> "config", "utils"처럼 절대 경로로 import 가능하게 해두면 유지보수성 상승

### ✅ Express는 구조화가 생명
> 처음부터 routes, controllers, services, middlewares 디렉토리로 나누는 습관이 중요

### ✅ WebSocket은 상태 관리가 핵심
> 접속한 사용자, 방, 메시지 흐름을 명확하게 추적할 수 있어야 함

### ✅ 개발할 땐 빠른 피드백 루프가 중요
> ts-node-dev 같은 툴로 핫 리로드 개발환경 유지

### ✅ 배포 준비 시에는 PM2 또는 Docker 고려
> 서버 안정성 + 자동 재시작 + 로그 관리 + 로드밸런싱 가능

### ✅ Git 커밋 메시지 컨벤션, 브랜치 전략도 미리 정의해두면 협업이 쉬워짐

--- 

# 📂 프로젝트 구조 예시 (계획 중)
```
lod/
├── apps/
│   ├── web/       # React 앱
│   └── api/       # Express 서버
├── packages/
│   ├── config/    # 환경설정
│   ├── models/    # DB 모델 등
│   └── utils/     # 공통 유틸
├── turbo.json
├── package.json
└── tsconfig.json
```
