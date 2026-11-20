# 예당고 진로 내비 (v2)

중학생·학부모 대상 학교 홍보 겸 진로 탐색 웹앱. 장래희망을 입력하면 예당고에서의
1·2·3학년 로드맵(과목·탐구 주제·창체·독서·생기부·대학/전형)과 대표 직업 정보를 보여 주고,
개인 진로 상담(학생 30분 / 학부모 동반 60분)을 예약받습니다.

## 주소

- 학생·학부모용: https://yedang-career.vercel.app
- 상담 관리(선생님용): https://yedang-career.vercel.app/admin — 비밀번호는 Vercel 환경변수 `ADMIN_PASSWORD`

## 구성

| 경로 | 내용 |
| --- | --- |
| `public/index.html`, `public/assets/app.js`, `app.css` | 화면 |
| `public/assets/data-base.js` | 학교 소개·과목·동아리·프로그램·학년별 공통 안내 |
| `public/assets/data-fields.js` | 23개 진로 분야(직업 정보, 로드맵, 탐구 주제, 대학) |
| `public/assets/data-admissions.js` | 대학 목록, 2028 대입 변화 |
| `public/admin.html`, `public/assets/admin.js` | 상담 관리 화면 |
| `api/` | 상담 예약 API (Vercel Functions) |
| `lib/schedule.js` | 상담 가능 기간·요일·시간·공휴일 |

내용 수정은 `public/assets/data-*.js`, 상담 기간·시간 변경은 `lib/schedule.js`만 고치면 됩니다.

## 저장

예약 정보는 Vercel Blob 비공개 저장소(`yedang-career-bookings`, 서울 리전)에 저장됩니다.
같은 시간 중복 예약은 시간대 파일을 먼저 선점하는 방식으로 막습니다.
