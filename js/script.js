document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky Navigation Shadow on Scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = 'var(--shadow-md)';
                navbar.classList.add('scrolled');
            } else {
                navbar.style.boxShadow = 'none';
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksA = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navLinksA.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside (optional but good UX)
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or doesn't exist on page
            if (href === '#' || !document.querySelector(href)) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            
            window.scrollTo({
                top: targetElement.offsetTop - navbarHeight - 20,
                behavior: 'smooth'
            });
        });
    });

    // FAQ Accordion Toggles
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });

    // Simple stagger animation for hero elements on load
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-wrapper');
    
    if (heroContent && heroImage) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        heroContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(20px) perspective(1000px) rotateY(-5deg)';
        heroImage.style.transition = 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateY(0) perspective(1000px) rotateY(-5deg)';
        }, 100);
    }

    // Interactive Video Demo Modal Logic
    const watchDemoBtn = document.getElementById('watchDemoBtn');
    const demoModal = document.getElementById('demoModal');
    const closeDemoBtn = document.getElementById('closeDemoBtn');
    const demoVideo = document.getElementById('demoVideo');

    if (watchDemoBtn && demoModal) {
        watchDemoBtn.addEventListener('click', () => {
            demoModal.classList.add('active');
            document.body.classList.add('no-scroll');
            if (demoVideo) {
                // Autoplay if it's an iframe (YouTube) or video tag
                if(demoVideo.tagName.toLowerCase() === 'video') {
                    demoVideo.play();
                } else if(demoVideo.tagName.toLowerCase() === 'iframe') {
                    let src = demoVideo.src;
                    if(src.indexOf('autoplay=1') === -1) {
                        demoVideo.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1';
                    }
                }
            }
        });

        const closeDemo = () => {
            demoModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Stop video
            if (demoVideo) {
                if(demoVideo.tagName.toLowerCase() === 'video') {
                    demoVideo.pause();
                    demoVideo.currentTime = 0;
                } else if(demoVideo.tagName.toLowerCase() === 'iframe') {
                    let src = demoVideo.src;
                    demoVideo.src = src.replace('&autoplay=1', '').replace('?autoplay=1', '');
                }
            }
        };

        if (closeDemoBtn) closeDemoBtn.addEventListener('click', closeDemo);
        demoModal.querySelector('.demo-modal-overlay').addEventListener('click', closeDemo);
    }

    // ==========================================
    // Modals Initialization (Global Function)
    // ==========================================
    window.initModals = function() {
        // --- New Modals Logic (Contact & Chat) ---
        const contactModal = document.getElementById('contactModal');
        const chatModal = document.getElementById('chatModal');
        const openContactBtn = document.getElementById('openContactBtn');
        const openChatBtnFooter = document.getElementById('openChatBtnFooter');
        const fabBtn = document.getElementById('fabBtn');
        
        const closeContactBtn = document.getElementById('closeContactBtn');
        const closeChatBtn = document.getElementById('closeChatBtn');
        
        const contactForm = document.getElementById('contactForm');
        const contactSuccess = document.getElementById('contactSuccess');
        
        const chatForm = document.getElementById('chatForm');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');

        const openModal = (modal) => {
            if (!modal) return;
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        };

        const closeModal = (modal) => {
            if (!modal) return;
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Reset contact form if it was a success state
            if (modal === contactModal && contactForm && contactSuccess) {
                setTimeout(() => {
                    contactForm.style.display = 'block';
                    contactSuccess.style.display = 'none';
                    contactForm.reset();
                }, 300);
            }
        };

        // Open Listeners
        if (openContactBtn) openContactBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(contactModal); });
        if (openChatBtnFooter) openChatBtnFooter.addEventListener('click', (e) => { e.preventDefault(); openModal(chatModal); });
        if (fabBtn) fabBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(chatModal); });

        // Close Listeners
        if (closeContactBtn) closeContactBtn.addEventListener('click', () => closeModal(contactModal));
        if (closeChatBtn) closeChatBtn.addEventListener('click', () => closeModal(chatModal));
        
        [contactModal, chatModal].forEach(modal => {
            if (modal) {
                const overlay = modal.querySelector('.demo-modal-overlay');
                if (overlay) overlay.addEventListener('click', () => closeModal(modal));
            }
        });

        // Form Handling
        if (contactForm && contactSuccess) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                contactForm.style.display = 'none';
                contactSuccess.style.display = 'block';
                console.log('Contact form submitted');
            });
        }

        if (chatForm && chatInput && chatMessages) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const message = chatInput.value.trim();
                if (message) {
                    // Add user message
                    const userMsg = document.createElement('div');
                    userMsg.style.cssText = 'align-self: flex-end; max-width: 80%; background: var(--color-primary); color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: 16px 16px 0 16px; font-size: 0.95rem;';
                    userMsg.textContent = message;
                    chatMessages.appendChild(userMsg);
                    
                    chatInput.value = '';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Add automated reply
                    setTimeout(() => {
                        const reply = document.createElement('div');
                        reply.style.cssText = 'align-self: flex-start; max-width: 80%; background: #f3f4f6; padding: var(--spacing-sm) var(--spacing-md); border-radius: 0 16px 16px 16px; font-size: 0.95rem;';
                        reply.textContent = "Thanks for your message! One of our agents will be with you shortly.";
                        chatMessages.appendChild(reply);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1000);
                }
            });
        }
    };

    // Initialize if they exist locally already
    // Initialize if they exist locally already
    window.initModals();

    // --- Use Case Interactivity Implementation ---
    const useCaseConfig = {
        'lead-generation': {
            title: "Leads",
            badge: "Easily Extracts Leads",
            learnUrl: "solutions/lead-generation.html",
            headers: ["Name", "Company", "Email"],
            rows: [
                ["Alex Rivera", "CloudScale Inc", "alex@cloudscale.io"],
                ["Jessica Wong", "GreenLeaf Media", "jess@greenleaf.com"],
                ["David Miller", "Urban Logistics", "d.miller@urbanlog.co"]
            ]
        },
        'price-monitoring': {
            title: "Products",
            badge: "Tracks Prices Daily",
            learnUrl: "solutions/price-monitoring.html",
            headers: ["Product Name", "Current Price", "Availability"],
            rows: [
                ['Wireless Headphones', '$129.99', 'In Stock'],
                ['Smart Watch S3', '$249.00', 'Low Stock'],
                ['4K Monitor 27"', '$349.50', 'Out of Stock']
            ]
        },
        'competitor-research': {
            title: "Competitors",
            badge: "Monitors Site Changes",
            learnUrl: "solutions/competitor-research.html",
            headers: ["Company", "Feature Update", "Date Found"],
            rows: [
                ["Competitor A", "New AI Dashboard", "2 hrs ago"],
                ["Competitor B", "Revised Pricing", "Yesterday"],
                ["Competitor C", "Public Roadmap", "3 days ago"]
            ]
        },
        'market-intelligence': {
            title: "Trends",
            badge: "Deep Market Insights",
            learnUrl: "solutions/market-intelligence.html",
            headers: ["Sector", "Market Sentiment", "Growth Trend"],
            rows: [
                ["Fintech", "Highly Bullish", "+12.5%"],
                ["E-learning", "Stable", "+4.2%"],
                ["Renewables", "Growing Rapidly", "+22.1%"]
            ]
        },
        'academic-research': {
            title: "Papers",
            badge: "Organizes Publications",
            headers: ["Publication Title", "Authors", "Citations"],
            rows: [
                ["Neural Networks 2026", "Dr. Alan T.", "1,240"],
                ["Climate Impact Report", "Green, L. et al", "350"],
                ["Quantum Computing Rev.", "S. Hawking (Legacy)", "8,400"]
            ]
        },
        'real-estate': {
            title: "Listings",
            badge: "Tracks Property Values",
            headers: ["Property Type", "Location", "Listing Price"],
            rows: [
                ["3BR Apartment", "New York, NY", "$1.2M"],
                ["Single Family Home", "Austin, TX", "$540k"],
                ["Modern Studio", "Seattle, WA", "$3,200/mo"]
            ]
        },
        'financial-data': {
            title: "Stocks",
            badge: "Real-time Data Ready",
            headers: ["Ticker", "Value", "Daily Change"],
            rows: [
                ["$EXTR", "$45.20", "+2.5%"],
                ["$TECH", "$128.10", "-0.8%"],
                ["$DATA", "$12.45", "+5.4%"]
            ]
        }
    };

    const useCaseCards = document.querySelectorAll('.solution-card');
    const useCaseThead = document.getElementById('useCaseThead');
    const useCaseTbody = document.getElementById('useCaseTbody');
    const useCaseBadge = document.getElementById('useCaseBadge');
    const useCaseStartBtn = document.getElementById('useCaseStartBtn');

    if (useCaseTbody) {
        useCaseCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // If they clicked the link specifically, let it navigate
                if (e.target.closest('.learn-more-link')) return;

                const category = card.getAttribute('data-use-case');
                const config = useCaseConfig[category];
                
                if (!config) return;

                // Update Active State
                useCaseCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Update Badge & Buttons
                useCaseBadge.innerHTML = `<i data-lucide="sparkles" style="width: 16px; height: 16px;"></i> ${config.badge}`;
                useCaseStartBtn.textContent = `Start Extracting ${config.title}`;
                
                // Refresh Lucide Icons (badge icon)
                if (window.lucide) window.lucide.createIcons();

                // Update Table Header with premium styling
                useCaseThead.innerHTML = `<tr>${config.headers.map(h => `<th style="padding: 12px; font-weight: 600;">${h}</th>`).join('')}</tr>`;

                // Update Table Body with fade effect
                useCaseTbody.style.opacity = '0';
                setTimeout(() => {
                    useCaseTbody.innerHTML = config.rows.map((row, idx) => `
                        <tr style="border-bottom: ${idx === config.rows.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)'};">
                            ${row.map((cell, cidx) => `<td style="padding: 12px; ${cidx === 2 ? 'color: #4f46e5; font-weight: 500;' : ''}">${cell}</td>`).join('')}
                        </tr>
                    `).join('');
                    useCaseTbody.style.transition = 'opacity 0.3s ease';
                    useCaseTbody.style.opacity = '1';
                }, 150);
            });
        });
    }
});
