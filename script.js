
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const autoplayBtn = document.getElementById('autoplayBtn');
    const readMoreButtons = document.querySelectorAll('.read-more');
    const ratings = document.querySelectorAll('.rating');
    let currentTheme = 'light';
    let currentFilter = 'all';
    let currentIndex = 0;
    let autoplayInterval;
    let isAutoplay = true;
    let visibleCards = Array.from(testimonialCards);
    
    // Set initial theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
    });
    
    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        currentTheme = theme;
    }
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards
            currentFilter = filter;
            filterTestimonials(filter);
        });
    });
    
    function filterTestimonials(filter) {
        testimonialCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('visible');
                }, 50);
            } else {
                card.classList.remove('visible');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update visible cards array
        visibleCards = Array.from(testimonialCards).filter(card => {
            return filter === 'all' || card.getAttribute('data-category') === filter;
        });
    }
    
    // Read more functionality
    readMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const textElement = e.target.previousElementSibling;
            if (textElement.classList.contains('truncated')) {
                textElement.classList.remove('truncated');
                e.target.textContent = 'Read Less';
            } else {
                textElement.classList.add('truncated');
                e.target.textContent = 'Read More';
            }
        });
    });
    
    // Rating animation
    ratings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        if (stars.length === 5 && stars[4].classList.contains('fa-star')) {
            // This is a 5-star rating
            rating.addEventListener('mouseover', () => {
                stars.forEach(star => {
                    star.classList.add('star-glow');
                });
                
                // Create confetti effect for 5-star ratings
                createConfetti(rating);
            });
        }
    });
    
    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${rect.left + Math.random() * rect.width}px`;
            confetti.style.top = `${rect.top}px`;
            confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 5 + 5}px`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);
            
            // Animate confetti
            confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 2000,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
            });
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }
    
    // Carousel functionality for mobile view
    function setupCarousel() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            testimonialCards.forEach(card => {
                card.style.display = 'none';
            });
            
            if (visibleCards.length > 0) {
                visibleCards[currentIndex].style.display = 'block';
                visibleCards[currentIndex].classList.add('slide-in');
            }
            
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
            
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === visibleCards.length - 1;
        } else {
            testimonialCards.forEach(card => {
                card.style.display = 'block';
            });
            
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    }
    
    // Initial setup
    setupCarousel();
    window.addEventListener('resize', setupCarousel);
    
    // Navigation buttons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            visibleCards[currentIndex].classList.remove('slide-in');
            currentIndex--;
            visibleCards[currentIndex].classList.add('slide-in');
            updateCarousel();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentIndex < visibleCards.length - 1) {
            visibleCards[currentIndex].classList.remove('slide-in');
            currentIndex++;
            visibleCards[currentIndex].classList.add('slide-in');
            updateCarousel();
        }
    });
    
    function updateCarousel() {
        testimonialCards.forEach(card => {
            card.style.display = 'none';
        });
        
        if (visibleCards.length > 0) {
            visibleCards[currentIndex].style.display = 'block';
        }
        
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === visibleCards.length - 1;
    }
    
    // Autoplay functionality
    function startAutoplay() {
        if (window.innerWidth > 768) return; // Only autoplay on mobile
        
        autoplayInterval = setInterval(() => {
            if (currentIndex < visibleCards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 5000);
    }
    
    startAutoplay();
    
    // Toggle autoplay
    autoplayBtn.addEventListener('click', () => {
        isAutoplay = !isAutoplay;
        if (isAutoplay) {
            startAutoplay();
            autoplayBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Autoplay';
        } else {
            clearInterval(autoplayInterval);
            autoplayBtn.innerHTML = '<i class="fas fa-play"></i> Play Autoplay';
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentIndex < visibleCards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Intersection Observer for animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    testimonialCards.forEach(card => {
        observer.observe(card);
    });
});
