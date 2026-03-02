document.addEventListener('DOMContentLoaded', () => {
    // ---- Theme Toggle (Dark Mode) ----
    const themeToggle = document.getElementById('dark-mode-switch');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply theme on load
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.checked = true;
    }
    
    // Toggle theme on switch change
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ---- Mobile Sidebar Toggle ----
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // ---- Chart.js Implementation (Placeholder for Analytics) ----
    // We'll create a simple chart to show "Data Extracted Over Time"
    
    // Let's create a canvas element dynamically if we want to add a chart later
    // For now, let's just log that the script loaded successfully
    console.log("Extractify Dashboard UI Loaded");
    
    // Add micro-interactions for buttons
    const buttons = document.querySelectorAll('.btn-action');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!this.hasAttribute('disabled')) {
                // Simple ripple effect or click indication
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
});
