/* ==============================================================
   CHÙA MỘT CỘT – WEBSITE DU LỊCH VĂN HÓA
   JavaScript chính
   ============================================================== */

// Xử lý fallback ảnh ẩm thực nếu file chính không tồn tại
function handleFoodImageError(img, altSrc) {
  if (altSrc && !img.dataset.altTried) {
    img.dataset.altTried = 'true';
    img.src = altSrc;
  } else {
    img.style.display = 'none';
    var fallback = img.nextElementSibling;
    if (fallback && fallback.classList.contains('food__image-fallback')) {
      fallback.style.display = 'flex';
    }
  }
}

// Chờ DOM tải xong trước khi chạy script
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================
     1. NAVBAR – Toggle menu trên mobile
     ========================================================== */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.navbar__link');
  const navbar    = document.getElementById('navbar');

  // Mở / đóng menu khi nhấn nút hamburger
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  // Đóng menu khi nhấn vào link trong menu (mobile)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // Đóng menu khi nhấn ra ngoài (mobile)
  document.addEventListener('click', function (e) {
    if (navMenu && navMenu.classList.contains('open')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    }
  });

  /* ==========================================================
     2. NAVBAR – Thêm bóng khi cuộn trang
     ========================================================== */
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);

  /* ==========================================================
     3. NAVBAR – Highlight link đang active theo vị trí cuộn
     ========================================================== */
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveLink() {
    var scrollPos = window.scrollY + 100; // offset cho navbar

    sections.forEach(function (section) {
      var sectionTop    = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId     = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Bỏ class active khỏi tất cả link
        navLinks.forEach(function (link) {
          link.classList.remove('active');
        });

        // Thêm class active cho link tương ứng
        var activeLink = document.querySelector('.navbar__link[href="#' + sectionId + '"]');
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink);

  /* ==========================================================
     4. NÚT CUỘN LÊN ĐẦU TRANG (Scroll to Top)
     ========================================================== */
  var scrollTopBtn = document.getElementById('scrollTopBtn');

  function toggleScrollTopBtn() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleScrollTopBtn);

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     5. ANIMATION – Hiệu ứng xuất hiện khi cuộn (Intersection Observer)
     ========================================================== */
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  // Kiểm tra trình duyệt hỗ trợ IntersectionObserver
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Ngừng theo dõi phần tử đã hiện (tối ưu hiệu năng)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,       // Kích hoạt khi 10% phần tử xuất hiện
      rootMargin: '0px 0px -50px 0px'  // Kích hoạt sớm hơn 50px
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: nếu trình duyệt không hỗ trợ, hiển thị tất cả luôn
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ==========================================================
     6. LIGHTBOX – Xem ảnh phóng to
     ========================================================== */
  var lightbox      = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.querySelector('.lightbox__close');
  var galleryItems  = document.querySelectorAll('.gallery__item');

  // Mở lightbox khi nhấn vào ảnh
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      var caption = item.getAttribute('data-caption') || '';

      if (img) {
        // Nếu đã có ảnh thực tế
        lightboxImage.src = img.src;
        lightboxImage.alt = caption;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang
      } else {
        // Nếu đang là placeholder – hiển thị caption
        lightboxCaption.textContent = caption || 'Ảnh chưa được thêm';
        lightboxImage.src = '';
        lightboxImage.alt = '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Đóng lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImage.src = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Đóng lightbox khi nhấn ra ngoài ảnh
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Đóng lightbox bằng phím Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ==========================================================
     7. SMOOTH SCROLL – Cuộn mượt cho anchor links
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================
     8. CHỐNG CLICK NHANH (Debounce) cho các sự kiện scroll
     ========================================================== */
  // Gộp các hàm scroll vào một handler duy nhất để tối ưu
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleNavbarScroll();
        highlightActiveLink();
        toggleScrollTopBtn();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ==========================================================
     9. ẨM THỰC – Bắt sự kiện lỗi tải ảnh và kích hoạt fallback
     ========================================================== */
  document.querySelectorAll('.food__img').forEach(function (img) {
    // Nếu ảnh đã hoàn tất tải nhưng bị lỗi (naturalWidth === 0)
    if (img.complete && img.naturalWidth === 0) {
      var altSrc = img.getAttribute('data-alt-src');
      handleFoodImageError(img, altSrc);
    }
    img.addEventListener('error', function () {
      var altSrc = img.getAttribute('data-alt-src');
      handleFoodImageError(img, altSrc);
    });
  });

}); // END DOMContentLoaded

