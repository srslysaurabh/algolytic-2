document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        header.classList.add('scrolled');
        lastScroll = currentScroll;
    });

    // Dropdown Navigation
    const dropdownTabs = document.querySelectorAll('.dropdown-tab');
    dropdownTabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            // Remove active class from all tabs and content
            const parent = tab.closest('.dropdown');
            parent.querySelectorAll('.dropdown-tab').forEach(t => t.classList.remove('active'));
            parent.querySelectorAll('.dropdown-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab and content
            tab.classList.add('active');
            const targetContent = parent.querySelector(`.dropdown-content[data-content="${tab.dataset.tab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuToggle?.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Service Tab Filtering
    const serviceTabs = document.querySelectorAll('.service-tab');
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            serviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            
            serviceCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Form Submission
    const demoForm = document.getElementById('demo-form');
    demoForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = demoForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(demoForm);
            const data = Object.fromEntries(formData.entries());

            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success state
            submitBtn.textContent = 'Success!';
            demoForm.reset();

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Thank you! We will contact you soon.';
            demoForm.appendChild(successMessage);

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                successMessage.remove();
            }, 3000);

        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.textContent = 'Error! Try Again';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    // Case Studies Slider
    const sliderTrack = document.querySelector('.case-studies-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (sliderTrack) {
        sliderTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderTrack.classList.add('active');
            startX = e.pageX - sliderTrack.offsetLeft;
            scrollLeft = sliderTrack.scrollLeft;
        });

        sliderTrack.addEventListener('mouseleave', () => {
            isDown = false;
            sliderTrack.classList.remove('active');
        });

        sliderTrack.addEventListener('mouseup', () => {
            isDown = false;
            sliderTrack.classList.remove('active');
        });

        sliderTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderTrack.offsetLeft;
            const walk = (x - startX) * 2;
            sliderTrack.scrollLeft = scrollLeft - walk;
        });
    }

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-value');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const value = parseInt(entry.target.dataset.value);
                animateValue(entry.target, 0, value, 2000);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic Service Cards Loading
    const servicesContainer = document.querySelector('.services-container');
    const services = [
        {
            id: 'junction',
            category: 'junction',
            title: 'Junction Turning Counts',
            description: 'Optimize signal timings and reduce congestion through advanced junction analysis',
            features: ['Real-time monitoring', 'Peak hour analysis', 'Signal optimization', 'Congestion prediction']
        },
        {
            id: 'intersection',
            category: 'monitoring',
            title: 'Intersection Counts',
            description: 'Monitor and analyze vehicle and pedestrian movements at intersections',
            features: ['Vehicle tracking', 'Pedestrian flow', 'Safety assessment', 'Peak period analysis']
        }
        // Add more services here
    ];

    function renderServiceCards() {
        if (!servicesContainer) return;
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.dataset.category = service.category;
            
            card.innerHTML = `
                <div class="service-icon">
                    <i class="icon-${service.id}"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="#${service.id}" class="btn-text">Learn More →</a>
            `;
            
            servicesContainer.appendChild(card);
        });
    }

    renderServiceCards();

    // Add loading states for dynamic content
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
// Add intersection observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Hover effects for service cards
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Optional: Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

});