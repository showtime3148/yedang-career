/* =====================================================================
 * 예당고 진로 내비 · 기본 데이터 (학교 · 과목 · 동아리 · 프로그램)
 * ---------------------------------------------------------------------
 * 출처: 2026학년도 예당고등학교 교육계획서, 2026년 11월 학교 현황
 * 이 파일과 data-fields.js 만 고치면 앱 내용이 바뀝니다.
 * ===================================================================== */
(function () {
  var SCHOOL = {
    name: "예당고등학교",
    short: "예당고",
    tagline: "세계와 미래로 웅비하는 창의적 인재 육성",
    location: "전남 보성군 득량면 예당길 155-12",
    site: "https://yedang.hs.jne.kr",
    // 메인 화면 '예당고는 이런 학교예요' 카드
    highlights: [
      { icon: "ai", title: "AI 중점학교 · 전남 최우수 사례", desc: "2026 AI 중점학교 운영 전남 최우수 사례로 선정. 2027년부터는 AI·로봇 진로 학생뿐 아니라 전교생이 AI를 잘 쓰는 '모두의 AI' 학교로 운영합니다." },
      { icon: "spark", title: "AI 온이음 · 전교생 유료 AI", desc: "AI 온이음 사업 선정으로 전교생이 유료 AI를 사용합니다. 학교 AI 비서 '자비스', 수행평가 도우미 등 선생님이 만든 학교 전용 AI 도구도 함께 씁니다." },
      { icon: "globe", title: "IB DP(국제 바칼로레아) 추진", desc: "보성 최초 IB DP 후보학교 추진(2026년 10월 후보 신청서 제출). 2027학년도 신입생은 1학년에 Pre-DP를 경험하고, 2028년 DP 운영을 목표로 합니다." },
      { icon: "chip", title: "미니 반도체 팹 (2027 구축 예정)", desc: "교내에 미니 반도체 팹을 만들어 반도체 8대 공정을 직접 체험합니다. 반도체·전자공학 진로 학생의 탐구 무대가 됩니다." },
      { icon: "room", title: "2030 AI 아고라 · AI실 · 무한상상실", desc: "토론·협업형 미래 교실 2030 AI 아고라, AI실, 메이커 공간 무한상상실, 지능형 과학실에서 수업과 프로젝트를 합니다." },
      { icon: "path", title: "고교학점제 · 1:1 과목 선택 상담", desc: "진로에 맞는 과목을 직접 골라 시간표를 설계합니다. 신입생 고교학점제 캠프와 과목 선택 자료집 「진로 선택 길라잡이」를 제공합니다." },
      { icon: "home", title: "기숙사 심경학사 · 농어촌 자율학교", desc: "야간 자기주도학습과 방과후 프로그램으로 사교육 없이도 공부를 이어갈 수 있습니다." },
      { icon: "flask", title: "과학중점 · 융합 프로그램", desc: "1학생 1탐구, 융합형 STEAM R&E, '별 헤는 밤' 천체관측, 한림원 석사와의 만남, 전남거점 인공지능 융합교실(매주 토요일)." }
    ],
    // 올해(2027학년도) 주목할 소식 — 최종 발표 후 status 를 "합격"으로 바꾸면 화면 문구가 바뀝니다
    news: { year: 2027, title: "의예과 도전", unis: ["전남대", "전북대", "제주대"], dept: "의예과", status: "최저 충족", note: "2027학년도 수시에서 의예과 세 곳에 지원해 수능 최저학력기준을 모두 충족했습니다(가채점 기준). 최종 합격 발표를 기다리고 있어요." },
    // 최근 3개년 대학 진학 결과 (출처: 예당고 진학실적표)
    results: [
      { year: 2026, metro: ["한국외대", "동국대", "건국대", "인하대", "국민대", "서울과학기술대", "가천대", "광운대", "홍익대"], special: ["광주교대", "국군간호사관학교"], local: "전남대 14명, 전북대 13명, 충남대 3명, 충북대 1명, 한국농수산대 1명 등 47명" },
      { year: 2025, metro: ["연세대", "한양대", "경희대", "건국대", "동국대", "가천대", "아주대", "가톨릭대"], special: ["한국교원대", "경인교대", "광주교대"], local: "전남대 16명, 전북대 7명, 조선대 11명, 순천대 16명 등 42명" },
      { year: 2024, metro: ["광운대", "아주대", "서울과학기술대"], special: ["광주교대", "공군사관학교"], local: "전남대 약학부 외 12명, 전북대, 부산대, 부경대 등 63명" }
    ],
    // 진로와 상관없이 모두가 참여하는 프로그램
    commonPrograms: [
      "진로특강 · 진로체험의 날 (진로전담교사 상담 매주 운영)",
      "대학 탐방(연 1회) · 진로체험형 소규모 테마 수학여행",
      "선배와의 만남 멘토링 · 서울대 나눔교실(대학생 멘토링)",
      "학생 주도형 프로젝트 봉사활동 '따뜻한 동행'",
      "고교학점제 안내 캠프 · 과목 선택 자료집 「진로 선택 길라잡이」",
      "전교생 AI 교육 · 생성형 AI 해커톤 캠프(추진)"
    ]
  };

  /* 시설 둘러보기 — 사진 출처: 예당고 홈페이지 '시설둘러보기' 게시판. photos 는 /api/photo?k= 키 */
  function ph(id, n) { var a = []; for (var i = 1; i <= n; i++) a.push(id + "-" + i); return a; }
  // 사진 원본 주소(학교 홈페이지)
  var PHOTO_SRC = {"jayul-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1801298493/img_9ed4v5e77=8fvfc=41v64=aev39=f05bvbc47v4b51_v6470.jpg", "jayul-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1801298493/img_7c05v6f44=aev33=40v1e=95v48=3dc2va293v150e_v984.jpg", "jayul-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1801298493/img_6a46v9411=6dve9=4fve0=a5va5=7436vae7fv1f7c_v833.jpg", "agora-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800948283/img_789fvb3ff=d7ved=46vaa=a8v60=4094v561dv9f5f_v1713.jpg", "agora-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800948283/img_e257va45f=5bvf9=42v86=9fva8=6239v22e4va2d9_v6743.jpg", "lang-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800359796/img_737ev883e=95vd7=46va8=bev19=f0fevcfdfv63b0_v6695.jpg", "lang-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800359796/img_f1a7v777f=97v4d=45vee=89vc3=9c11v5017v72ce_v9612.jpg", "lang-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800359796/img_9a2cv211d=deva2=4bvde=bfv15=e786v8d58v99f3_v1247.jpg", "library-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800359789/img_9f7bva1b1=0ev19=4ev39=b8ve6=917fvf996vd477_v1161.jpg", "library-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800359789/img_acc9v9c44=25v14=43v95=9dv9c=91dev1ba5vef89_v5195.jpg", "library-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800359789/img_8fffv5b06=13vb4=45v79=88v78=b650v7e09v1850_v8494.jpg", "library-4": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/na/bbs_147224/ntt_1800359789/img_b6b5v1566=6eva0=48v0c=8cv5a=4b49v726ev3e6c_v1697.jpg", "dorm-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_2_1655772056841.jpg", "dorm-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_6_1655772056961.jpg", "dorm-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_1_1655772056841.jpg", "dorm-4": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_0_1655772056781.jpg", "dorm-5": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_4_1655772056901.jpg", "dorm-6": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_8_1655772057021.jpg", "dorm-7": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_3_1655772056901.jpg", "dorm-8": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_5_1655772056961.jpg", "dorm-9": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1432394661_7_1655772056961.jpg", "newdorm-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_0_1654827805670.jpg", "newdorm-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_2_1654827805730.jpg", "newdorm-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_5_1654827805790.jpg", "newdorm-4": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_6_1654827805790.jpg", "newdorm-5": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_7_1654827805790.jpg", "newdorm-6": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_1_1654827805730.jpg", "newdorm-7": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_3_1654827805730.jpg", "newdorm-8": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1426288334_4_1654827805730.jpg", "airoom-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1163133212_0_1622075682721.jpg", "airoom-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1163133212_1_1622075682841.jpg", "airoom-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1163133212_4_1622075682901.jpg", "airoom-4": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1163133212_2_1622075682841.jpg", "airoom-5": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1163133212_3_1622075682901.jpg", "track-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053327922_0_1607910310646.jpg", "track-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053327922_2_1607910310646.jpg", "track-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053327922_5_1622076006658.jpg", "track-4": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053327922_1_1607910310646.jpg", "track-5": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053327922_4_1622076006591.jpg", "track-6": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053327922_4_1607910310705.jpg", "cafe-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053320921_1_1607909657226.jpg", "cafe-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053320921_3_1607909657226.jpg", "cafe-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053320921_2_1607909657226.jpg", "cafe-4": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053320921_0_1607909657105.jpg", "golf-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053276788_2_1607906844843.jpg", "golf-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053276788_1_1607906844843.jpg", "golf-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053276788_3_1607906844904.jpg", "golf-4": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/1053276788_0_1607906844843.jpg", "gym-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990655153_1_1601859661288.jpg", "gym-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990655153_0_1601859661228.jpg", "computer-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990651555_0_1601859512888.jpg", "jeongdok-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990650617_2_1601860194688.jpg", "jeongdok-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990650617_1_1601860194688.jpg", "jeongdok-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990650617_0_1601859469258.jpg", "maker-1": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990648088_2_1601860059258.jpg", "maker-2": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990648088_0_1601859356609.jpg", "maker-3": "https://yedang.jge.hs.kr/data/attach_data/goheung/yedang_hs/k2board/990648088_1_1601860059258.jpg"};
  var FACILITIES = [
    { group: "공부하는 곳", items: [
      { id: "jayul", name: "자율학습실", desc: "스스로 공부하는 자율학습 공간입니다.", photos: ph("jayul", 3) },
      { id: "jeongdok", name: "정독실", desc: "조용히 집중해서 공부하는 정독실입니다.", photos: ph("jeongdok", 3) },
      { id: "library", name: "도서관 혜윰", desc: "장서 9,989권, 좌석 70여 석의 학교 도서관입니다.", photos: ph("library", 4) },
      { id: "cafe", name: "온라인 학습카페", desc: "온라인 강의를 듣고 함께 공부하는 카페형 학습 공간입니다.", photos: ph("cafe", 4) }
    ] },
    { group: "AI · 미래 교실", items: [
      { id: "agora", name: "2030교실 (2030 AI 아고라)", desc: "AI 중심 교육 활동을 하는 미래형 교실입니다.", photos: ph("agora", 2) },
      { id: "airoom", name: "AI 인공지능 정보교육실", desc: "AI·정보 수업을 하는 교실입니다.", photos: ph("airoom", 5) },
      { id: "maker", name: "무한상상실 (SW교실)", desc: "소프트웨어·메이커 활동을 하는 공간입니다.", photos: ph("maker", 3) },
      { id: "computer", name: "컴퓨터실", desc: "정보 수업과 컴퓨터 실습을 하는 교실입니다.", photos: ph("computer", 1) },
      { id: "lang", name: "어학실", desc: "1층에 있는 외국어 학습 교실입니다.", photos: ph("lang", 3) }
    ] },
    { group: "생활 · 기숙사", items: [
      { id: "dorm", name: "기숙사 심경학사", desc: "학교 기숙사입니다. 야간 자기주도학습과 방과후 프로그램을 운영합니다.", photos: ph("dorm", 9) },
      { id: "newdorm", name: "새 기숙사", desc: "새로 지은 기숙사 건물입니다.", photos: ph("newdorm", 8) }
    ] },
    { group: "운동 · 쉼", items: [
      { id: "gym", name: "진은관 (체육관)", desc: "학교 실내 체육관입니다.", photos: ph("gym", 2) },
      { id: "golf", name: "스크린 골프장", desc: "최첨단 스크린 골프장입니다.", photos: ph("golf", 4) },
      { id: "track", name: "맨발걷기 돌길 · 모래 트랙", desc: "맨발로 걷는 마사지 돌길과 규사(모래) 트랙입니다.", photos: ph("track", 6) }
    ] }
  ];

  /* 과목 (2022 개정 교육과정 / 예당고 편제 기준) — type: 공통 / 일반 / 진로 / 융합 */
  var S = {
    gukong: { name: "공통국어1·2", type: "공통", area: "국어" },
    hwabeon: { name: "화법과 언어", type: "일반", area: "국어" },
    dokjak: { name: "독서와 작문", type: "일반", area: "국어" },
    munhak: { name: "문학", type: "일반", area: "국어" },
    jujedok: { name: "주제 탐구 독서", type: "진로", area: "국어" },
    munyeong: { name: "문학과 영상", type: "진로", area: "국어" },
    jikmu: { name: "직무 의사소통", type: "진로", area: "국어" },
    dokto: { name: "독서 토론과 글쓰기", type: "융합", area: "국어" },
    maeche: { name: "매체 의사소통", type: "융합", area: "국어" },
    suong: { name: "공통수학1·2", type: "공통", area: "수학" },
    daesu: { name: "대수", type: "일반", area: "수학" },
    mijeok1: { name: "미적분Ⅰ", type: "일반", area: "수학" },
    hwaktong: { name: "확률과 통계", type: "일반", area: "수학" },
    giha: { name: "기하", type: "진로", area: "수학" },
    mijeok2: { name: "미적분Ⅱ", type: "진로", area: "수학" },
    gyeongsu: { name: "경제 수학", type: "진로", area: "수학" },
    aisu: { name: "인공지능 수학", type: "진로", area: "수학" },
    siltong: { name: "실용 통계", type: "융합", area: "수학" },
    sugwaje: { name: "수학과제 탐구", type: "융합", area: "수학" },
    yeongong: { name: "공통영어1·2", type: "공통", area: "영어" },
    yeong1: { name: "영어Ⅰ·Ⅱ", type: "일반", area: "영어" },
    yeongdok: { name: "영어 독해와 작문", type: "일반", area: "영어" },
    yeongmi: { name: "영미 문학 읽기", type: "진로", area: "영어" },
    yeongbal: { name: "영어 발표와 토론", type: "진로", area: "영어" },
    simyeong: { name: "심화 영어 / 심화 영어 독해와 작문", type: "진로", area: "영어" },
    jikyeong: { name: "직무 영어", type: "진로", area: "영어" },
    segyeyeong: { name: "세계 문화와 영어", type: "융합", area: "영어" },
    midiayeong: { name: "미디어 영어", type: "융합", area: "영어" },
    hanguksa: { name: "한국사1·2", type: "공통", area: "사회" },
    tongsahoe: { name: "통합사회1·2", type: "공통", area: "사회" },
    segjiri: { name: "세계시민과 지리", type: "일반", area: "사회" },
    segsa: { name: "세계사", type: "일반", area: "사회" },
    sahoemunhwa: { name: "사회와 문화", type: "일반", area: "사회" },
    hyeondaeyunri: { name: "현대사회와 윤리", type: "일반", area: "사회" },
    hangukjiri: { name: "한국지리 탐구", type: "진로", area: "사회" },
    dosimirae: { name: "도시의 미래 탐구", type: "진로", area: "사회" },
    dongasiah: { name: "동아시아 역사 기행", type: "진로", area: "사회" },
    jeongchi: { name: "정치", type: "진로", area: "사회" },
    beopsahoe: { name: "법과 사회", type: "진로", area: "사회" },
    gyeongje: { name: "경제", type: "진로", area: "사회" },
    yunrisasang: { name: "윤리와 사상", type: "진로", area: "사회" },
    inmunyunri: { name: "인문학과 윤리", type: "진로", area: "사회" },
    gukjegwan: { name: "국제 관계의 이해", type: "진로", area: "사회" },
    yeohaengjiri: { name: "여행지리", type: "융합", area: "사회" },
    yeoksatam: { name: "역사로 탐구하는 현대 세계", type: "융합", area: "사회" },
    sahoemunje: { name: "사회문제 탐구", type: "융합", area: "사회" },
    geumyung: { name: "금융과 경제생활", type: "융합", area: "사회" },
    yunrimunje: { name: "윤리문제 탐구", type: "융합", area: "사회" },
    gihubyeonhwa: { name: "기후변화와 지속가능한 세계", type: "융합", area: "사회" },
    tonggwahak: { name: "통합과학1·2", type: "공통", area: "과학" },
    gwatamsil: { name: "과학탐구실험1·2", type: "공통", area: "과학" },
    mulli: { name: "물리학", type: "일반", area: "과학" },
    hwahak: { name: "화학", type: "일반", area: "과학" },
    saengmyeong: { name: "생명과학", type: "일반", area: "과학" },
    jigu: { name: "지구과학", type: "일반", area: "과학" },
    yeokhak: { name: "역학과 에너지", type: "진로", area: "과학" },
    muljil: { name: "물질과 에너지", type: "진로", area: "과학" },
    sepo: { name: "세포와 물질대사", type: "진로", area: "과학" },
    jigusystem: { name: "지구시스템과학", type: "진로", area: "과학" },
    jeonjagi: { name: "전자기와 양자", type: "진로", area: "과학" },
    hwabaneung: { name: "화학 반응의 세계", type: "진로", area: "과학" },
    yujeon: { name: "생물의 유전", type: "진로", area: "과학" },
    haengseong: { name: "행성우주과학", type: "진로", area: "과학" },
    gwahaksa: { name: "과학의 역사와 문화", type: "융합", area: "과학" },
    gihusaengtae: { name: "기후변화와 환경생태", type: "융합", area: "과학" },
    yunghaptam: { name: "융합과학 탐구", type: "융합", area: "과학" },
    cheyuk: { name: "체육1·2", type: "공통", area: "체육" },
    undong: { name: "운동과 건강", type: "일반", area: "체육" },
    sportsmunhwa: { name: "스포츠 문화", type: "진로", area: "체육" },
    sportsgwahak: { name: "스포츠 과학", type: "진로", area: "체육" },
    sportssaenghwal: { name: "스포츠 생활1·2", type: "융합", area: "체육" },
    eumak: { name: "음악", type: "일반", area: "예술" },
    misul: { name: "미술", type: "일반", area: "예술" },
    yeongeuk: { name: "연극", type: "일반", area: "예술" },
    eumakchang: { name: "음악 연주와 창작", type: "진로", area: "예술" },
    eumakgam: { name: "음악 감상과 비평", type: "진로", area: "예술" },
    misulchang: { name: "미술 창작", type: "진로", area: "예술" },
    misulgam: { name: "미술 감상과 비평", type: "진로", area: "예술" },
    eumakmidia: { name: "음악과 미디어", type: "융합", area: "예술" },
    misulmaeche: { name: "미술과 매체", type: "융합", area: "예술" },
    gigajeong: { name: "기술·가정", type: "일반", area: "기술·가정/정보" },
    jeongbo: { name: "정보", type: "일반", area: "기술·가정/정보" },
    robot: { name: "로봇과 공학세계", type: "진로", area: "기술·가정/정보" },
    saenghwalgwahak: { name: "생활과학 탐구", type: "진로", area: "기술·가정/정보" },
    aigicho: { name: "인공지능 기초", type: "진로", area: "기술·가정/정보" },
    datagwahak: { name: "데이터 과학", type: "진로", area: "기술·가정/정보" },
    gonghakseolgye: { name: "창의 공학 설계", type: "융합", area: "기술·가정/정보" },
    jisikjaesan: { name: "지식 재산 일반", type: "융합", area: "기술·가정/정보" },
    swsaenghwal: { name: "소프트웨어와 생활", type: "융합", area: "기술·가정/정보" },
    adongbalmo: { name: "아동발달과 부모", type: "융합", area: "기술·가정/정보" },
    je2oegugeo: { name: "제2외국어(중국어·일본어 등) Ⅰ·Ⅱ", type: "일반", area: "제2외국어/한문" },
    je2hoehwa: { name: "제2외국어 회화 / 심화", type: "진로", area: "제2외국어/한문" },
    je2munhwa: { name: "○○어권 문화", type: "융합", area: "제2외국어/한문" },
    hanmun: { name: "한문", type: "일반", area: "제2외국어/한문" },
    jinrojikeop: { name: "진로와 직업", type: "일반", area: "교양" },
    saengtaehwangyeong: { name: "생태와 환경", type: "일반", area: "교양" },
    cheolhak: { name: "인간과 철학", type: "진로", area: "교양" },
    nolli: { name: "논리와 사고", type: "진로", area: "교양" },
    simri: { name: "인간과 심리", type: "진로", area: "교양" },
    gyoyugihae: { name: "교육의 이해", type: "진로", area: "교양" },
    jonggyo: { name: "삶과 종교", type: "진로", area: "교양" },
    bogeon: { name: "보건", type: "진로", area: "교양" },
    ingangyeongje: { name: "인간과 경제활동", type: "융합", area: "교양" },
    nonsul: { name: "논술", type: "융합", area: "교양" }
  };

  /* 예당고 동아리 (매년 개설이 달라질 수 있음) */
  var CLUBS = {
    aimidia: "인공지능미디어랩 — AI 음악생성과 Logic Pro로 디지털 음악·음향 제작",
    dalgeurak: "달그락 — 코딩·제작 기반 메이커 활동(미세먼지 측정기, 스마트 화분 등)",
    drawing: "드로잉 — 드로잉·회화 중심 미술 창작",
    nightingale: "나이팅게일 — 보건·의료 탐구, 응급처치·건강 캠페인 기획",
    frameit: "프레임잇 — 사진·영상 등 미디어 콘텐츠 제작",
    pi: "파이(π) — 수학 탐구와 알고리즘·코딩",
    scienceLab: "창의과학연구부 — 자율 주제 탐구·실험, 연구 결과 발표",
    dadok: "다독다독 — 독서·서평·독서토론",
    hwhh: "HWHH — 영어·어학 활동",
    gongcha: "공차 — 축구·풋살",
    gyohak: "교학상장 — 또래교사·학습 멘토링",
    bookbang: "은행책방 — 독서·나눔 활동",
    aiclub: "인공지능 동아리(자율) — 심화 SW 역량, 로보마스터·알고리즘 연구",
    maeum: "학생마음챙김동아리(자율) — 심리·상담·마음건강 캠페인",
    vivid: "비비드(자율) — 댄스·공연",
    aikkum: "AI 꿈키움 동아리(무학년제) — 인공지능 원리 이해와 실제 프로젝트",
    robit: "ROBIT · AI LENS — AI 중점학교 동아리(로봇·AI 프로젝트)"
  };

  var PROGRAMS = {
    steam: "STEAM 클럽 — 과학·기술·예술 융합 창작 프로젝트",
    byeol: "'별 헤는 밤' — 천체 관측과 과학도서 탐독·발표",
    silheom: "찾아가는·찾아오는 실험실 / 사다리 프로젝트 — 심화 실험·연구 체험",
    rne: "융합형 STEAM R&E — 연구팀을 꾸려 논문형 탐구 수행",
    hanlim: "한림원 석사와의 만남 — 대학원 연구자와 진로 대화",
    gongsaeng: "공생의 길 프로젝트 — 생태·환경 실천",
    onetamgu: "1학생 1탐구 · 지능형 과학실 — 첨단 기자재 기반 개인 탐구",
    aisw: "AI·SW 융합 프로젝트 — 지역사회 문제를 AI로 해결",
    yunghap: "전남거점 인공지능 융합교실(매주 토요일)",
    ib: "IB Pre-DP — 개념·탐구 기반 수업, TOK(지식론)식 질문, 소논문(EE) 맛보기",
    agora: "2030 AI 아고라 — 토론·협업형 프로젝트 수업",
    fab: "미니 반도체 팹(2027 구축 예정) — 반도체 공정 실습과 시뮬레이터 탐구",
    indie: "인디게임 경연대회(추진) — 직접 만든 게임을 스토어에 올리는 프로젝트",
    hackathon: "생성형 AI 해커톤 캠프(추진) — 미션을 AI로 해결",
    vibe: "바이브코딩 앱 만들기 — 선생님처럼 필요한 앱을 AI로 직접 제작",
    yesul: "예술 감성 프로그램 · 인명축제 무대·전시",
    hwangyeong: "환경·생태 활동 — 우리 마을 생태지도, 탄소중립 캠페인",
    dokseo: "자율적 독서 활동 · 사제동행 독서토론",
    jachi: "학생자치회 — 학칙·행사 기획, 예산 심의",
    nanum: "서울대 나눔교실 — 대학생 멘토와 공부·진로 멘토링",
    donghaeng: "프로젝트 봉사 '따뜻한 동행' — 지역 돌봄·나눔"
  };

  var CONTESTS = {
    baekiljang: "문예 백일장(국어과)",
    dokhugam: "독후감 쓰기 대회(국어과)",
    jinrobalpyo: "진로 주제 발표(영어과)",
    yeongdan: "영단어 챌린지(영어과)",
    suhak: "창의융합 수학 챌린지(수학과)",
    sisatoron: "시사 토론대회(사회과)",
    gwahakgeul: "창의과학 글쓰기 대회(과학과)",
    gujomul: "창작 구조물 경연 대회(과학과)",
    sagoryeok: "창의 사고력 대회(과학과)",
    gwahaknal: "과학의 날 창의과학 경시대회(과학과)",
    misulgongmo: "미술작품 공모전(미술과)",
    league: "학교스포츠클럽 리그전(체육과)",
    cheryeok: "체력왕(체육과)"
  };

  /* 진로 분야 묶음 */
  var GROUPS = [
    { id: "med", name: "의약 · 보건", color: "#D94F6B" },
    { id: "eng", name: "공학", color: "#E07B1F" },
    { id: "sci", name: "자연 · IT", color: "#2D6FD6" },
    { id: "soc", name: "인문 · 사회", color: "#6B55D9" },
    { id: "edu", name: "교육 · 복지", color: "#1C9B6E" },
    { id: "life", name: "안전 · 서비스", color: "#0E8E9C" },
    { id: "art", name: "예술 · 체육", color: "#C9428E" }
  ];

  /* 학년별 공통 안내 */
  var GRADE_COMMON = {
    1: {
      label: "1학년", title: "탐색과 기초",
      focus: "공통과목을 탄탄히 하고 여러 활동을 두루 경험하며 진로 방향을 좁히는 시기",
      subjectNote: "1학년은 공통국어·공통수학·공통영어, 통합사회, 통합과학, 과학탐구실험, 한국사를 모두 이수합니다. 2027학년도 신입생은 IB Pre-DP 방식의 탐구 수업도 함께 경험합니다. 공통과목 안에서 진로와 이어지는 주제를 스스로 깊게 파고드세요.",
      clubHow: "관심 동아리 1~2개에 가입해 기본기를 익히고 나와 맞는지 확인하는 시기예요.",
      jayul: ["학급 임원·1인 1역할 등 학교생활에 책임감 있게 참여", "안전·응급처치·디지털 시민교육에서 배운 점을 실천으로 연결", "체육한마당·체험학습·학급 특색활동에 적극 참여"],
      jinro: ["진로심리검사 결과를 해석하고 궁금한 직업 3가지 조사", "진로특강·대학 탐방에 질문을 준비해서 참여", "고교학점제 캠프에서 3년 과목 이수 계획 초안 작성"],
      readingHow: "쉬운 교양서·에세이로 넓게 읽고, 인상 깊은 부분을 독서 기록으로 남기세요.",
      schoolHow: "체험형 프로그램에 두루 참여해 관심 분야를 좁히는 데 활용하세요.",
      record: ["진로활동: 검사·특강에서 알게 된 점과 다음 탐구 계획을 구체적으로", "자율활동: 학급·학교 활동에서 맡은 역할과 배운 점"]
    },
    2: {
      label: "2학년", title: "집중과 심화",
      focus: "진로에 맞는 선택과목을 본격적으로 듣고, 전공과 이어지는 탐구를 깊게 하는 시기",
      subjectNote: "2학년부터 일반 선택 과목을 진로에 맞게 골라 신청합니다. 1:1 과목 선택 상담과 자료집 「진로 선택 길라잡이」가 제공돼요. (IB DP 운영 시 과목 구성은 DP 과목 체계에 맞춰 안내됩니다.)",
      clubHow: "진로와 연결된 동아리에서 프로젝트를 직접 기획하고 주도하는 시기예요.",
      jayul: ["학생자치회·부서 활동에서 기획과 실행 맡아보기", "학급 스터디·멘토-멘티 활동 조직", "캠페인·프로젝트를 계획부터 정리까지 완결"],
      jinro: ["희망 학과의 교육과정과 필요한 역량을 조사해 나와 비교", "진로 주제로 발표 또는 보고서 1편 완성", "진로체험의 날·직업인 특강에서 심화 질문하기"],
      readingHow: "전공 개론서와 관련 기사를 함께 읽고, 생긴 궁금증을 탐구 주제로 연결하세요.",
      schoolHow: "R&E·1학생 1탐구·교내 대회처럼 산출물이 남는 프로그램에 도전하세요.",
      record: ["동아리·세특: 스스로 정한 질문으로 탐구하고 결과물을 남긴 과정", "진로활동: 희망 학과·직업에 필요한 역량을 조사하고 나와 비교"]
    },
    3: {
      label: "3학년", title: "완성과 진학",
      focus: "진로·융합 선택과목으로 전공 적합성을 보여주고, 3년 활동을 산출물로 정리하는 시기",
      subjectNote: "3학년은 진로·융합 선택 과목으로 전공 적합성을 보여주는 시기입니다. 2년간의 탐구를 소논문·포트폴리오로 완성하세요.",
      clubHow: "동아리 부장·팀장으로 활동을 이끌고 2년간의 활동을 결과물로 정리하는 시기예요.",
      jayul: ["후배 멘토링·동아리 리더로 나눔 실천", "학교 행사에서 기획·운영 총괄", "3년간의 자율활동을 진로와 연결해 정리"],
      jinro: ["지원 분야에 대한 이해가 3년간 어떻게 깊어졌는지 정리", "면접·자기소개에 대비해 활동-역량-진로를 하나의 이야기로 연결", "진학 후 학업·진로 계획 구체화"],
      readingHow: "심화 도서·원문·논문까지 읽고, 읽은 내용을 자신의 탐구·산출물에 인용하세요.",
      schoolHow: "그동안의 활동을 소논문·포트폴리오·전시 등 완성된 산출물로 마무리하세요.",
      record: ["진로활동: 진학하려는 분야에 대한 이해가 3년간 깊어진 과정", "세특: 배운 내용을 실제 문제에 적용한 산출물 중심"]
    }
  };

  window.YD = window.YD || {};
  window.YD.base = { PHOTO_SRC: PHOTO_SRC, FACILITIES: FACILITIES, SCHOOL: SCHOOL, S: S, CLUBS: CLUBS, PROGRAMS: PROGRAMS, CONTESTS: CONTESTS, GROUPS: GROUPS, GRADE_COMMON: GRADE_COMMON };
})();
