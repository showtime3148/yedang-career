# 예당고등학교 진로 탐색 앱

중학생 대상 학교 홍보용. 학생이 진로희망을 입력하면 예당고에서 할 활동·과목·탐구주제·
생활기록부 기록·대학/전형까지 1·2·3학년 로드맵으로 보여줍니다.

## 구성 (정적 사이트, 서버 불필요)

- `index.html` — 화면·로직 전부
- `data.js`   — 모든 내용(학교 활동, 과목, 진로 매핑, 대학 전형 등). **내용 수정은 이 파일만**
- 두 파일은 항상 같은 폴더에 두세요. 외부 라이브러리·폰트·이미지 없음.

## 로컬 실행

`index.html` 더블클릭.

## 웹 배포

### 방법 A. Netlify Drop (가장 빠름, 2분)

1. https://app.netlify.com/drop 접속
2. 이 폴더(`예당고-진로탐색`)를 통째로 브라우저 창에 끌어다 놓기
3. 즉시 `https://랜덤이름.netlify.app` 주소 발급
4. 무료 계정으로 로그인하면 주소 유지 + 이름 변경 가능
5. 수정 후 재배포: 같은 폴더를 다시 끌어다 놓기 (Deploys 탭)

### 방법 B. GitHub Pages (무료, 주소 안정적, 업데이트 쉬움)

1. github.com 가입 → New repository (예: `yedang-career`), Public
2. 이 폴더의 `index.html`, `data.js`, `README.md` 업로드 (Add file → Upload files → Commit)
3. Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → Save
4. 1~2분 후 `https://<아이디>.github.io/yedang-career/` 공개
5. 수정: 파일 다시 업로드(커밋)하면 자동 재배포

### 방법 C. Cloudflare Pages / Vercel

계정 생성 후 폴더 업로드 또는 GitHub 연결. 빌드 설정은 비워두면 됨(정적).

## 배포 후

- HTTPS 자동 적용
- 학교 도메인 연결 원하면 각 서비스의 "Custom domain"에서 설정
- 휴대폰으로 주소 열어 반응형 확인

## 다음 단계 — 결과를 한곳에 모으기

현재 "저장한 결과"는 **접속한 그 브라우저에만** 저장됩니다(기기마다 따로).
여러 학생 결과를 선생님이 한곳에서 보려면 Google Apps Script + 구글 시트 연동이 필요합니다.
`index.html`의 `saveResult()`에서 시트로 `fetch` 한 줄 보내도록 추가하면 됩니다.
(현재 「전체 CSV 내보내기」의 열 구조를 시트 열과 맞춰 두었습니다.)
