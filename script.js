// 이 파일은 사이트 전체에서 공통으로 쓰이는 프론트엔드 동작을 담당합니다.
// 주요 기능: 모바일 메뉴, 스크롤 효과, 메뉴 하이라이트, 로그인/회원가입, ZIP 업로드, Markdown 분석/미리보기.

// addEventListener는 특정 이벤트가 발생했을 때 실행할 함수를 등록하는 브라우저 내장 메서드입니다.
// DOMContentLoaded는 HTML 문서 구조가 모두 만들어진 직후 발생합니다.
// 이 이벤트 안에서 DOM 요소를 찾으면, 아직 요소가 생성되지 않아 null이 되는 문제를 줄일 수 있습니다.
document.addEventListener('DOMContentLoaded', () => {
  /* -----------------------------------------
       1. 모바일 메뉴 (Hamburger) 제어

       기능 요약:
       모바일 화면에서 햄버거 버튼을 누르면 사이드 메뉴를 열고,
       닫기 버튼/메뉴 바깥 영역/모바일 링크 클릭 시 메뉴를 닫습니다.
    ----------------------------------------- */

  // getElementById는 HTML에서 id가 일치하는 요소 하나를 찾아 반환합니다.
  // hamburgerBtn: 모바일 메뉴를 여는 햄버거 버튼 요소입니다.
  // 버튼 클릭 이벤트를 등록하기 위해 필요합니다.
  const hamburgerBtn = document.getElementById('hamburger-btn')

  // closeBtn: 모바일 메뉴 안쪽의 X 닫기 버튼 요소입니다.
  // 사용자가 직접 메뉴를 닫을 수 있게 하기 위해 필요합니다.
  const closeBtn = document.getElementById('close-btn')

  // mobileMenu: 실제로 화면 오른쪽에서 열리고 닫히는 사이드 메뉴 요소입니다.
  // active 클래스를 붙였다 떼면서 CSS 애니메이션을 제어합니다.
  const mobileMenu = document.getElementById('mobile-menu')

  // 일부 페이지에 해당 요소가 없을 수 있으므로, 세 요소가 모두 있을 때만 모바일 메뉴 기능을 실행합니다.
  // 이렇게 하면 다른 페이지에서 null.addEventListener 같은 오류가 발생하지 않습니다.
  if (hamburgerBtn && closeBtn && mobileMenu) {
    // 메뉴 열기:
    // click 이벤트는 사용자가 요소를 클릭했을 때 발생합니다.
    hamburgerBtn.addEventListener('click', (e) => {
      // stopPropagation은 클릭 이벤트가 부모 요소나 document까지 퍼지는 것을 막습니다.
      // 메뉴를 여는 클릭이 곧바로 "메뉴 바깥 클릭"으로 처리되어 닫히는 일을 방지합니다.
      e.stopPropagation()

      // classList.add는 요소의 class 속성에 특정 클래스명을 추가합니다.
      // CSS에서 .mobile-menu.active가 right: 0으로 설정되어 메뉴가 화면 안으로 들어옵니다.
      mobileMenu.classList.add('active')
    })

    // 메뉴 닫기:
    // classList.remove는 요소에서 특정 클래스를 제거합니다.
    // active 클래스가 사라지면 CSS에 의해 메뉴가 다시 화면 밖으로 이동합니다.
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active')
    })

    // 메뉴 외부 영역 클릭 시 닫기:
    // document 전체에 클릭 이벤트를 걸어, 사용자가 메뉴 바깥을 누르면 메뉴를 닫습니다.
    document.addEventListener('click', (e) => {
      if (
        // contains는 특정 요소가 다른 요소를 내부에 포함하는지 검사합니다.
        // 메뉴가 열려 있고, 클릭한 대상이 메뉴 내부도 아니며 햄버거 버튼도 아닐 때만 닫습니다.
        mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        mobileMenu.classList.remove('active')
      }
    })

    // 모바일 링크 클릭 시 닫기:
    // querySelectorAll은 CSS 선택자에 맞는 모든 요소를 NodeList 형태로 반환합니다.
    // forEach로 각 링크마다 클릭 이벤트를 붙입니다.
    document.querySelectorAll('.mobile-nav-links a').forEach((link) => {
      link.addEventListener('click', () =>
        mobileMenu.classList.remove('active'),
      )
    })
  }

  /* -----------------------------------------
       2. 스크롤 시 상단 헤더 동적 스타일링

       기능 요약:
       사용자가 페이지를 아래로 스크롤하면 헤더 배경과 그림자를 더 진하게 바꿔
       현재 헤더가 콘텐츠 위에 떠 있다는 느낌을 줍니다.
    ----------------------------------------- */

  // querySelector는 CSS 선택자에 맞는 첫 번째 요소 하나를 반환합니다.
  // header: 사이트 상단 고정 헤더입니다. 스크롤 위치에 따라 inline style을 바꾸기 위해 필요합니다.
  const header = document.querySelector('.main-header')

  // window는 브라우저 창 전체를 의미하는 전역 객체입니다.
  // scroll 이벤트는 사용자가 페이지를 스크롤할 때마다 발생합니다.
  window.addEventListener('scroll', () => {
    // window.scrollY는 현재 문서가 세로 방향으로 얼마나 스크롤되었는지 px 단위로 알려줍니다.
    // 50px보다 많이 내려오면 헤더를 더 진하게 처리합니다.
    if (window.scrollY > 50) {
      // element.style은 해당 요소의 인라인 CSS를 직접 변경합니다.
      header.style.background = 'rgba(11, 13, 20, 0.95)'
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)'
      header.style.borderBottom = '1px solid rgba(0, 212, 255, 0.2)' // 스크롤 시 하단 선 색상 변경
    } else {
      header.style.background = 'rgba(11, 13, 20, 0.85)'
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)'
      header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)'
    }
  })

  /* -----------------------------------------
       3. Intersection Observer (스크롤 등장 애니메이션)

       기능 요약:
       카드나 콘텐츠 블록이 화면에 들어올 때 아래에서 부드럽게 나타나는 애니메이션을 적용합니다.
       IntersectionObserver를 사용하면 스크롤 이벤트를 직접 계속 계산하는 것보다 효율적입니다.
    ----------------------------------------- */

  // animatedElements: 등장 애니메이션을 적용할 여러 요소 목록입니다.
  // querySelectorAll은 여러 개의 DOM 요소를 한 번에 찾아 NodeList로 반환합니다.
  const animatedElements = document.querySelectorAll(
    '.content-block, .grid-card, .profile-card, .tool-item, .memory-segment',
  )

  // 초기 상태 설정:
  // 각 요소를 처음에는 투명하게 만들고 아래로 40px 내려놓습니다.
  // 이후 화면에 들어올 때 원래 위치와 투명도로 되돌려 애니메이션처럼 보이게 합니다.
  animatedElements.forEach((el) => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(40px)'
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  })

  // observerOptions: IntersectionObserver가 요소를 "보인다"고 판단하는 기준입니다.
  // threshold 0.15는 요소의 15% 이상이 화면에 들어왔을 때 콜백을 실행하겠다는 뜻입니다.
  // rootMargin은 감지 영역을 조정하며, 아래쪽을 -50px 줄여 조금 더 들어온 뒤 실행되게 합니다.
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  }

  // IntersectionObserver는 관찰 대상 요소가 화면(viewport)에 들어오거나 나갈 때 콜백을 실행합니다.
  // entries는 관찰 중인 요소들의 교차 상태 정보 배열입니다.
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // entry.isIntersecting은 해당 요소가 현재 화면과 겹쳐 보이는지 여부입니다.
      if (entry.isIntersecting) {
        // 화면에 나타나면 원래 위치와 투명도로 복구
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
        // 한 번 애니메이션이 실행되면 더 이상 감시하지 않음
        scrollObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // observe는 특정 요소를 IntersectionObserver의 관찰 대상으로 등록합니다.
  animatedElements.forEach((el) => scrollObserver.observe(el))

  /* -----------------------------------------
       4. 숫자 카운트업 애니메이션 (About 섹션 통계)

       기능 요약:
       About 통계 영역이 화면에 보이면 숫자가 0부터 목표 숫자까지 올라가는 효과를 실행합니다.
       한 번 실행된 뒤에는 hasCounted 플래그로 중복 실행을 막습니다.
    ----------------------------------------- */

  // stats: .stat-num 클래스를 가진 숫자 표시 요소 목록입니다.
  // 예: 5, 3, 100% 같은 통계 값을 애니메이션으로 변경합니다.
  const stats = document.querySelectorAll('.stat-num')

  // statsContainer: 통계 박스들을 감싸는 부모 영역입니다.
  // 이 영역이 화면에 들어왔을 때 카운트업을 시작하기 위해 필요합니다.
  const statsContainer = document.querySelector('.about-stats')

  // hasCounted: 카운트업 애니메이션이 이미 실행되었는지 저장하는 boolean 변수입니다.
  // 스크롤을 올렸다 내릴 때 숫자가 계속 다시 올라가는 것을 방지합니다.
  let hasCounted = false // 중복 실행 방지용 플래그

  // 통계 영역이 존재하고 숫자 요소가 하나 이상 있을 때만 카운트업 기능을 활성화합니다.
  if (statsContainer && stats.length > 0) {
    // statObserver: 통계 영역이 화면에 50% 이상 보이는지 감시하는 IntersectionObserver입니다.
    const statObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
          stats.forEach((stat) => {
            // targetText: 화면에 원래 적혀 있던 목표 값입니다. 예: "100%"
            const targetText = stat.innerText
            // % 문자가 있는지 확인
            const isPercentage = targetText.includes('%')
            // 숫자만 추출
            const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''))

            // currentCount: 애니메이션 중 현재 표시할 숫자입니다. 0부터 시작합니다.
            let currentCount = 0

            // 카운트 속도 및 프레임 설정
            const duration = 2000 // 2초 동안 진행

            // increment: requestAnimationFrame이 약 16ms마다 실행된다고 보고 한 프레임에 올릴 숫자 크기입니다.
            const increment = targetNumber / (duration / 16)

            // updateCount:
            // 현재 숫자를 increment만큼 증가시키고, 목표 숫자에 도달할 때까지 자기 자신을 다시 호출합니다.
            // requestAnimationFrame은 브라우저의 다음 화면 갱신 타이밍에 함수를 실행해 애니메이션을 부드럽게 만듭니다.
            const updateCount = () => {
              currentCount += increment
              if (currentCount < targetNumber) {
                stat.innerText =
                  Math.ceil(currentCount) + (isPercentage ? '%' : '')
                requestAnimationFrame(updateCount)
              } else {
                stat.innerText = targetNumber + (isPercentage ? '%' : '')
              }
            }
            updateCount()
          })
          hasCounted = true
        }
      },
      { threshold: 0.5 },
    ) // 화면에 50% 이상 보일 때 실행

    statObserver.observe(statsContainer)
  }

  /* -----------------------------------------
       5. 현재 페이지 메뉴 자동 하이라이트

       기능 요약:
       현재 열려 있는 HTML 파일명과 메뉴 링크의 href를 비교해서
       현재 페이지에 해당하는 메뉴에 active 클래스를 자동으로 붙입니다.
    ----------------------------------------- */

  // currentPath: 현재 브라우저 주소의 마지막 파일명입니다.
  // window.location.pathname은 URL의 경로 부분을 나타냅니다.
  // split('/').pop()은 경로를 / 기준으로 나눈 뒤 마지막 조각만 가져옵니다.
  // 예: /forensics.html -> forensics.html
  const currentPath = window.location.pathname.split('/').pop()

  // navLinks: PC 메뉴와 모바일 메뉴의 모든 a 태그 목록입니다.
  // 현재 페이지와 일치하는 링크를 찾아 active 클래스를 붙이기 위해 필요합니다.
  const navLinks = document.querySelectorAll(
    '.desktop-nav a, .mobile-nav-links a',
  )

  // 각 메뉴 링크를 하나씩 검사합니다.
  navLinks.forEach((link) => {
    // getAttribute는 HTML 속성값을 문자열로 읽어오는 메서드입니다.
    // linkPath에는 a 태그의 href 값이 들어갑니다.
    const linkPath = link.getAttribute('href')

    // 드롭다운 작동용 임시 링크(#none)와 앵커(#)는 건너뜀
    if (linkPath.startsWith('#')) return

    // 모든 링크에서 active 클래스 제거
    link.classList.remove('active')

    // 현재 경로와 링크 경로가 일치하거나, 루트 경로(/)일 때 index.html 하이라이트
    if (
      currentPath === linkPath ||
      (currentPath === '' && linkPath === 'index.html')
    ) {
      link.classList.add('active')

      // 서브 메뉴(Study 하위)인 경우 부모인 'Study' 메뉴에도 불을 밝힘
      // closest는 현재 요소에서 시작해 부모 방향으로 올라가며 선택자와 일치하는 가장 가까운 요소를 찾습니다.
      const parentDropdown = link.closest('.dropdown')
      if (parentDropdown) {
        // 드롭다운 내부 페이지가 활성화되면, 드롭다운의 상위 Study 메뉴도 함께 active 처리합니다.
        const parentLink = parentDropdown.querySelector('a')
        if (parentLink) parentLink.classList.add('active')
      }
    }
  })

  /* -----------------------------------------
       6. 부드러운 앵커 스크롤 (Smooth Scroll)

       기능 요약:
       href="#about"처럼 페이지 내부 섹션으로 이동하는 링크를 클릭했을 때,
       기본 순간 이동 대신 부드러운 스크롤로 이동하게 만듭니다.
    ----------------------------------------- */

  // a[href^="#"]는 href 속성이 #으로 시작하는 모든 앵커 링크를 의미합니다.
  // ^는 CSS 속성 선택자에서 "해당 문자열로 시작한다"는 뜻입니다.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    // function 키워드를 사용하면 내부의 this가 클릭된 a 요소를 가리킵니다.
    anchor.addEventListener('click', function (e) {
      // targetId: 클릭된 링크의 href 값입니다. 예: "#domains"
      const targetId = this.getAttribute('href')
      if (targetId === '#none' || targetId === '#') return

      // targetElement: targetId와 같은 id를 가진 실제 섹션 요소입니다.
      // 예: "#domains"라면 id="domains"인 요소를 찾습니다.
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        // preventDefault는 a 태그의 기본 이동 동작을 막습니다.
        // 기본 동작을 막아야 window.scrollTo로 우리가 원하는 위치에 부드럽게 이동시킬 수 있습니다.
        e.preventDefault()
        // 헤더 높이를 제외한 정확한 위치로 부드럽게 스크롤
        window.scrollTo({
          // offsetTop은 문서 맨 위부터 해당 요소까지의 세로 거리입니다.
          // 고정 헤더가 섹션 제목을 가리지 않도록 85px을 빼 줍니다.
          top: targetElement.offsetTop - 85,
          behavior: 'smooth',
        })
      }
    })
  })

  /* -----------------------------------------
       7. 하단으로 한 번에 이동하는 플로팅 버튼

       기능 요약:
       모든 페이지 왼쪽 아래에 동그란 아래 화살표 버튼을 자동으로 만들고,
       클릭하면 페이지 맨 아래로 부드럽게 스크롤합니다.
    ----------------------------------------- */

  // createElement는 JS로 새로운 HTML 요소를 만드는 메서드입니다.
  // HTML 파일마다 버튼 코드를 직접 넣지 않고, 공통 script.js에서 자동으로 생성합니다.
  const scrollDownBtn = document.createElement('button')

  // className은 요소의 class 속성을 설정합니다.
  // CSS의 .scroll-down-btn 스타일을 적용하기 위해 필요합니다.
  scrollDownBtn.className = 'scroll-down-btn'

  // type="button"은 폼 안에 버튼이 들어가더라도 submit 버튼처럼 동작하지 않게 합니다.
  scrollDownBtn.type = 'button'

  // setAttribute는 HTML 속성을 추가하거나 변경합니다.
  // aria-label은 스크린 리더 사용자에게 버튼의 의미를 알려주는 접근성 속성입니다.
  scrollDownBtn.setAttribute('aria-label', '페이지 하단으로 이동')

  // innerHTML은 요소 안쪽 HTML을 문자열로 넣습니다.
  // Font Awesome 아이콘 클래스를 사용해 아래 화살표 아이콘을 표시합니다.
  scrollDownBtn.innerHTML = '<i class="fas fa-arrow-down"></i>'

  // appendChild는 특정 요소를 다른 요소의 마지막 자식으로 추가합니다.
  // body에 추가하기 때문에 모든 페이지에서 화면에 나타납니다.
  document.body.appendChild(scrollDownBtn)

  // updateScrollDownBtn:
  // 현재 스크롤 위치가 페이지 하단에 가까운지 계산하고,
  // 하단이면 버튼을 숨기고, 아니면 보여줍니다.
  const updateScrollDownBtn = () => {
    // scrollBottom: 현재 화면의 아래쪽 위치입니다.
    // 현재 스크롤 위치(window.scrollY)에 브라우저 화면 높이(window.innerHeight)를 더해 계산합니다.
    const scrollBottom = window.scrollY + window.innerHeight

    // pageHeight: 문서 전체의 세로 높이입니다.
    // documentElement는 html 요소를 의미하고, scrollHeight는 콘텐츠 전체 높이를 나타냅니다.
    const pageHeight = document.documentElement.scrollHeight

    // classList.toggle(클래스명, 조건)은 조건이 true면 클래스를 붙이고 false면 제거합니다.
    // 하단 120px 이내에 도착하면 is-hidden 클래스를 붙여 버튼을 숨깁니다.
    scrollDownBtn.classList.toggle('is-hidden', scrollBottom >= pageHeight - 120)
  }

  // 버튼 클릭 시 문서 전체 높이만큼 이동해 페이지 하단으로 스크롤합니다.
  scrollDownBtn.addEventListener('click', () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  })

  // 스크롤하거나 창 크기가 바뀌면 버튼을 숨길지 다시 판단합니다.
  window.addEventListener('scroll', updateScrollDownBtn)
  window.addEventListener('resize', updateScrollDownBtn)

  // 페이지가 처음 로드되었을 때도 버튼 표시 상태를 한 번 계산합니다.
  updateScrollDownBtn()

  /* -----------------------------------------
       8. 최상단으로 한 번에 이동하는 Top 버튼

       기능 요약:
       참조 script.js에 있던 "최상단 이동 Top 버튼" 기능을 현재 프로젝트에서도 동작하게 구현합니다.
       HTML에 #scroll-top-btn 버튼이 이미 있으면 그 버튼을 사용하고,
       없으면 JavaScript로 버튼을 자동 생성해 모든 페이지에서 사용할 수 있게 합니다.
    ----------------------------------------- */

  // scrollTopBtn:
  // 페이지 맨 위로 이동시키는 버튼 요소입니다.
  // document.getElementById('scroll-top-btn')로 기존 HTML 버튼을 먼저 찾고,
  // 없으면 createElement로 새 버튼을 만들어 사용합니다.
  let scrollTopBtn = document.getElementById('scroll-top-btn')

  // 기존 HTML에 버튼이 없는 페이지에서도 기능이 작동하도록 버튼을 자동 생성합니다.
  // 이렇게 하면 모든 HTML 파일을 하나씩 수정하지 않아도 공통 script.js만으로 기능을 배포할 수 있습니다.
  if (!scrollTopBtn) {
    // createElement('button')은 새 button 태그를 메모리상에 만듭니다.
    scrollTopBtn = document.createElement('button')

    // id는 getElementById로 다시 찾을 수 있는 고유 식별자입니다.
    // 참조 파일의 #scroll-top-btn 이름과 맞춰 기존 코드/스타일과도 연결될 수 있게 합니다.
    scrollTopBtn.id = 'scroll-top-btn'

    // className에는 스타일 적용용 클래스명을 넣습니다.
    // CSS에서 .scroll-top-btn과 .scroll-top-btn.active를 정의해 표시/숨김을 제어합니다.
    scrollTopBtn.className = 'scroll-top-btn'

    // type="button"은 이 버튼이 form 안에 들어가더라도 form submit을 발생시키지 않게 합니다.
    scrollTopBtn.type = 'button'

    // aria-label은 화면에는 보이지 않지만 스크린 리더가 읽는 설명입니다.
    // 아이콘만 있는 버튼도 접근성 도구에서 의미를 알 수 있게 합니다.
    scrollTopBtn.setAttribute('aria-label', '페이지 최상단으로 이동')

    // innerHTML로 Font Awesome 위쪽 화살표 아이콘을 버튼 안에 넣습니다.
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'

    // appendChild는 만든 버튼을 실제 body에 붙여 화면에 나타나게 합니다.
    document.body.appendChild(scrollTopBtn)
  }

  // updateScrollTopBtn:
  // 입력값: 없음
  // 반환값: 없음
  // 동작:
  // 사용자의 현재 스크롤 위치(window.scrollY)를 확인해,
  // 300px 이상 내려왔으면 active 클래스를 붙여 버튼을 보여주고,
  // 그보다 위에 있으면 active 클래스를 제거해 버튼을 숨깁니다.
  const updateScrollTopBtn = () => {
    // classList.toggle(클래스명, 조건)은 조건이 true면 클래스를 추가하고 false면 제거합니다.
    scrollTopBtn.classList.toggle('active', window.scrollY > 300)
  }

  // scroll 이벤트는 사용자가 페이지를 위아래로 움직일 때마다 발생합니다.
  // 스크롤 위치가 바뀔 때마다 Top 버튼 표시 여부를 다시 계산합니다.
  window.addEventListener('scroll', updateScrollTopBtn)

  // 버튼을 클릭하면 window.scrollTo로 문서 맨 위(top: 0)까지 부드럽게 이동합니다.
  // behavior: 'smooth'는 순간 이동이 아니라 애니메이션처럼 천천히 이동하게 만드는 옵션입니다.
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })

  // 페이지가 처음 로드되었을 때도 현재 스크롤 위치에 맞춰 버튼 상태를 초기화합니다.
  updateScrollTopBtn()

  /* -----------------------------------------
       9. 프론트엔드 로그인 및 Obsidian ZIP 분석

       기능 요약:
       서버 없이 브라우저 localStorage만 사용해 회원가입/로그인을 구현하고,
       로그인한 사용자만 Obsidian Vault ZIP 파일을 업로드할 수 있게 합니다.
       업로드된 ZIP 안의 Markdown 파일을 읽어 학습 분야 분류, 키워드 추출, 미리보기를 렌더링합니다.
    ----------------------------------------- */

  // authKey: 현재 로그인한 사용자 정보를 localStorage에 저장할 때 사용하는 키 이름입니다.
  // localStorage는 브라우저에 문자열 데이터를 영구 저장하는 내장 저장소입니다.
  // 새로고침 후에도 로그인 상태를 유지하기 위해 필요합니다.
  const authKey = 'infosecHubUser'

  // usersKey: 회원가입한 전체 사용자 목록을 localStorage에 저장할 때 사용하는 키 이름입니다.
  // 백엔드/DB가 없으므로 브라우저 저장소를 간단한 계정 DB처럼 사용합니다.
  const usersKey = 'infosecHubUsers'

  // loginOpenBtn: 데스크톱 내비게이션의 Login/Logout 버튼입니다.
  // 클릭하면 로그인 모달을 열거나 로그아웃을 실행합니다.
  const loginOpenBtn = document.getElementById('login-open-btn')

  // mobileLoginOpenBtn: 모바일 메뉴 안의 Login/Logout 버튼입니다.
  // 모바일 화면에서도 같은 인증 기능을 사용할 수 있게 필요합니다.
  const mobileLoginOpenBtn = document.getElementById('mobile-login-open-btn')

  // loginModal: 로그인/회원가입 폼을 담고 있는 모달 전체 영역입니다.
  // active 클래스로 열림/닫힘 상태를 제어합니다.
  const loginModal = document.getElementById('login-modal')

  // loginCloseBtn: 모달 오른쪽 위 닫기 버튼입니다.
  const loginCloseBtn = document.getElementById('login-close-btn')

  // loginForm: 아이디/비밀번호 입력과 제출을 담당하는 form 요소입니다.
  // submit 이벤트를 감지해 로그인 또는 회원가입 로직을 실행합니다.
  const loginForm = document.getElementById('login-form')

  // loginName: 사용자가 입력한 아이디 값을 읽는 input 요소입니다.
  const loginName = document.getElementById('login-name')

  // loginPassword: 사용자가 입력한 비밀번호 값을 읽는 input 요소입니다.
  const loginPassword = document.getElementById('login-password')

  // signupPasswordConfirm: 회원가입 모드에서 비밀번호 확인 값을 읽는 input 요소입니다.
  // 사용자가 비밀번호를 잘못 입력하는 것을 줄이기 위해 필요합니다.
  const signupPasswordConfirm = document.getElementById('signup-password-confirm')

  // signinTab / signupTab: 모달 안에서 로그인 모드와 회원가입 모드를 전환하는 탭 버튼입니다.
  const signinTab = document.getElementById('signin-tab')
  const signupTab = document.getElementById('signup-tab')

  // authSubmitBtn: form 제출 버튼입니다.
  // 현재 모드에 따라 "로그인" 또는 "회원가입" 텍스트로 바뀝니다.
  const authSubmitBtn = document.getElementById('auth-submit-btn')

  // authModeBadge: 모달 상단의 SIGN IN / SIGN UP 배지 요소입니다.
  const authModeBadge = document.getElementById('auth-mode-badge')

  // loginTitle: 모달 제목입니다. 모드에 따라 로그인/회원가입 제목으로 변경됩니다.
  const loginTitle = document.getElementById('login-title')

  // loginCopy: 모달 설명 문구입니다. 현재 인증 모드에 맞춰 안내 문구를 바꿉니다.
  const loginCopy = document.getElementById('login-copy')

  // loginError: 로그인 실패, 중복 아이디, 비밀번호 불일치 같은 오류 메시지를 표시하는 요소입니다.
  const loginError = document.getElementById('login-error')

  // authStatus: 볼트 분석 영역에 현재 로그인 상태를 보여주는 요소입니다.
  const authStatus = document.getElementById('auth-status')

  // authTitle / authDescription: 로그인 상태에 따라 안내 문구를 바꾸는 텍스트 요소입니다.
  const authTitle = document.getElementById('auth-title')
  const authDescription = document.getElementById('auth-description')

  // uploadPanel: ZIP 업로드 영역 전체입니다.
  // 로그인 전에는 locked 클래스를 붙여 비활성화된 느낌을 줍니다.
  const uploadPanel = document.getElementById('upload-panel')

  // vaultUpload: 실제 파일 선택 input입니다.
  // 사용자가 선택한 ZIP 파일은 change 이벤트의 event.target.files에서 읽습니다.
  const vaultUpload = document.getElementById('vault-upload')

  // uploadMessage: 업로드 가능 여부, 분석 중 상태, 오류 메시지를 표시하는 안내 문구입니다.
  const uploadMessage = document.getElementById('upload-message')

  // vaultResults: ZIP 분석 결과 전체 영역입니다.
  // 분석 전에는 hidden 속성으로 숨기고, 분석 후 표시합니다.
  const vaultResults = document.getElementById('vault-results')

  // noteCount: ZIP 안에서 발견한 Markdown 파일 개수를 표시하는 요소입니다.
  const noteCount = document.getElementById('note-count')

  // topCategory: 키워드 점수가 가장 높은 학습 분야를 표시하는 요소입니다.
  const topCategory = document.getElementById('top-category')

  // keywordCount: 추출된 주요 키워드 개수를 표시하는 요소입니다.
  const keywordCount = document.getElementById('keyword-count')

  // categoryList: 분야별 점수 막대를 렌더링할 컨테이너입니다.
  const categoryList = document.getElementById('category-list')

  // keywordCloud: 추출한 키워드 칩들을 렌더링할 컨테이너입니다.
  const keywordCloud = document.getElementById('keyword-cloud')

  // noteList: Markdown 파일 목록 버튼들을 렌더링할 컨테이너입니다.
  const noteList = document.getElementById('note-list')

  // markdownPreview: 선택된 Markdown 파일의 HTML 미리보기를 보여주는 영역입니다.
  const markdownPreview = document.getElementById('markdown-preview')

  // categoryKeywords:
  // 학습 분야별로 대표 키워드를 모아 둔 객체입니다.
  // ZIP 안의 Markdown 내용에서 이 단어들이 얼마나 자주 등장하는지 세어 분야 점수를 계산합니다.
  // 객체의 key는 화면에 표시할 분야명이고, value는 해당 분야를 대표하는 키워드 배열입니다.
  const categoryKeywords = {
    'Digital Forensics': [
      'forensic',
      'forensics',
      'artifact',
      'timeline',
      'memory',
      'volatility',
      'autopsy',
      'registry',
      'log',
      'disk',
      'image',
      'evidence',
      'malware',
      'incident',
      '포렌식',
      '아티팩트',
      '증거',
      '메모리',
      '타임라인',
      '침해사고',
    ],
    Pwnable: [
      'pwn',
      'pwnable',
      'exploit',
      'overflow',
      'buffer',
      'rop',
      'heap',
      'stack',
      'shellcode',
      'gdb',
      'pwndbg',
      'canary',
      'libc',
      '취약점',
      '익스플로잇',
      '버퍼',
      '오버플로우',
      '힙',
      '스택',
    ],
    Reversing: [
      'reverse',
      'reversing',
      'ida',
      'ghidra',
      'binary',
      'assembly',
      'disassemble',
      'debug',
      'x86',
      'arm',
      'opcode',
      'packing',
      '역공학',
      '리버싱',
      '바이너리',
      '어셈블리',
      '디버깅',
      '디스어셈블',
    ],
    'System Hardening': [
      'hardening',
      'linux',
      'windows',
      'permission',
      'policy',
      'firewall',
      'patch',
      'cis',
      'audit',
      'ssh',
      'sudo',
      'selinux',
      '하드닝',
      '권한',
      '정책',
      '패치',
      '감사',
      '보안설정',
    ],
    'Network Security': [
      'network',
      'packet',
      'wireshark',
      'tcp',
      'udp',
      'dns',
      'http',
      'tls',
      'firewall',
      'ids',
      'ips',
      'nmap',
      'snort',
      '네트워크',
      '패킷',
      '방화벽',
      '트래픽',
      '포트',
      '프로토콜',
    ],
    Web: [
      'web',
      'xss',
      'sql',
      'sqli',
      'csrf',
      'cookie',
      'session',
      'jwt',
      'api',
      'burp',
      '웹',
      '쿠키',
      '세션',
      '인증',
      '인가',
    ],
  }

  // stopWords:
  // 키워드 추출 결과에서 제외할 일반적인 단어 목록입니다.
  // "내용", "파일", "the" 같은 단어는 자주 나오지만 학습 분야를 설명하는 데 도움이 적기 때문에 제거합니다.
  // Set은 값 존재 여부를 빠르게 검사할 수 있는 자료구조입니다.
  const stopWords = new Set([
    'the',
    'and',
    'for',
    'with',
    'from',
    'this',
    'that',
    'http',
    'https',
    'com',
    'www',
    '으로',
    '에서',
    '그리고',
    '또는',
    '대한',
    '관련',
    '정리',
    '사용',
    '설명',
    '내용',
    '파일',
    '학습',
  ])

  // parsedNotes:
  // 현재 업로드한 ZIP에서 추출한 Markdown 노트 배열입니다.
  // 각 항목은 { path, name, text } 형태이며, 노트 목록 클릭 시 미리보기에 다시 사용됩니다.
  let parsedNotes = []

  // authMode:
  // 현재 모달이 로그인 모드인지 회원가입 모드인지 저장합니다.
  // 'signin'이면 로그인 로직, 'signup'이면 회원가입 로직을 실행합니다.
  let authMode = 'signin'

  // document.documentElement는 HTML 문서의 <html> 요소입니다.
  // dataset은 data-* 속성을 JS에서 읽고 쓰는 객체입니다.
  // data-zip-parser 값을 남겨 현재 어떤 ZIP 파서를 사용할 수 있는지 디버깅하기 쉽게 합니다.
  document.documentElement.dataset.zipParser = window.fflate?.unzipSync
    ? 'fflate'
    : window.DecompressionStream
      ? 'native'
      : 'limited'

  // getUser:
  // 입력값: 없음
  // 반환값: localStorage에 저장된 현재 로그인 사용자 객체 또는 null
  // 동작: authKey로 저장된 JSON 문자열을 읽어 객체로 변환합니다.
  // JSON.parse는 문자열 형태의 JSON을 JS 객체로 바꾸는 내장 메서드입니다.
  // 저장값이 깨져 있으면 catch에서 null을 반환해 앱이 멈추지 않게 합니다.
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem(authKey))
    } catch {
      return null
    }
  }

  // getStoredUsers:
  // 입력값: 없음
  // 반환값: 회원가입된 사용자 배열
  // 동작: usersKey로 저장된 JSON 문자열을 읽어 배열인지 확인한 뒤 반환합니다.
  // Array.isArray는 값이 배열인지 확인하는 내장 메서드입니다.
  // 값이 없거나 잘못된 데이터면 빈 배열을 반환해 이후 로직을 단순하게 만듭니다.
  const getStoredUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem(usersKey))
      return Array.isArray(users) ? users : []
    } catch {
      return []
    }
  }

  // saveStoredUsers:
  // 입력값: users - 저장할 사용자 배열
  // 반환값: 없음
  // 동작: 사용자 배열을 JSON.stringify로 문자열화한 뒤 localStorage에 저장합니다.
  // localStorage는 문자열만 저장할 수 있으므로 객체/배열은 JSON 문자열로 바꿔야 합니다.
  const saveStoredUsers = (users) => {
    localStorage.setItem(usersKey, JSON.stringify(users))
  }

  // setModal:
  // 입력값: isOpen - true면 모달 열기, false면 모달 닫기
  // 반환값: 없음
  // 동작: loginModal에 active 클래스를 토글하고 aria-hidden 값을 갱신합니다.
  // 모달을 열 때는 항상 로그인 모드로 초기화하고 아이디 입력 칸에 포커스를 줍니다.
  const setModal = (isOpen) => {
    if (!loginModal) return
    loginModal.classList.toggle('active', isOpen)
    loginModal.setAttribute('aria-hidden', String(!isOpen))
    if (isOpen) {
      setAuthMode('signin')
      loginName?.focus()
    }
  }

  // setAuthMode:
  // 입력값: mode - 'signin' 또는 'signup'
  // 반환값: 없음
  // 동작: 현재 모드(authMode)를 바꾸고 탭, 제목, 설명, 버튼 텍스트, 비밀번호 확인 입력칸 표시 상태를 갱신합니다.
  // hidden 속성은 요소를 화면과 접근성 트리에서 숨깁니다.
  // required 속성은 form 제출 시 브라우저가 입력 여부를 검사하게 만듭니다.
  const setAuthMode = (mode) => {
    authMode = mode
    const isSignup = authMode === 'signup'

    signinTab?.classList.toggle('active', !isSignup)
    signupTab?.classList.toggle('active', isSignup)
    document.querySelectorAll('.signup-only').forEach((element) => {
      element.hidden = !isSignup
      if ('required' in element) element.required = isSignup
    })

    if (authModeBadge) authModeBadge.textContent = isSignup ? 'SIGN UP' : 'SIGN IN'
    if (loginTitle) loginTitle.textContent = isSignup ? 'InfoSec Hub 회원가입' : 'InfoSec Hub 로그인'
    if (loginCopy) {
      loginCopy.textContent = isSignup
        ? '새 계정을 만들면 이 브라우저에 저장되고 바로 로그인됩니다.'
        : '가입한 계정으로 로그인하면 볼트 업로드 기능을 사용할 수 있습니다.'
    }
    if (authSubmitBtn) authSubmitBtn.textContent = isSignup ? '회원가입' : '로그인'
    if (loginError) loginError.textContent = ''
    loginForm?.reset()
  }

  // updateAuthUi:
  // 입력값: 없음
  // 반환값: 없음
  // 동작: 현재 로그인 상태를 읽어 화면 전체 UI를 동기화합니다.
  // 로그인 상태이면 버튼 텍스트를 Logout으로 바꾸고 업로드 input을 활성화합니다.
  // 비로그인 상태이면 업로드를 막고 "로그인이 필요합니다" 안내를 보여줍니다.
  const updateAuthUi = () => {
    const user = getUser()

    // Boolean은 값을 true/false로 변환합니다.
    // user?.name은 user가 null이어도 오류 없이 name을 읽는 optional chaining 문법입니다.
    const isLoggedIn = Boolean(user?.name)
    const label = isLoggedIn ? 'Logout' : 'Login'

    if (loginOpenBtn) loginOpenBtn.textContent = label
    if (mobileLoginOpenBtn) mobileLoginOpenBtn.textContent = label
    if (authStatus) {
      authStatus.classList.toggle('logged-in', isLoggedIn)
      authStatus.innerHTML = isLoggedIn
        ? `<i class="fas fa-user-check"></i><span>${escapeHtml(user.name)}님 로그인됨</span>`
        : '<i class="fas fa-user-lock"></i><span>로그인이 필요합니다</span>'
    }
    if (authTitle) {
      authTitle.textContent = isLoggedIn
        ? `${user.name}님의 볼트를 분석할 수 있습니다`
        : '학습 기록 분석을 시작하세요'
    }
    if (authDescription) {
      authDescription.textContent = isLoggedIn
        ? 'ZIP 파일을 선택하면 브라우저에서만 압축을 풀고 Markdown 노트를 분석합니다.'
        : '브라우저에만 저장되는 간단 로그인입니다. 서버 없이 현재 기기에서만 상태가 유지됩니다.'
    }
    if (uploadPanel && vaultUpload && uploadMessage) {
      uploadPanel.classList.toggle('locked', !isLoggedIn)
      vaultUpload.disabled = !isLoggedIn
      uploadMessage.textContent = isLoggedIn
        ? 'ZIP 파일을 선택하거나 드롭존을 눌러 업로드하세요.'
        : '로그인하면 업로드가 활성화됩니다.'
    }
  }

  // handleAuthButton:
  // 입력값: 없음
  // 반환값: 없음
  // 동작: Login/Logout 버튼을 눌렀을 때 실행됩니다.
  // 이미 로그인 상태면 localStorage의 현재 사용자 정보를 지워 로그아웃하고,
  // 로그인 상태가 아니면 로그인 모달을 엽니다.
  const handleAuthButton = () => {
    if (getUser()) {
      localStorage.removeItem(authKey)
      parsedNotes = []
      if (vaultResults) vaultResults.hidden = true
      if (vaultUpload) vaultUpload.value = ''
      updateAuthUi()
      return
    }
    setModal(true)
  }

  // 아래 addEventListener들은 실제 사용자의 행동과 함수를 연결합니다.
  // ?. 는 optional chaining으로, 요소가 없는 페이지에서는 이벤트 등록을 건너뛰어 오류를 막습니다.
  loginOpenBtn?.addEventListener('click', handleAuthButton)
  mobileLoginOpenBtn?.addEventListener('click', handleAuthButton)
  signinTab?.addEventListener('click', () => setAuthMode('signin'))
  signupTab?.addEventListener('click', () => setAuthMode('signup'))
  loginCloseBtn?.addEventListener('click', () => setModal(false))

  // 모달의 어두운 배경(loginModal)을 직접 클릭하면 닫습니다.
  // event.target은 실제 클릭된 요소입니다.
  // target이 loginModal과 같다는 것은 모달 내부 박스가 아니라 바깥 배경을 클릭했다는 뜻입니다.
  loginModal?.addEventListener('click', (event) => {
    if (event.target === loginModal) setModal(false)
  })

  // 로그인/회원가입 form 제출 처리:
  // submit 이벤트는 form 안의 버튼을 누르거나 Enter를 눌렀을 때 발생합니다.
  loginForm?.addEventListener('submit', (event) => {
    // preventDefault는 form의 기본 동작인 페이지 새로고침/전송을 막습니다.
    // 서버 없이 JS만으로 처리하므로 기본 제출 동작은 필요 없습니다.
    event.preventDefault()

    // trim은 문자열 앞뒤 공백을 제거합니다.
    // 실수로 공백을 넣어도 같은 아이디/비밀번호로 처리하기 위해 사용합니다.
    const name = loginName.value.trim()
    const password = loginPassword.value.trim()
    const passwordConfirm = signupPasswordConfirm?.value.trim() || ''

    if (name.length < 2 || password.length < 4) {
      loginError.textContent = '아이디는 2자 이상, 비밀번호는 4자 이상 입력하세요.'
      return
    }

    // users: localStorage에서 읽어 온 가입 사용자 목록입니다.
    // matchedUser: 입력한 아이디와 같은 사용자를 find로 찾은 결과입니다.
    // find는 조건을 만족하는 첫 번째 배열 요소를 반환하고, 없으면 undefined를 반환합니다.
    const users = getStoredUsers()
    const matchedUser = users.find((user) => user.name === name)

    // 회원가입 모드 처리:
    // 중복 아이디와 비밀번호 확인을 검사한 뒤 사용자 목록에 새 계정을 추가합니다.
    if (authMode === 'signup') {
      if (matchedUser) {
        loginError.textContent = '이미 가입된 아이디입니다. 다른 아이디를 입력하세요.'
        return
      }
      if (password !== passwordConfirm) {
        loginError.textContent = '비밀번호 확인이 일치하지 않습니다.'
        return
      }

      // newUser: 새로 가입할 사용자 정보입니다.
      // 실제 서비스라면 비밀번호를 절대 평문 저장하면 안 되지만,
      // 이 프로젝트는 HTML/CSS/JS만 사용하는 학습용 로컬 데모라 localStorage에 저장합니다.
      const newUser = {
        name,
        password,
        createdAt: new Date().toISOString(),
      }
      saveStoredUsers([...users, newUser])
      localStorage.setItem(
        authKey,
        JSON.stringify({ name, loggedInAt: new Date().toISOString() }),
      )
      loginForm.reset()
      loginError.textContent = ''
      setModal(false)
      updateAuthUi()
      return
    }

    // 로그인 모드 처리:
    // 가입된 사용자가 없거나 비밀번호가 다르면 오류 메시지를 보여주고 종료합니다.
    if (!matchedUser || matchedUser.password !== password) {
      loginError.textContent = '가입된 아이디가 없거나 비밀번호가 일치하지 않습니다.'
      return
    }

    // 로그인 성공 시 현재 사용자 정보를 authKey에 저장합니다.
    // loggedInAt은 언제 로그인했는지 기록하기 위한 ISO 날짜 문자열입니다.
    localStorage.setItem(
      authKey,
      JSON.stringify({ name, loggedInAt: new Date().toISOString() }),
    )
    loginForm.reset()
    loginError.textContent = ''
    setModal(false)
    updateAuthUi()
  })

  // ZIP 파일 업로드 처리:
  // change 이벤트는 파일 input에서 사용자가 파일을 선택했을 때 발생합니다.
  vaultUpload?.addEventListener('change', async (event) => {
    // event.target.files는 사용자가 선택한 File 객체 목록입니다.
    // 이 UI는 ZIP 하나만 다루므로 첫 번째 파일만 가져옵니다.
    const file = event.target.files?.[0]
    if (!file) return

    // 로그인하지 않은 사용자는 업로드를 진행하지 못하게 막습니다.
    if (!getUser()) {
      uploadMessage.textContent = '먼저 로그인해 주세요.'
      return
    }

    // 파일명 확장자가 .zip인지 간단히 검사합니다.
    // toLowerCase는 대문자 ZIP도 허용하기 위해 소문자로 바꿉니다.
    if (!file.name.toLowerCase().endsWith('.zip')) {
      uploadMessage.textContent = 'ZIP 파일만 업로드할 수 있습니다.'
      return
    }
    uploadMessage.textContent = 'ZIP 파일을 읽는 중입니다...'

    try {
      // await는 Promise가 끝날 때까지 기다린 뒤 결과를 받습니다.
      // parseMarkdownFilesFromZip은 ZIP을 풀고 Markdown 노트 배열을 반환합니다.
      parsedNotes = await parseMarkdownFilesFromZip(file)

      if (parsedNotes.length === 0) {
        uploadMessage.textContent = 'ZIP 내부에서 Markdown(.md) 파일을 찾지 못했습니다.'
        if (vaultResults) vaultResults.hidden = true
        return
      }

      // 분석 결과를 화면에 렌더링합니다.
      renderVaultAnalysis(parsedNotes)
      uploadMessage.textContent = `${parsedNotes.length}개의 Markdown 파일을 분석했습니다.`
    } catch (error) {
      // ZIP 파싱, 압축 해제, 디코딩 중 오류가 나면 사용자에게 메시지를 보여줍니다.
      uploadMessage.textContent = `분석 중 오류가 발생했습니다: ${error.message}`
    }
  })

  // renderVaultAnalysis:
  // 입력값: notes - ZIP에서 추출한 Markdown 노트 배열
  // 반환값: 없음
  // 동작: 모든 노트 텍스트를 합쳐 분야 점수와 키워드를 계산하고, 요약 카드/분야/키워드/노트 목록/미리보기를 렌더링합니다.
  const renderVaultAnalysis = (notes) => {
    // combinedText: 파일 경로와 본문을 모두 합친 문자열입니다.
    // 경로에도 "Forensics", "Network" 같은 힌트가 있을 수 있어 함께 분석합니다.
    const combinedText = notes.map((note) => `${note.path}\n${note.text}`).join('\n')

    // categories: 분야별 점수와 퍼센트가 들어 있는 배열입니다.
    const categories = scoreCategories(combinedText)

    // keywords: 빈도 기반으로 추출한 주요 키워드 배열입니다.
    const keywords = extractKeywords(combinedText, 24)

    // bestCategory: 점수가 가장 높은 첫 번째 분야명입니다.
    // categories가 비어 있는 예외 상황에서는 '미분류'를 표시합니다.
    const bestCategory = categories[0]?.name || '미분류'

    if (vaultResults) vaultResults.hidden = false
    if (noteCount) noteCount.textContent = String(notes.length)
    if (topCategory) topCategory.textContent = bestCategory
    if (keywordCount) keywordCount.textContent = String(keywords.length)

    renderCategories(categories)
    renderKeywords(keywords)
    renderNoteList(notes)
    renderMarkdownPreview(notes[0], 0)
  }

  // scoreCategories:
  // 입력값: text - 분석할 전체 Markdown 문자열
  // 반환값: [{ name, score, percent }, ...] 형태의 분야 점수 배열
  // 내부 로직:
  // 1. 전체 텍스트를 소문자로 바꿔 대소문자 차이를 없앱니다.
  // 2. categoryKeywords의 각 분야별 키워드가 몇 번 등장하는지 셉니다.
  // 3. 가장 높은 점수를 기준으로 percent 값을 계산합니다.
  // 4. 점수가 높은 분야가 먼저 오도록 정렬합니다.
  const scoreCategories = (text) => {
    // lowerText: 대소문자를 구분하지 않고 검색하기 위한 소문자 버전 텍스트입니다.
    const lowerText = text.toLowerCase()

    // Object.entries는 객체를 [key, value] 배열로 바꿔 순회할 수 있게 합니다.
    // 여기서는 [분야명, 키워드배열] 형태로 하나씩 꺼냅니다.
    const scored = Object.entries(categoryKeywords).map(([name, words]) => {
      // reduce는 배열의 값을 하나로 누적할 때 사용합니다.
      // words 배열을 돌며 각 키워드 등장 횟수를 score에 누적합니다.
      const score = words.reduce((sum, word) => {
        // 정규식에서 특별한 의미를 가지는 문자를 일반 문자로 검색하기 위해 이스케이프합니다.
        // 예: "c++" 같은 키워드가 들어오더라도 정규식 오류를 막기 위한 안전장치입니다.
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

        // RegExp는 문자열로 정규식을 만드는 생성자입니다.
        // gi 옵션: g는 전체 검색, i는 대소문자 무시입니다.
        const matches = lowerText.match(new RegExp(escaped, 'gi'))
        return sum + (matches ? matches.length : 0)
      }, 0)
      return { name, score }
    })

    // maxScore: 퍼센트 막대의 기준이 되는 가장 높은 점수입니다.
    // 모든 점수가 0일 때 0으로 나누는 일을 막기 위해 최소값을 1로 둡니다.
    const maxScore = Math.max(...scored.map((item) => item.score), 1)
    return scored
      .map((item) => ({ ...item, percent: Math.round((item.score / maxScore) * 100) }))
      .sort((a, b) => b.score - a.score)
  }

  // extractKeywords:
  // 입력값:
  // - text: 키워드를 추출할 전체 문자열
  // - limit: 상위 몇 개 키워드까지만 반환할지 결정하는 숫자
  // 반환값: [{ word, count }, ...] 형태의 키워드 빈도 배열
  // 내부 로직:
  // 1. 코드 블록과 특수문자를 제거합니다.
  // 2. 영문/숫자/한글 토큰만 추출합니다.
  // 3. stopWords와 너무 긴 단어를 제외합니다.
  // 4. 등장 횟수 기준으로 정렬해 상위 limit개만 반환합니다.
  const extractKeywords = (text, limit) => {
    // tokens: 분석 가능한 단어 조각 배열입니다.
    // match 정규식은 2글자 이상인 영문/숫자/한글 단어만 찾습니다.
    const tokens = text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*[\]()`~!?,.:;"'{}|\\/+=_-]/g, ' ')
      .toLowerCase()
      .match(/[a-z0-9가-힣]{2,}/g)

    if (!tokens) return []

    // counts: 단어별 등장 횟수를 저장하는 Map입니다.
    // Map은 key-value 저장소이며, 객체보다 동적인 키를 다루기 편합니다.
    const counts = tokens.reduce((map, token) => {
      if (stopWords.has(token) || token.length > 30) return map
      map.set(token, (map.get(token) || 0) + 1)
      return map
    }, new Map())

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }))
  }

  // renderCategories:
  // 입력값: categories - scoreCategories가 만든 분야 점수 배열
  // 반환값: 없음
  // 동작: categoryList 영역에 분야명, 점수 막대, 점수를 HTML 문자열로 렌더링합니다.
  const renderCategories = (categories) => {
    if (!categoryList) return

    // innerHTML은 요소 내부의 HTML을 한 번에 교체합니다.
    // map으로 각 카테고리 행 HTML을 만들고 join('')으로 하나의 문자열로 합칩니다.
    categoryList.innerHTML = categories
      .map(
        (category) => `
          <div class="category-row">
            <strong>${escapeHtml(category.name)}</strong>
            <div class="category-bar">
              <div class="category-fill" style="width: ${category.percent}%"></div>
            </div>
            <span>${category.score}</span>
          </div>
        `,
      )
      .join('')
  }

  // renderKeywords:
  // 입력값: keywords - extractKeywords가 만든 키워드 빈도 배열
  // 반환값: 없음
  // 동작: keywordCloud 영역에 키워드 칩을 렌더링합니다.
  const renderKeywords = (keywords) => {
    if (!keywordCloud) return
    keywordCloud.innerHTML = keywords
      .map(
        (keyword) =>
          `<span class="keyword-chip">${escapeHtml(keyword.word)} ${keyword.count}</span>`,
      )
      .join('')
  }

  // renderNoteList:
  // 입력값: notes - Markdown 노트 배열
  // 반환값: 없음
  // 동작:
  // 1. 각 Markdown 파일을 버튼 형태로 표시합니다.
  // 2. 첫 번째 노트에는 active 클래스를 붙입니다.
  // 3. 각 버튼 클릭 시 해당 노트를 미리보기 영역에 렌더링합니다.
  const renderNoteList = (notes) => {
    if (!noteList) return
    noteList.innerHTML = notes
      .map(
        (note, index) => `
          <button class="note-item${index === 0 ? ' active' : ''}" type="button" data-note-index="${index}">
            ${escapeHtml(note.name)}
            <small>${escapeHtml(note.path)}</small>
          </button>
        `,
      )
      .join('')

    // data-note-index는 HTML data-* 속성입니다.
    // 클릭한 버튼이 몇 번째 노트와 연결되는지 저장해 두고, dataset.noteIndex로 읽습니다.
    noteList.querySelectorAll('.note-item').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.noteIndex)
        renderMarkdownPreview(parsedNotes[index], index)
      })
    })
  }

  // renderMarkdownPreview:
  // 입력값:
  // - note: 미리보기할 Markdown 노트 객체 { path, name, text }
  // - index: notes 배열에서 해당 노트의 위치
  // 반환값: 없음
  // 동작: 선택된 노트 버튼을 active 처리하고, Markdown 텍스트를 HTML로 변환해 미리보기 영역에 넣습니다.
  const renderMarkdownPreview = (note, index) => {
    if (!markdownPreview || !note) return

    // 선택된 버튼만 active가 되도록 모든 note-item 버튼의 클래스를 갱신합니다.
    noteList?.querySelectorAll('.note-item').forEach((button) => {
      button.classList.toggle('active', Number(button.dataset.noteIndex) === index)
    })

    // heading: 미리보기 상단에 파일명과 경로를 보여주기 위한 HTML 문자열입니다.
    // escapeHtml로 파일명을 안전하게 변환해 HTML 삽입 문제를 방지합니다.
    const heading = `<h1>${escapeHtml(note.name)}</h1><p><strong>경로:</strong> ${escapeHtml(note.path)}</p>`

    // body: Markdown 문법을 간단한 HTML로 바꾼 결과입니다.
    const body = fallbackMarkdownToHtml(note.text)

    // sanitizePreviewHtml은 변환된 HTML에서 위험한 태그/속성을 제거합니다.
    markdownPreview.innerHTML = heading + sanitizePreviewHtml(body)
  }

  // parseMarkdownFilesFromZip:
  // 입력값: file - 사용자가 업로드한 ZIP File 객체
  // 반환값: Promise<notes> - Markdown 노트 배열을 비동기로 반환
  // 내부 로직:
  // 1. file.arrayBuffer()로 파일을 바이너리 데이터(ArrayBuffer)로 읽습니다.
  // 2. fflate 라이브러리가 있으면 unzipSync로 ZIP을 간단하게 풉니다.
  // 3. fflate가 없으면 직접 ZIP 중앙 디렉터리를 읽는 fallback 로직을 사용합니다.
  // 4. .md 파일만 골라 UTF-8 문자열로 디코딩합니다.
  async function parseMarkdownFilesFromZip(file) {
    // ArrayBuffer는 파일이나 네트워크 데이터 같은 바이너리 원본을 담는 JS 객체입니다.
    const buffer = await file.arrayBuffer()

    // window.fflate는 index.html에서 불러온 fflate.min.js가 제공하는 ZIP 라이브러리입니다.
    // unzipSync가 있으면 다양한 ZIP 압축 방식을 안정적으로 처리할 수 있습니다.
    if (window.fflate?.unzipSync) {
      return parseMarkdownFilesWithFflate(buffer)
    }

    // fallback:
    // 라이브러리가 없을 때 직접 ZIP의 중앙 디렉터리를 읽어 파일 목록을 가져옵니다.
    const entries = readZipCentralDirectory(buffer).filter(
      (entry) => !entry.isDirectory && entry.name.toLowerCase().endsWith('.md'),
    )

    // notes: 최종적으로 화면에서 사용할 Markdown 노트 배열입니다.
    const notes = []

    // for...of는 배열의 각 값을 순서대로 꺼내 반복합니다.
    // await가 포함된 비동기 작업을 순서대로 처리하기 좋습니다.
    for (const entry of entries) {
      const bytes = await readZipEntryBytes(buffer, entry)

      // TextDecoder는 Uint8Array 같은 바이너리 데이터를 문자열로 변환하는 브라우저 내장 API입니다.
      // Obsidian Markdown은 보통 UTF-8이므로 utf-8 디코더를 사용합니다.
      const text = new TextDecoder('utf-8').decode(bytes)
      notes.push({
        path: entry.name,
        name: entry.name.split('/').pop(),
        text,
      })
    }
    return notes
  }

  // parseMarkdownFilesWithFflate:
  // 입력값: buffer - ZIP 파일의 ArrayBuffer
  // 반환값: Markdown 노트 배열
  // 동작: fflate.unzipSync로 ZIP을 풀고, .md 파일만 골라 { path, name, text } 형태로 변환합니다.
  function parseMarkdownFilesWithFflate(buffer) {
    // decoder: UTF-8 바이너리를 문자열로 바꾸기 위한 TextDecoder 인스턴스입니다.
    const decoder = new TextDecoder('utf-8')

    // Uint8Array는 ArrayBuffer를 1바이트 단위 숫자 배열처럼 다루게 해 줍니다.
    // fflate.unzipSync는 Uint8Array ZIP 데이터를 받아 파일명: 파일바이트 객체를 반환합니다.
    const files = window.fflate.unzipSync(new Uint8Array(buffer))
    return Object.entries(files)
      .filter(([path]) => path.toLowerCase().endsWith('.md'))
      .map(([path, bytes]) => ({
        path: path.replace(/\\/g, '/'),
        name: path.split('/').pop(),
        text: decoder.decode(bytes),
      }))
  }

  // readZipCentralDirectory:
  // 입력값: buffer - ZIP 파일 전체 ArrayBuffer
  // 반환값: ZIP 안의 파일 엔트리 메타데이터 배열
  // 내부 로직:
  // ZIP 파일 끝부분의 EOCD(End Of Central Directory)를 찾고,
  // 중앙 디렉터리에서 파일명, 압축 방식, 크기, 로컬 헤더 위치 등을 읽습니다.
  // 이 함수는 fflate가 없을 때를 대비한 수동 ZIP 파서입니다.
  function readZipCentralDirectory(buffer) {
    // DataView는 ArrayBuffer에서 특정 위치의 숫자를 little-endian 등 원하는 방식으로 읽게 해 줍니다.
    // ZIP 포맷은 여러 숫자 필드를 little-endian으로 저장합니다.
    const view = new DataView(buffer)
    const decoder = new TextDecoder('utf-8')

    // eocdOffset: ZIP 파일 끝에 있는 중앙 디렉터리 종료 레코드의 시작 위치입니다.
    const eocdOffset = findEndOfCentralDirectory(view)
    if (eocdOffset < 0) throw new Error('올바른 ZIP 파일이 아닙니다.')

    // getUint16/getUint32는 DataView에서 2바이트/4바이트 unsigned integer를 읽습니다.
    // 두 번째 인자 true는 little-endian 방식으로 읽겠다는 뜻입니다.
    const entryCount = view.getUint16(eocdOffset + 10, true)
    const centralDirectoryOffset = view.getUint32(eocdOffset + 16, true)

    // entries: ZIP 내부 파일들의 메타정보를 모을 배열입니다.
    const entries = []

    // offset: 현재 중앙 디렉터리에서 읽고 있는 위치입니다.
    let offset = centralDirectoryOffset

    for (let index = 0; index < entryCount; index += 1) {
      // 0x02014b50은 ZIP 중앙 디렉터리 파일 헤더의 시그니처입니다.
      // 이 값이 아니면 ZIP 구조가 예상과 다르므로 오류를 냅니다.
      if (view.getUint32(offset, true) !== 0x02014b50) {
        throw new Error('ZIP 중앙 디렉터리를 읽을 수 없습니다.')
      }

      // 아래 변수들은 ZIP 중앙 디렉터리 헤더의 고정 위치에서 읽는 메타데이터입니다.
      // flags: 파일명 인코딩 등 ZIP 옵션 플래그입니다.
      const flags = view.getUint16(offset + 8, true)

      // method: 압축 방식입니다. 0은 저장, 8은 Deflate 압축입니다.
      const method = view.getUint16(offset + 10, true)

      // compressedSize / uncompressedSize: 압축된 크기와 원래 크기입니다.
      const compressedSize = view.getUint32(offset + 20, true)
      const uncompressedSize = view.getUint32(offset + 24, true)

      // nameLength / extraLength / commentLength:
      // 파일명, 부가정보, 주석의 길이입니다. 다음 엔트리 위치를 계산하는 데 필요합니다.
      const nameLength = view.getUint16(offset + 28, true)
      const extraLength = view.getUint16(offset + 30, true)
      const commentLength = view.getUint16(offset + 32, true)

      // localHeaderOffset: 실제 파일 데이터가 있는 로컬 파일 헤더의 위치입니다.
      const localHeaderOffset = view.getUint32(offset + 42, true)

      // nameBytes: 중앙 디렉터리에 저장된 파일명 바이트입니다.
      const nameBytes = new Uint8Array(buffer, offset + 46, nameLength)

      // Windows 경로 구분자 \를 웹에서 쓰기 편한 /로 통일합니다.
      const name = decoder.decode(nameBytes).replace(/\\/g, '/')

      entries.push({
        name,
        flags,
        method,
        compressedSize,
        uncompressedSize,
        localHeaderOffset,
        isDirectory: name.endsWith('/'),
      })

      // 다음 중앙 디렉터리 엔트리로 이동합니다.
      // ZIP 헤더 기본 크기 46바이트에 파일명/extra/comment 길이를 더합니다.
      offset += 46 + nameLength + extraLength + commentLength
    }

    return entries
  }

  // findEndOfCentralDirectory:
  // 입력값: view - ZIP ArrayBuffer를 읽기 위한 DataView
  // 반환값: EOCD 시그니처 위치 또는 -1
  // 동작: ZIP 파일 끝에서 앞으로 훑으며 0x06054b50 시그니처를 찾습니다.
  function findEndOfCentralDirectory(view) {
    // ZIP 주석은 최대 65535바이트까지 가능하므로, EOCD는 파일 끝에서 최대 65557바이트 안에 있습니다.
    const minOffset = Math.max(0, view.byteLength - 65557)
    for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
      if (view.getUint32(offset, true) === 0x06054b50) return offset
    }
    return -1
  }

  // readZipEntryBytes:
  // 입력값:
  // - buffer: ZIP 전체 ArrayBuffer
  // - entry: readZipCentralDirectory가 만든 파일 메타데이터
  // 반환값: Promise<Uint8Array> - 해당 파일의 압축 해제된 바이트
  // 동작: 로컬 파일 헤더에서 실제 데이터 위치를 계산한 뒤, 압축 방식에 따라 원본 바이트를 반환합니다.
  async function readZipEntryBytes(buffer, entry) {
    const view = new DataView(buffer)

    // offset: 해당 파일의 로컬 헤더 시작 위치입니다.
    const offset = entry.localHeaderOffset

    // 0x04034b50은 ZIP 로컬 파일 헤더 시그니처입니다.
    if (view.getUint32(offset, true) !== 0x04034b50) {
      throw new Error(`${entry.name} 파일 헤더를 읽을 수 없습니다.`)
    }

    // 로컬 헤더에도 파일명과 extra 필드가 있으므로,
    // 실제 압축 데이터는 30바이트 기본 헤더 뒤에 두 길이를 더한 위치에서 시작합니다.
    const nameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)
    const dataOffset = offset + 30 + nameLength + extraLength

    // compressedBytes: ZIP 안에 저장된 압축 상태의 파일 데이터입니다.
    const compressedBytes = new Uint8Array(
      buffer,
      dataOffset,
      entry.compressedSize,
    )

    // method 0은 압축 없이 저장된 파일이므로 그대로 반환합니다.
    if (entry.method === 0) return compressedBytes

    // method 8은 Deflate 압축입니다. 브라우저 내장 DecompressionStream으로 풉니다.
    if (entry.method === 8) return inflateRaw(compressedBytes)

    throw new Error(`${entry.name} 파일의 ZIP 압축 방식(${entry.method})을 지원하지 않습니다.`)
  }

  // inflateRaw:
  // 입력값: bytes - Deflate raw 형식으로 압축된 Uint8Array
  // 반환값: Promise<Uint8Array> - 압축 해제된 바이트
  // 동작: DecompressionStream 브라우저 API를 사용해 raw deflate 데이터를 풉니다.
  async function inflateRaw(bytes) {
    // DecompressionStream은 최신 브라우저에서 제공하는 압축 해제 스트림 API입니다.
    // 지원하지 않는 브라우저에서는 fflate 라이브러리 경로를 우선 사용해야 합니다.
    if (!window.DecompressionStream) {
      throw new Error('이 브라우저는 ZIP Deflate 해제를 지원하지 않습니다.')
    }

    // Blob은 바이트 데이터를 파일 같은 객체로 감싸는 브라우저 API입니다.
    // stream()으로 ReadableStream을 만들고, pipeThrough로 압축 해제 스트림을 통과시킵니다.
    const stream = new Blob([bytes])
      .stream()
      .pipeThrough(new DecompressionStream('deflate-raw'))

    // Response(...).arrayBuffer()는 스트림 결과를 다시 ArrayBuffer로 모으는 편리한 방법입니다.
    return new Uint8Array(await new Response(stream).arrayBuffer())
  }

  // fallbackMarkdownToHtml:
  // 입력값: markdown - Markdown 원문 문자열
  // 반환값: 간단한 HTML 문자열
  // 동작:
  // 이 프로젝트에서 필요한 기본 Markdown 문법만 직접 변환합니다.
  // 지원 문법: #/##/### 제목, **굵게**, `인라인 코드`, ```코드블록```, 목록 일부, 줄바꿈
  function fallbackMarkdownToHtml(markdown) {
    // 먼저 escapeHtml로 원문을 안전한 텍스트로 바꾼 뒤 줄 단위로 나눕니다.
    const lines = escapeHtml(markdown).split(/\r?\n/)

    // inCodeBlock: 현재 줄이 ``` 코드블록 내부인지 저장합니다.
    // 코드블록 내부에서는 Markdown 변환을 하지 않고 원문 형태를 유지합니다.
    let inCodeBlock = false

    return lines
      .map((line) => {
        // trim은 줄 앞뒤 공백을 제거합니다.
        // ```를 만나면 코드블록 시작/종료 상태를 반전합니다.
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock
          return inCodeBlock ? '<pre><code>' : '</code></pre>'
        }
        if (inCodeBlock) return `${line}\n`

        // replace는 문자열에서 특정 패턴을 찾아 다른 문자열로 바꿉니다.
        // 여기서는 Markdown 굵게/인라인 코드 문법을 HTML 태그로 변환합니다.
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')

        // 정규식 /^#\s+/는 줄 시작의 제목 문법을 검사합니다.
        if (/^###\s+/.test(formatted)) return `<h3>${formatted.replace(/^###\s+/, '')}</h3>`
        if (/^##\s+/.test(formatted)) return `<h2>${formatted.replace(/^##\s+/, '')}</h2>`
        if (/^#\s+/.test(formatted)) return `<h1>${formatted.replace(/^#\s+/, '')}</h1>`
        if (/^[-*]\s+/.test(formatted)) return `<p>• ${formatted.replace(/^[-*]\s+/, '')}</p>`
        if (!formatted.trim()) return '<br />'
        return `<p>${formatted}</p>`
      })
      .join('')
  }

  // sanitizePreviewHtml:
  // 입력값: html - 미리보기에 넣을 HTML 문자열
  // 반환값: 위험 요소를 제거한 HTML 문자열
  // 동작:
  // Markdown에서 변환된 HTML에 script, iframe, onerror 같은 위험 요소가 들어가지 않도록 제거합니다.
  // 정적 사이트라도 사용자가 업로드한 Markdown을 HTML로 렌더링하므로 안전 처리가 필요합니다.
  function sanitizePreviewHtml(html) {
    // template 요소는 HTML 문자열을 실제 DOM 조각으로 파싱할 때 유용합니다.
    // 화면에 바로 붙지 않으므로 검사/수정 후 안전한 결과만 꺼낼 수 있습니다.
    const template = document.createElement('template')
    template.innerHTML = html

    // querySelectorAll로 위험한 태그를 찾아 remove로 삭제합니다.
    template.content
      .querySelectorAll('script, iframe, object, embed, link, style')
      .forEach((node) => node.remove())

    // 모든 요소의 속성을 검사해 onclick 같은 이벤트 속성이나 javascript: URL을 제거합니다.
    template.content.querySelectorAll('*').forEach((node) => {
      // attributes는 NamedNodeMap이므로 전개 연산자([...])로 배열처럼 바꿔 forEach를 사용합니다.
      ;[...node.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase()
        const value = attribute.value.toLowerCase()
        if (name.startsWith('on') || value.startsWith('javascript:')) {
          node.removeAttribute(attribute.name)
        }
      })
    })
    return template.innerHTML
  }

  // escapeHtml:
  // 입력값: value - HTML 화면에 텍스트로 표시할 값
  // 반환값: HTML 특수문자가 이스케이프된 문자열
  // 동작:
  // <, >, &, ", ' 같은 문자를 HTML 엔티티로 바꿔 사용자가 입력한 내용이 태그로 실행되지 않게 합니다.
  // 예: "<script>" -> "&lt;script&gt;"
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // 페이지 로드 직후 현재 localStorage 로그인 상태를 읽어 UI를 한 번 초기화합니다.
  updateAuthUi()
})
