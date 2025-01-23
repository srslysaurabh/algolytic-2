document.addEventListener('DOMContentLoaded', () => {
    // Navigation Dropdown Handling
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown');
        if (dropdown) {
            // Show/Hide dropdown
            item.addEventListener('mouseenter', () => {
                dropdown.style.opacity = '1';
                dropdown.style.visibility = 'visible';
            });

            item.addEventListener('mouseleave', () => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            });

            // Tab functionality
            const tabs = dropdown.querySelectorAll('.dropdown-tab');
            tabs.forEach(tab => {
                tab.addEventListener('mouseenter', () => {
                    // Remove active classes
                    tabs.forEach(t => t.classList.remove('active'));
                    dropdown.querySelectorAll('.dropdown-content').forEach(content => {
                        content.classList.remove('active');
                    });

                    // Add active classes
                    tab.classList.add('active');
                    const targetContent = dropdown.querySelector(
                        `.dropdown-content[data-content="${tab.dataset.tab}"]`
                    );
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        }
    });

    // Header Scroll Effect
    let lastScroll = 0;
    const header = document.querySelector('.header');
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            header.classList.remove('hidden');
            return;
        }

        header.classList.add('scrolled');
        
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    }

    // Throttle scroll event
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Blog Slider Functionality
    const blogSlider = document.querySelector('.blogs-track');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');

    if (blogSlider && prevButton && nextButton) {
        const cardWidth = 350 + 24; // card width + gap
        const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time

        function updateSliderButtons() {
            const maxScroll = blogSlider.scrollWidth - blogSlider.clientWidth;
            prevButton.style.opacity = blogSlider.scrollLeft <= 0 ? '0.5' : '1';
            nextButton.style.opacity = blogSlider.scrollLeft >= maxScroll - 1 ? '0.5' : '1';
        }

        nextButton.addEventListener('click', () => {
            blogSlider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevButton.addEventListener('click', () => {
            blogSlider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        blogSlider.addEventListener('scroll', updateSliderButtons);
        updateSliderButtons(); // Initial state

        // Touch slider functionality
        let startX;
        let scrollLeft;
        let isDown = false;

        blogSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - blogSlider.offsetLeft;
            scrollLeft = blogSlider.scrollLeft;
            blogSlider.style.cursor = 'grabbing';
        });

        blogSlider.addEventListener('mouseleave', () => {
            isDown = false;
            blogSlider.style.cursor = 'grab';
        });

        blogSlider.addEventListener('mouseup', () => {
            isDown = false;
            blogSlider.style.cursor = 'grab';
        });

        blogSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - blogSlider.offsetLeft;
            const walk = (x - startX) * 2;
            blogSlider.scrollLeft = scrollLeft - walk;
        });
    }

    // Form Handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading state
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;

                // Collect form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Simulate API call (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Success handling
                submitBtn.textContent = 'Success!';
                form.reset();

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);

            } catch (error) {
                console.error('Form submission error:', error);
                submitBtn.textContent = 'Error! Try Again';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('.fade-up, .feature-card, .blog-card').forEach(element => {
        observer.observe(element);
    });

    // Animate Metrics
    function animateValue(element, start, end, duration) {
        let current = start;
        const increment = (end - start) / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (
                (increment > 0 && current >= end) || 
                (increment < 0 && current <= end)
            ) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = end % 1 === 0 ? 
                Math.round(current) : 
                current.toFixed(1);
        }, 16);
    }

    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (!element.classList.contains('animated')) {
                    const value = parseFloat(element.textContent);
                    animateValue(element, 0, value, 2000);
                    element.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe metrics
    document.querySelectorAll('.metric-value').forEach(metric => {
        metricObserver.observe(metric);
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Service Header Toggle
    document.querySelectorAll('.service-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.parentElement;
            card.classList.toggle('active');
        });
    });

    // Mobile Menu Handler
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-toggle')) {
            mobileMenuBtn?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Fix for nav flickering
    let lastScrollNav = 0;
    const scrollThresholdNav = 10;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (Math.abs(currentScroll - lastScrollNav) < scrollThreshold) return;

        if (currentScroll > lastScrollNav && currentScroll > header.offsetHeight) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        }

        lastScrollNav = currentScroll;
    }, { passive: true });
});

// Prevent Flash of Unstyled Content
document.documentElement.classList.add('loaded');

let lastScrollTop = 0;
const header = document.querySelector('.header');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollTop > lastScrollTop) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            if (currentScrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = currentScrollTop;
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });