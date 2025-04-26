// 문서가 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 변수 초기화
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-control.prev');
    const nextBtn = document.querySelector('.slider-control.next');
    const tabDetail = document.getElementById('tab-detail');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const productNavLinks = document.querySelectorAll('.product-nav a');
    const scrollAnimElements = document.querySelectorAll('.scroll-animate');
    
    let currentSlide = 0;
    let slideWidth = 0;
    let autoSlideInterval;
    let isDesktop = window.innerWidth >= 992;
    
    // 슬라이더가 없으면 슬라이드 관련 코드 실행하지 않음
    if (slider && slides.length > 0) {
        // 스크롤 애니메이션 처리
        function checkScroll() {
            scrollAnimElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                // 요소가 화면에 보이는지 확인
                if (elementTop < windowHeight * 0.85) {
                    element.classList.add('visible');
                }
            });
        }

        // 스크롤 이벤트 등록
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        
        // 초기 체크
        setTimeout(checkScroll, 100);
        
        // 반응형 슬라이더 설정
        function setupSlider() {
            isDesktop = window.innerWidth >= 992;
            slideWidth = slider.offsetWidth;
            
            // 슬라이더 위치 재설정
            goToSlide(currentSlide);
        }
        
        // 슬라이드 이동 함수
        function goToSlide(index) {
            // 슬라이드 범위 체크
            if (index < 0) {
                index = slides.length - 1;
            } else if (index > slides.length - 1) {
                index = 0;
            }
            
            currentSlide = index;
            
            // 슬라이더 이동
            slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            
            // 네비게이션 메뉴 활성화 상태 업데이트
            updateNavigation();
        }
        
        // 네비게이션 메뉴 활성화 상태 업데이트
        function updateNavigation() {
            productNavLinks.forEach((link, i) => {
                link.classList.toggle('active', i === currentSlide);
            });
        }
        
        // 자동 슬라이드 시작
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }
        
        // 자동 슬라이드 중지
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // 이벤트 리스너 등록
        // 네비게이션 메뉴 클릭
        productNavLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });
        
        // 이전 버튼
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            stopAutoSlide();
            startAutoSlide();
        });
        
        // 다음 버튼
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            stopAutoSlide();
            startAutoSlide();
        });
        
        // 윈도우 리사이즈 시 슬라이더 재설정
        window.addEventListener('resize', setupSlider);
        
        // 슬라이더 드래그 기능
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        
        slider.addEventListener('mousedown', dragStart);
        slider.addEventListener('touchstart', dragStart);
        slider.addEventListener('mouseup', dragEnd);
        slider.addEventListener('touchend', dragEnd);
        slider.addEventListener('mouseleave', dragEnd);
        slider.addEventListener('mousemove', drag);
        slider.addEventListener('touchmove', drag);
        
        function dragStart(e) {
            if (e.type === 'mousedown') {
                e.preventDefault();
            }
            startPos = getPositionX(e);
            isDragging = true;
            currentTranslate = currentSlide * -slideWidth;
            stopAutoSlide();
        }
        
        function drag(e) {
            if (isDragging) {
                const currentPosition = getPositionX(e);
                const diff = currentPosition - startPos;
                const translate = currentTranslate + diff;
                slider.style.transform = `translateX(${translate}px)`;
            }
        }
        
        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            const movedBy = currentTranslate - currentSlide * -slideWidth;
            
            // 충분히 드래그했는지 판단 (슬라이드 너비의 20% 이상)
            if (movedBy < -slideWidth * 0.2) {
                goToSlide(currentSlide + 1);
            } else if (movedBy > slideWidth * 0.2) {
                goToSlide(currentSlide - 1);
            } else {
                goToSlide(currentSlide);
            }
            
            startAutoSlide();
        }
        
        function getPositionX(e) {
            return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }
        
        // 슬라이더 초기화
        setupSlider();
        startAutoSlide();
    }
    
    // 탭 컨텐츠 표시 함수
    window.showTabContent = function(tabId) {
        // 탭 디테일 표시
        tabDetail.classList.add('show');
        
        // 모든 탭 패널 비활성화
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // 선택한 탭 패널 활성화
        document.getElementById(tabId).classList.add('active');
        
        // 탭 디테일로 스크롤
        tabDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    // 신청 폼 제출 처리
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.querySelector('.close');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            product: document.getElementById('product').value,
            message: document.getElementById('message').value
        };
        
        // 데이터 저장 (실제로는 서버로 전송)
        saveFormData(formData);
        
        // 폼 초기화
        contactForm.reset();
        
        // 성공 모달 표시
        successModal.classList.add('show');
    });
    
    // 모달 닫기
    closeModalBtn.addEventListener('click', function() {
        successModal.classList.remove('show');
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('show');
        }
    });
    
    // 스크롤 이동 함수
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        
        // 섹션이 존재하는지 확인
        if (section) {
            // 부드러운 스크롤 효과
            window.scrollTo({
                top: section.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 애니메이션 클래스 추가 (약간의 지연 시간 추가)
            setTimeout(() => {
                if (section.classList.contains('scroll-animate')) {
                    section.classList.add('visible');
                }
                
                // 섹션 내 스크롤 애니메이션 요소 활성화
                const elementsToAnimate = section.querySelectorAll('.scroll-animate');
                elementsToAnimate.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, 100 * index); // 순차적으로 나타나게 함
                });
            }, 500);
        }
    };
    
    // 최상단으로 스크롤하는 함수
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
});

// 폼 데이터 저장 함수 (로컬 스토리지 사용)
function saveFormData(data) {
    // 기존 데이터 가져오기
    let savedData = localStorage.getItem('contactFormData');
    let dataArray = [];
    
    if (savedData) {
        dataArray = JSON.parse(savedData);
    }
    
    // 새 데이터 추가
    data.date = new Date().toISOString();
    dataArray.push(data);
    
    // 데이터 저장
    localStorage.setItem('contactFormData', JSON.stringify(dataArray));
    
    // 실제 구현에서는 여기서 서버로 데이터를 전송하고
    // 이메일 발송 API를 호출할 수 있습니다.
    console.log('폼 데이터가 저장되었습니다:', data);
    
    // 백엔드 구현 시 아래 주석 해제
    /*
    fetch('/api/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('서버 응답:', result);
    })
    .catch(error => {
        console.error('에러:', error);
    });
    */
} 