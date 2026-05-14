document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Countdown Timer Logic
    const countdownDate = new Date('August 31, 2026 23:59:59').getTime();

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(updateCountdown);
            document.getElementById('countdown').innerHTML = "<b>Đã hết hạn nhận học bổng sớm!</b>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // 2. Animated Counters on Scroll
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.getElementById('stats');
    const checkScroll = () => {
        if (!hasCounted && statsSection) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateCounters();
                hasCounted = true;
            }
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on load

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });



    // 5. Exit Intent Popup Logic (disabled)
    const popupOverlay = document.getElementById('exitPopup');
    if (popupOverlay) {
        popupOverlay.classList.remove('show');
        popupOverlay.style.display = 'none';
        sessionStorage.setItem('exitPopupShown', 'true');
    }

    // 6. Form Submission (Google Sheets Webhook)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzfTNG-sW3WV_zz8a5TY0c3VgIIfaHt_e5Tr38IU5FJKf3HYuiOl1Uk8nztm9HS13-zww/exec';

    const handleFormSubmit = (form, successMsg) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Meta Pixel Tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead');
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Đang gửi...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log("Dữ liệu gửi đi:", data); // Kiểm tra tại đây (nhấn F12)

            const queryString = new URLSearchParams(data).toString();
            
            fetch(`${scriptURL}?${queryString}`, { 
                method: 'POST'
            })
            .then(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                alert(successMsg);
                form.reset();
                if (form.id === 'popupForm') {
                    popupOverlay.classList.remove('show');
                }
            })
            .catch(error => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                console.error('Lỗi gửi form:', error);
                alert('Có lỗi xảy ra, vui lòng thử lại sau!');
            });
        });
    };

    handleFormSubmit(
        document.getElementById('admissionForm'), 
        'Chúc mừng bạn đã đăng ký thành công! Ban tuyển sinh sẽ liên hệ với bạn ngay để hướng dẫn hoàn thiện hồ sơ nhận học bổng.'
    );

    handleFormSubmit(
        document.getElementById('popupForm'), 
        'Cảm ơn bạn! Chúng tôi đã ghi nhận yêu cầu và giữ chỗ học bổng 50% cho bạn.'
    );

    // 7. Simulated Notification Bar Update
    const names = [
        'Nguyễn Minh Anh', 'Lê Thị Hồng Nhung', 'Phạm Hoàng Nam', 'Đỗ Kim Liên', 
        'Vũ Minh Đức', 'Hoàng Thu Trang', 'Nguyễn Quốc Bảo', 'Bùi Phương Thảo', 
        'Trịnh Văn Hùng', 'Ngô Mỹ Hạnh', 'Đặng Tuấn Kiệt', 'Phan Bảo Ngọc',
        'Lý Gia Huy', 'Hồ Diễm My', 'Cao Minh Triết'
    ];
    const locations = [
        'Hà Nội', 'Bắc Ninh', 'Hải Phòng', 'Thanh Hóa', 'Nghệ An', 
        'Thái Bình', 'Nam Định', 'Vĩnh Phúc', 'Hưng Yên', 'Quảng Ninh',
        'Bắc Giang', 'Phú Thọ', 'Hà Nam', 'Hải Dương', 'Lạng Sơn'
    ];
    const majors = ['Quản trị khách sạn', 'Điều dưỡng', 'Thiết kế đồ họa', 'Kỹ thuật chế biến món ăn', 'Công nghệ thông tin', 'Dược học', 'Ngôn ngữ Hàn', 'Kỹ thuật xét nghiệm'];

    setInterval(() => {
        const name = names[Math.floor(Math.random() * names.length)];
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const major = majors[Math.floor(Math.random() * majors.length)];
        
        const notifElement = document.getElementById('recent-registration');
        notifElement.style.opacity = 0;
        
        setTimeout(() => {
            notifElement.innerText = `${name} (${loc}) vừa đăng ký ngành ${major}...`;
            notifElement.style.opacity = 1;
        }, 500);
    }, 8000);

});
