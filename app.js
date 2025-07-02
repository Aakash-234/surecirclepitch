// Pitch Deck Interactive JavaScript
class PitchDeck {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 13;
        this.slides = document.querySelectorAll('.slide');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentSlideElement = document.getElementById('currentSlide');
        this.totalSlidesElement = document.getElementById('totalSlides');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.animatedElements = new Set();
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavigationButtons();
        this.animateCurrentSlide();
        
        // Add touch support for mobile
        this.setupTouchEvents();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return; // Prevent multiple rapid transitions
            
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        // Mouse wheel navigation with throttling
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;
            
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }, 150);
        }, { passive: true });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only trigger if horizontal swipe is dominant
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides && !this.isTransitioning) {
            this.isTransitioning = true;
            
            // Clear all transition classes first
            this.slides.forEach(slide => {
                slide.classList.remove('active', 'prev', 'next');
            });
            
            // Set current slide to prev/next based on direction
            const direction = slideIndex > this.currentSlide ? 'prev' : 'next';
            this.slides[this.currentSlide].classList.add(direction);
            
            // Update current slide index
            this.currentSlide = slideIndex;
            
            // Set new slide as active after a brief delay to ensure clean transition
            setTimeout(() => {
                this.slides[this.currentSlide].classList.add('active');
                
                // Update UI
                this.updateSlideCounter();
                this.updateProgressBar();
                this.updateNavigationButtons();
                
                // Clean up after transition completes
                setTimeout(() => {
                    this.slides.forEach(slide => {
                        if (!slide.classList.contains('active')) {
                            slide.classList.remove('prev', 'next');
                        }
                    });
                    this.isTransitioning = false;
                    
                    // Animate elements in new slide
                    this.animateCurrentSlide();
                }, 600);
            }, 50);
        }
    }
    
    updateSlideCounter() {
        this.currentSlideElement.textContent = this.currentSlide + 1;
        this.totalSlidesElement.textContent = this.totalSlides;
    }
    
    updateProgressBar() {
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
    
    animateCurrentSlide() {
        const currentSlideElement = this.slides[this.currentSlide];
        const slideId = currentSlideElement.id;
        
        // Reset animated elements for current slide
        this.animatedElements.clear();
        
        // Animate counters
        this.animateCounters(currentSlideElement);
        
        // Slide-specific animations
        switch(slideId) {
            case 'slide-1':
                this.animateHeroSlide();
                break;
            case 'slide-2':
                this.animateProblemCards();
                break;
            case 'slide-5':
                this.animateProcessFlow();
                break;
            case 'slide-6':
                this.animateMockups();
                break;
            case 'slide-8':
                this.animateBusinessModel();
                break;
            case 'slide-12':
                this.animateProjectionBars();
                break;
            case 'slide-13':
                this.animateFundingBars();
                break;
        }
    }
    
    animateCounters(container) {
        const counters = container.querySelectorAll('[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number based on context
                let displayValue = Math.floor(current);
                const originalText = counter.textContent;
                
                if (originalText.includes('₹')) {
                    displayValue = `₹${displayValue}`;
                } else if (originalText.includes('$')) {
                    displayValue = `$${displayValue}`;
                } else if (originalText.includes('K')) {
                    displayValue = `${displayValue}K`;
                } else if (originalText.includes('Cr')) {
                    displayValue = `₹${displayValue}`;
                }
                
                counter.textContent = displayValue;
            }, 16);
            
            this.animatedElements.add(counter);
        });
    }
    
    animateHeroSlide() {
        const stats = document.querySelectorAll('#slide-1 .stat');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.animation = 'fadeInUp 0.8s ease forwards';
            }, index * 200);
        });
    }
    
    animateProblemCards() {
        const cards = document.querySelectorAll('#slide-2 .problem-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 200);
        });
    }
    
    animateProcessFlow() {
        const steps = document.querySelectorAll('#slide-5 .process-step');
        const arrows = document.querySelectorAll('#slide-5 .process-arrow');
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('animate-in');
            }, index * 300);
        });
        
        arrows.forEach((arrow, index) => {
            setTimeout(() => {
                arrow.classList.add('animate-arrow');
            }, (index + 1) * 300 + 150);
        });
    }
    
    animateMockups() {
        const mockups = document.querySelectorAll('#slide-6 .phone-mockup');
        mockups.forEach((mockup, index) => {
            setTimeout(() => {
                mockup.style.opacity = '1';
                mockup.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    animateBusinessModel() {
        const streams = document.querySelectorAll('#slide-8 .stream');
        streams.forEach((stream, index) => {
            setTimeout(() => {
                stream.style.opacity = '1';
                stream.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    animateProjectionBars() {
        const bars = document.querySelectorAll('#slide-12 .bar');
        const heights = ['20%', '35%', '60%', '80%', '100%'];
        
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.height = heights[index];
            }, index * 200);
        });
    }
    
    animateFundingBars() {
        const bars = document.querySelectorAll('#slide-13 .allocation-bar');
        const widths = ['40%', '30%', '20%', '10%'];
        
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = widths[index];
            }, index * 200);
        });
    }
    
    // Auto-advance mode (optional feature)
    startAutoAdvance(interval = 10000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.stopAutoAdvance();
            }
        }, interval);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
    
    // Add presentation mode
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Enhanced animations and effects
class AnimationEffects {
    static addParallaxEffect() {
        let ticking = false;
        
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const cards = document.querySelectorAll('.card, .problem-card, .feature, .value-card');
                    const mouseX = e.clientX / window.innerWidth;
                    const mouseY = e.clientY / window.innerHeight;
                    
                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const cardX = (rect.left + rect.width / 2) / window.innerWidth;
                        const cardY = (rect.top + rect.height / 2) / window.innerHeight;
                        
                        const deltaX = (mouseX - cardX) * 5;
                        const deltaY = (mouseY - cardY) * 5;
                        
                        card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                    });
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
    }
    
    static addHoverEffects() {
        // Enhanced hover effects for interactive elements
        const hoverElements = document.querySelectorAll('.btn, .nav-btn, .action-btn, .vote-btn');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.transition = 'all 0.3s ease';
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'scale(1)';
            });
        });
    }
    
    static addRippleEffect() {
        const buttons = document.querySelectorAll('button, .card');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple animation to CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    static addFloatingAnimation() {
        const floatingElements = document.querySelectorAll('.hero-badge');
        
        floatingElements.forEach((element, index) => {
            element.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
        });
        
        // Add floating animation to CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility functions
class Utils {
    static formatCurrency(amount, currency = '₹') {
        if (amount >= 10000000) { // 1 crore
            return `${currency}${(amount / 10000000).toFixed(1)}Cr`;
        } else if (amount >= 100000) { // 1 lakh
            return `${currency}${(amount / 100000).toFixed(1)}L`;
        } else if (amount >= 1000) {
            return `${currency}${(amount / 1000).toFixed(1)}K`;
        }
        return `${currency}${amount}`;
    }
    
    static throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Performance monitoring
class PerformanceMonitor {
    static init() {
        // Monitor animation performance
        let frameCount = 0;
        let lastTime = performance.now();
        
        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                if (fps < 30) {
                    console.warn('Low FPS detected:', fps);
                    // Reduce animation complexity if needed
                    document.body.classList.add('reduced-motion');
                }
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    static logPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
}

// Accessibility features
class AccessibilityEnhancer {
    static init() {
        // Add focus management
        this.manageFocus();
        
        // Add keyboard shortcuts help
        this.addKeyboardHelp();
        
        // Respect reduced motion preferences
        this.respectMotionPreferences();
    }
    
    static manageFocus() {
        // Ensure proper focus management during slide transitions
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = document.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const currentSlide = document.querySelector('.slide.active');
                const slideFocusableElements = Array.from(focusableElements)
                    .filter(el => currentSlide.contains(el));
                
                if (slideFocusableElements.length === 0) {
                    e.preventDefault();
                }
            }
        });
    }
    
    static addKeyboardHelp() {
        // Add keyboard shortcuts overlay
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
                e.preventDefault();
                this.showKeyboardHelp();
            }
        });
    }
    
    static showKeyboardHelp() {
        // Remove existing help overlay if present
        const existingOverlay = document.querySelector('.keyboard-help-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
            return;
        }
        
        const helpOverlay = document.createElement('div');
        helpOverlay.className = 'keyboard-help-overlay';
        helpOverlay.innerHTML = `
            <div class="keyboard-help-content">
                <h3>Keyboard Shortcuts</h3>
                <ul>
                    <li><kbd>→</kbd> or <kbd>Space</kbd> - Next slide</li>
                    <li><kbd>←</kbd> - Previous slide</li>
                    <li><kbd>Home</kbd> - First slide</li>
                    <li><kbd>End</kbd> - Last slide</li>
                    <li><kbd>F</kbd> - Toggle fullscreen</li>
                    <li><kbd>A</kbd> - Toggle auto-advance</li>
                    <li><kbd>Esc</kbd> - Close this help</li>
                </ul>
                <button class="close-help">Close</button>
            </div>
        `;
        
        document.body.appendChild(helpOverlay);
        
        // Close help overlay
        const closeHelp = () => {
            helpOverlay.remove();
        };
        
        helpOverlay.querySelector('.close-help').addEventListener('click', closeHelp);
        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                closeHelp();
            }
        });
        
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeHelp();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    static respectMotionPreferences() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading Sure Circle Presentation...</p>
        </div>
    `;
    
    // Add loading and help styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a4e66 0%, #2563eb 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
        }
        
        .loading-spinner {
            text-align: center;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .keyboard-help-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .keyboard-help-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 400px;
            text-align: center;
        }
        
        .keyboard-help-content h3 {
            margin-bottom: 20px;
            color: var(--electric-blue);
        }
        
        .keyboard-help-content ul {
            list-style: none;
            padding: 0;
            margin: 0 0 20px 0;
        }
        
        .keyboard-help-content li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .keyboard-help-content kbd {
            background: #f5f5f5;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            border: 1px solid #ccc;
        }
        
        .close-help {
            background: var(--electric-blue);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
        }
        
        /* Reduced motion styles */
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    
    document.head.appendChild(loadingStyles);
    document.body.appendChild(loader);
    
    // Initialize main pitch deck functionality
    const pitchDeck = new PitchDeck();
    
    // Add enhanced animations and effects
    AnimationEffects.addHoverEffects();
    AnimationEffects.addRippleEffect();
    AnimationEffects.addFloatingAnimation();
    
    // Initialize accessibility features
    AccessibilityEnhancer.init();
    
    // Initialize performance monitoring
    PerformanceMonitor.init();
    PerformanceMonitor.logPageLoad();
    
    // Add presentation controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            pitchDeck.toggleFullscreen();
        }
        
        if (e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            if (pitchDeck.autoAdvanceInterval) {
                pitchDeck.stopAutoAdvance();
                console.log('Auto-advance stopped');
            } else {
                pitchDeck.startAutoAdvance(8000); // 8 seconds per slide
                console.log('Auto-advance started');
            }
        }
    });
    
    // Remove loader after everything is ready
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
    
    // Add console welcome message
    console.log(`
    🚀 Sure Circle Pitch Deck
    ========================
    
    Keyboard Shortcuts:
    → or Space: Next slide
    ← : Previous slide
    F: Toggle fullscreen
    A: Toggle auto-advance
    ?: Show help
    
    Built with ❤️ for revolutionizing insurance in India
    `);
});
