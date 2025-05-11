document.addEventListener('DOMContentLoaded', function () {
    new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
});