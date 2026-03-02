document.addEventListener('DOMContentLoaded', () => {
    // ---- SPA Navigation Logic ----
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    function switchView(viewId) {
        // Hide all views
        viewSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all nav items
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Highlight active nav item
        const targetNav = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if (targetNav) {
            targetNav.classList.add('active');
        }

        // Update URL hash for deep linking (optional, makes it feel more real)
        window.location.hash = viewId;
    }

    // Add click listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if(target) {
                switchView(target);
            }
        });
    });

    // Handle global click events for generic buttons
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn') || e.target.closest('a');
        if (!btn) return;

        const text = btn.textContent.trim();
        const icon = btn.querySelector('i');
        const isAnchor = btn.tagName.toLowerCase() === 'a';

        // Internal routing
        if (text.includes('New Scrape') || text.includes('New Project')) {
            switchView('view-new-scraper');
            if(isAnchor) e.preventDefault();
            return;
        } else if (text === 'View All' || text === 'View All Invoices') {
            if(text === 'View All') switchView('view-projects');
            if(text === 'View All Invoices') switchView('view-billing');
            if(isAnchor) e.preventDefault();
            return;
        } else if (text.includes('Settings') && icon && icon.classList.contains('ph-gear')) {
             switchView('view-settings');
             if(isAnchor) e.preventDefault();
             return;
        } else if (icon && icon.classList.contains('ph-table') && !text.includes('Export')) {
             switchView('view-data-tables');
             if(isAnchor) e.preventDefault();
             return;
        }

        // Handle action buttons with no specific functionality yet
        if (btn.classList.contains('btn-secondary') || btn.classList.contains('btn-primary')) {
            
            // Skip wizard navigation buttons, download buttons which might have their own logic
            if (btn.hasAttribute('onclick') || text.includes('Next') || text.includes('Previous') || text.includes('Back') || text.includes('Good')) {
                return;
            }

            if (text === 'Save Changes') {
                showToast('Settings saved successfully!', 'success');
            } else if (text.includes('Generate New Key')) {
                showToast('New API Key generated: ext_test_' + Math.random().toString(36).substring(2, 8), 'success');
            } else if (text.includes('Invite')) {
                showToast('Invitation sent successfully!', 'success');
            } else if (text.includes('Export') || text.includes('Download')) {
                showToast('Download started...', 'info');
            } else if (text === 'Cancel') {
                if(confirm("Are you sure you want to cancel your plan?")) {
                    showToast('Plan cancellation requested.', 'info');
                }
            } else if (text === 'Remove') {
                if(confirm("Are you sure you want to remove this user?")) {
                    const row = btn.closest('tr');
                    if(row) {
                        row.style.display = 'none';
                        showToast('User removed from project.', 'success');
                    }
                }
            } else if (text === 'Connect') {
                 showToast('Integration connected!', 'success');
                 btn.textContent = 'Connected';
                 btn.classList.remove('btn-secondary');
                 btn.classList.add('btn-primary');
            } else if (!btn.hasAttribute('disabled')) {
                // Generic feedback for other buttons
                showToast(`Action triggered: ${text}`, 'info');
            }
        }
        
        // Handling specific icon clicks like "Play", "Stop", "Trash" on action rows
        if(e.target.closest('.icon-btn')) {
            const iconBtn = e.target.closest('.icon-btn');
            const icon = iconBtn.querySelector('i');
            
            if(icon && icon.classList.contains('ph-play')) {
                showToast('Project started.', 'success');
            } else if (icon && icon.classList.contains('ph-stop')) {
                showToast('Project stopped.', 'warning');
            } else if (icon && icon.classList.contains('ph-trash')) {
                if(confirm('Are you sure you want to delete this row?')) {
                    const row = iconBtn.closest('tr');
                    if(row) {
                        row.style.display = 'none';
                        showToast('Row deleted.', 'info');
                    }
                }
            } else if (icon && icon.classList.contains('ph-copy')) {
                 showToast('Copied to clipboard!', 'success');
            }
        }
    });

    // Handle inputs like search
    document.body.addEventListener('keypress', (e) => {
        if(e.key === 'Enter' && e.target.tagName.toLowerCase() === 'input') {
            const val = e.target.value.trim();
            if(val) {
                showToast(`Searching for: ${val}`, 'info');
            }
        }
    });

    // Toast Notification System
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const icons = { 'success': 'ph-check-circle', 'warning': 'ph-warning-circle', 'danger': 'ph-warning', 'info': 'ph-info' };
        const colors = { 'success': 'var(--success-color)', 'warning': 'var(--warning-color)', 'danger': 'var(--danger-color)', 'info': 'var(--primary-color)' };
        
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '12px';
        toast.style.padding = '14px 24px';
        toast.style.borderRadius = '12px';
        toast.style.color = 'white';
        toast.style.fontWeight = '500';
        toast.style.fontFamily = 'var(--font-sans)';
        toast.style.zIndex = '9999';
        toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        toast.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.backgroundColor = colors[type];
        
        toast.innerHTML = `<i class="ph ${icons[type]}" style="font-size: 1.25rem;"></i><span>${message}</span>`;
        
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 50);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 4000);
    }

    // Expose switchView to window for onclick handlers in HTML
    window.switchView = switchView;

    // Handle initial load based on hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchView(initialHash);
    } else {
        // Default view
        switchView('view-dashboard');
    }

    // ---- Dark Mode Toggle ----
    const settingsToggle = document.getElementById('dark-mode-toggle');
    const topBarMoonIcon = document.querySelector('.top-bar .ph-moon');
    const moonIconBtn = topBarMoonIcon ? topBarMoonIcon.parentElement : null;
    
    function setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        if (settingsToggle) {
            settingsToggle.checked = isDark;
        }
    }

    if (settingsToggle) {
        settingsToggle.addEventListener('change', (e) => {
            setDarkMode(e.target.checked);
        });
    }

    if (moonIconBtn) {
        moonIconBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            setDarkMode(!isDark);
        });
    }

    // ---- Mock Charts Initialization (Dashboard) ----
    if (typeof Chart !== 'undefined') {
        const ctxActivity = document.getElementById('activityChart');
        if (ctxActivity) {
            new Chart(ctxActivity, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Successful Runs',
                        data: [12, 19, 15, 25, 22, 30, 28],
                        borderColor: '#505081',
                        backgroundColor: 'rgba(80, 80, 129, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#505081',
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const ctxVolume = document.getElementById('volumeChart');
        if (ctxVolume) {
            new Chart(ctxVolume, {
                type: 'bar',
                data: {
                    labels: ['W1', 'W2', 'W3', 'W4'],
                    datasets: [{
                        label: 'Data Rows Extracted (k)',
                        data: [120, 150, 180, 250],
                        backgroundColor: '#505081',
                        hoverBackgroundColor: '#0f0e47',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [5, 5] }, ticks: { font: { family: 'Inter' } } },
                        x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } }
                    }
                }
            });
        }
    }

    // ---- New Scraper Wizard Logic ----
    let currentScraperStep = 1;
    const totalSteps = 5;
    
    window.nextScraperStep = function() {
        if (currentScraperStep === 1) {
            // Add a fake "Detecting" delay for step 1
            const btn = document.querySelector('#scraper-step-1 .btn-primary');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="ph ph-spinner-gap spin"></i> Analyzing...';
            btn.setAttribute('disabled', 'true');
            
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.removeAttribute('disabled');
                proceed();
            }, 1500);
        } else {
            proceed();
        }

        function proceed() {
            if (currentScraperStep < totalSteps) {
                document.getElementById(`scraper-step-${currentScraperStep}`).style.display = 'none';
                currentScraperStep++;
                document.getElementById(`scraper-step-${currentScraperStep}`).style.display = 'block';
                updateScraperProgress();
            }
        }
    }

    window.prevScraperStep = function() {
        if (currentScraperStep > 1) {
            document.getElementById(`scraper-step-${currentScraperStep}`).style.display = 'none';
            currentScraperStep--;
            document.getElementById(`scraper-step-${currentScraperStep}`).style.display = 'block';
            updateScraperProgress();
        }
    }

    function updateScraperProgress() {
        const steps = document.querySelectorAll('.wizard-step');
        steps.forEach((step, index) => {
            if (index + 1 < currentScraperStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === currentScraperStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
});
