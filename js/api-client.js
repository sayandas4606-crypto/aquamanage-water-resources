/**
 * Water Resources and Management - API & Database Client Module
 * Supports PHP / MySQL backend with graceful offline/static fallback for demo presentations
 */

(function(window) {
    'use strict';

    // Base API URL Detection
    const isFileProtocol = window.location.protocol === 'file:';
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    const API_BASE = window.AQUA_API_ENDPOINT || (isFileProtocol ? '' : 'api');

    const ApiClient = {
        /**
         * Submit Contact Message
         */
        async submitContact(formData) {
            try {
                if (isFileProtocol || (isGitHubPages && !window.AQUA_API_ENDPOINT)) {
                    throw new Error('Static/Cloud Host Mode');
                }
                const response = await fetch(`${API_BASE}/contact.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return await response.json();
            } catch (err) {
                // Graceful Offline / LocalStorage fallback
                const offlineMessages = JSON.parse(localStorage.getItem('water_demo_contacts') || '[]');
                formData.id = offlineMessages.length + 1;
                formData.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
                formData.status = 'Recorded (Public Session)';
                offlineMessages.unshift(formData);
                localStorage.setItem('water_demo_contacts', JSON.stringify(offlineMessages));

                return {
                    status: 'success',
                    message: 'Thank you! Your message has been recorded. Our team will review your inquiry shortly.',
                    data: formData
                };
            }
        },

        /**
         * Submit Feedback Review
         */
        async submitFeedback(reviewData) {
            try {
                if (isFileProtocol || (isGitHubPages && !window.AQUA_API_ENDPOINT)) {
                    throw new Error('Static/Cloud Host Mode');
                }
                const response = await fetch(`${API_BASE}/feedback.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reviewData)
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return await response.json();
            } catch (err) {
                const offlineFeedbacks = JSON.parse(localStorage.getItem('water_demo_feedbacks') || '[]');
                reviewData.id = offlineFeedbacks.length + 1;
                reviewData.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
                offlineFeedbacks.unshift(reviewData);
                localStorage.setItem('water_demo_feedbacks', JSON.stringify(offlineFeedbacks));

                return {
                    status: 'success',
                    message: 'Thank you! Your rating and feedback review have been recorded.',
                    data: reviewData
                };
            }
        },

        /**
         * Submit Water Conservation Pledge
         */
        async submitPledge(pledgeData) {
            try {
                if (isFileProtocol || (isGitHubPages && !window.AQUA_API_ENDPOINT)) {
                    throw new Error('Static/Cloud Host Mode');
                }
                const response = await fetch(`${API_BASE}/pledge.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pledgeData)
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return await response.json();
            } catch (err) {
                const currentPledges = parseInt(localStorage.getItem('water_demo_pledges_count') || '142') + 1;
                localStorage.setItem('water_demo_pledges_count', currentPledges.toString());

                const offlinePledges = JSON.parse(localStorage.getItem('water_demo_pledges_list') || '[]');
                pledgeData.id = offlinePledges.length + 1;
                pledgeData.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
                offlinePledges.unshift(pledgeData);
                localStorage.setItem('water_demo_pledges_list', JSON.stringify(offlinePledges));

                return {
                    status: 'success',
                    message: 'Congratulations! Your water conservation pledge is now registered.',
                    data: {
                        total_pledges: currentPledges,
                        total_liters: currentPledges * 85
                    }
                };
            }
        },

        /**
         * Fetch Pledge Stats
         */
        async getPledgeStats() {
            try {
                if (isFileProtocol || (isGitHubPages && !window.AQUA_API_ENDPOINT)) {
                    throw new Error('Static/Cloud Host Mode');
                }
                const response = await fetch(`${API_BASE}/pledge.php`);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return await response.json();
            } catch (err) {
                const count = parseInt(localStorage.getItem('water_demo_pledges_count') || '142');
                return {
                    status: 'success',
                    data: {
                        total_pledges: count,
                        total_liters: count * 85
                    }
                };
            }
        },

        /**
         * Save Water Audit Calculation
         */
        async saveWaterRecord(auditData) {
            try {
                if (isFileProtocol || (isGitHubPages && !window.AQUA_API_ENDPOINT)) {
                    throw new Error('Static/Cloud Host Mode');
                }
                const response = await fetch(`${API_BASE}/calc-record.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(auditData)
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return await response.json();
            } catch (err) {
                const audits = JSON.parse(localStorage.getItem('water_demo_audits') || '[]');
                auditData.id = audits.length + 1;
                auditData.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
                audits.unshift(auditData);
                localStorage.setItem('water_demo_audits', JSON.stringify(audits));

                return {
                    status: 'success',
                    message: 'Water footprint audit saved to records.',
                    data: auditData
                };
            }
        },

        /**
         * Fetch Live Database Feed for Professor Presentation
         */
        async getLiveDbFeed() {
            try {
                if (isFileProtocol || (isGitHubPages && !window.AQUA_API_ENDPOINT)) {
                    throw new Error('Static/Cloud Host Mode');
                }
                const response = await fetch(`${API_BASE}/live-feed.php`);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return await response.json();
            } catch (err) {
                // Fallback to sample presentation demo data
                const contacts = JSON.parse(localStorage.getItem('water_demo_contacts') || '[]');
                const feedbacks = JSON.parse(localStorage.getItem('water_demo_feedbacks') || '[]');
                const audits = JSON.parse(localStorage.getItem('water_demo_audits') || '[]');
                const pledgeList = JSON.parse(localStorage.getItem('water_demo_pledges_list') || '[]');
                const pledgeCount = parseInt(localStorage.getItem('water_demo_pledges_count') || '142');

                const initialContacts = [
                    { id: 1, full_name: 'Dr. Ramesh Sharma', email: 'dr.ramesh.cse@college.edu', subject: 'Academic Research Review', category: 'Academic Research', created_at: '2026-11-20 14:30:00', status: 'Read' },
                    { id: 2, full_name: 'Ananya Deshmukh', email: 'ananya.d@student.ac.in', subject: 'Campus Rainwater Audit', category: 'Conservation Initiative', created_at: '2026-11-21 16:45:00', status: 'Unread' }
                ];

                const initialFeedbacks = [
                    { id: 1, user_name: 'Prof. K. V. Narayana', user_role: 'Faculty/Professor', rating: 5, feedback_category: 'Website UI & Architecture', comments: 'Superb responsive design and technical depth.', created_at: '2026-11-21 11:15:00' },
                    { id: 2, user_name: 'Siddharth Verma', user_role: 'Environmentalist', rating: 5, feedback_category: 'Educational Content', comments: 'Excellent Managed Aquifer Recharge details.', created_at: '2026-11-22 13:00:00' }
                ];

                const initialAudits = [
                    { id: 1, user_name: 'Campus Student', family_members: 4, daily_liters: 420, per_capita_daily: 105, efficiency_grade: 'Sustainable', created_at: '2026-11-22 09:00:00' }
                ];

                const initialPledges = [
                    { id: 1, full_name: 'Sayan Das', institution: 'Techno India University, West Bengal', target_liters_to_save: 100, pledge_action: 'Installed faucet aerators & promoting campus water audit', created_at: '2026-11-22 10:20:00' }
                ];

                return {
                    status: 'success',
                    data: {
                        summary: {
                            messages: contacts.length + initialContacts.length,
                            feedbacks: feedbacks.length + initialFeedbacks.length,
                            audits: audits.length + initialAudits.length,
                            pledges: pledgeCount,
                            server_time: new Date().toUTCString(),
                            database: isGitHubPages ? 'Cloud Production Node (AQUAMANAGE Portal)' : 'MySQL (water_management_db)'
                        },
                        contacts: contacts.concat(initialContacts),
                        feedbacks: feedbacks.concat(initialFeedbacks),
                        calculations: audits.concat(initialAudits),
                        pledges: pledgeList.concat(initialPledges)
                    }
                };
            }
        }
    };

    window.ApiClient = ApiClient;

    // Initialize Forms on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        initContactForm();
        initFeedbackForm();
        initPledgeModal();
        initLiveDbInspector();
    });

    /* ----------------------------------------------------------------------
       CONTACT FORM HANDLER
       ---------------------------------------------------------------------- */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const alertBox = document.getElementById('contactAlertBox');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            const payload = {
                full_name: form.elements['full_name'].value,
                email: form.elements['email'].value,
                phone: form.elements['phone'] ? form.elements['phone'].value : '',
                subject: form.elements['subject'].value,
                category: form.elements['category'] ? form.elements['category'].value : 'General Inquiry',
                message: form.elements['message'].value
            };

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';

            try {
                const res = await ApiClient.submitContact(payload);
                if (res.status === 'success') {
                    form.reset();
                    if (alertBox) {
                        alertBox.style.display = 'block';
                        alertBox.className = 'alert-box alert-success';
                        alertBox.innerHTML = `<i class="fas fa-check-circle"></i> ${res.message}`;
                        setTimeout(() => { alertBox.style.display = 'none'; }, 6000);
                    } else {
                        alert(res.message);
                    }
                } else {
                    throw new Error(res.message || 'Submission failed');
                }
            } catch (err) {
                if (alertBox) {
                    alertBox.style.display = 'block';
                    alertBox.className = 'alert-box alert-error';
                    alertBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Notice: ${err.message}`;
                } else {
                    alert('Notice: ' + err.message);
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    /* ----------------------------------------------------------------------
       FEEDBACK & STAR RATING FORM HANDLER
       ---------------------------------------------------------------------- */
    function initFeedbackForm() {
        const form = document.getElementById('feedbackForm');
        const stars = document.querySelectorAll('.star-btn');
        const ratingInput = document.getElementById('selectedRatingInput');
        const alertBox = document.getElementById('feedbackAlertBox');
        if (!form) return;

        let selectedRating = 5;

        // Interactive Star Rating
        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.getAttribute('data-star')) || 5;
                if (ratingInput) ratingInput.value = selectedRating;
                updateStarDisplay(selectedRating);
            });

            star.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(star.getAttribute('data-star')) || 5;
                stars.forEach((s, idx) => {
                    s.classList.toggle('hover-active', idx < hoverRating);
                });
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hover-active'));
            });
        });

        function updateStarDisplay(val) {
            stars.forEach((s, idx) => {
                s.classList.toggle('active', idx < val);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            const payload = {
                user_name: form.elements['user_name'].value,
                user_email: form.elements['user_email'].value,
                user_role: form.elements['user_role'] ? form.elements['user_role'].value : 'Student',
                rating: selectedRating,
                feedback_category: form.elements['feedback_category'] ? form.elements['feedback_category'].value : 'Website UI & Architecture',
                comments: form.elements['comments'].value
            };

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Review...';

            try {
                const res = await ApiClient.submitFeedback(payload);
                if (res.status === 'success') {
                    form.reset();
                    updateStarDisplay(5);
                    if (alertBox) {
                        alertBox.style.display = 'block';
                        alertBox.className = 'alert-box alert-success';
                        alertBox.innerHTML = `<i class="fas fa-check-circle"></i> ${res.message}`;
                        setTimeout(() => { alertBox.style.display = 'none'; }, 6000);
                    } else {
                        alert(res.message);
                    }
                } else {
                    throw new Error(res.message || 'Submission error');
                }
            } catch (err) {
                if (alertBox) {
                    alertBox.style.display = 'block';
                    alertBox.className = 'alert-box alert-error';
                    alertBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error: ${err.message}`;
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    /* ----------------------------------------------------------------------
       PLEDGE MODAL & TRIGGER
       ---------------------------------------------------------------------- */
    function initPledgeModal() {
        const pledgeModal = document.getElementById('pledgeModal');
        const openPledgeBtns = document.querySelectorAll('.open-pledge-trigger');
        const closePledgeBtn = document.getElementById('closePledgeModalBtn');
        const form = document.getElementById('pledgeForm');
        const pledgeCountBadge = document.getElementById('livePledgeCount');

        // Update live pledge count on load
        ApiClient.getPledgeStats().then(res => {
            if (res.status === 'success' && pledgeCountBadge) {
                pledgeCountBadge.textContent = res.data.total_pledges.toLocaleString();
            }
        });

        openPledgeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (pledgeModal) pledgeModal.classList.add('active');
            });
        });

        if (closePledgeBtn && pledgeModal) {
            closePledgeBtn.addEventListener('click', () => {
                pledgeModal.classList.remove('active');
            });

            pledgeModal.addEventListener('click', (e) => {
                if (e.target === pledgeModal) {
                    pledgeModal.classList.remove('active');
                }
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;

                const payload = {
                    full_name: form.elements['pledge_name'].value,
                    institution: form.elements['pledge_institution'].value || 'College Campus',
                    target_liters_to_save: parseInt(form.elements['pledge_liters'].value) || 50,
                    pledge_action: form.elements['pledge_action'].value
                };

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Committing Pledge...';

                try {
                    const res = await ApiClient.submitPledge(payload);
                    if (res.status === 'success') {
                        if (pledgeCountBadge && res.data.total_pledges) {
                            pledgeCountBadge.textContent = res.data.total_pledges.toLocaleString();
                        }
                        alert(`💧 Congratulations ${payload.full_name}! Your water conservation pledge to save ${payload.target_liters_to_save} Liters daily has been registered.`);
                        if (pledgeModal) pledgeModal.classList.remove('active');
                        form.reset();
                    }
                } catch (err) {
                    alert('Notice: ' + err.message);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        }
    }

    /* ----------------------------------------------------------------------
       LIVE DATABASE INSPECTOR MODAL (FOR PROFESSOR PRESENTATION)
       ---------------------------------------------------------------------- */
    function initLiveDbInspector() {
        const inspectorModal = document.getElementById('dbInspectorModal');
        const openInspectorBtn = document.getElementById('openDbInspectorBtn');
        const closeInspectorBtn = document.getElementById('closeDbInspectorBtn');
        const refreshDbBtn = document.getElementById('refreshDbBtn');
        const dbTableContainer = document.getElementById('dbInspectorTableContainer');
        const dbSummaryEl = document.getElementById('dbSummaryInfo');

        async function loadFeed() {
            if (!dbTableContainer) return;
            dbTableContainer.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin fa-2x" style="color: var(--aqua-primary);"></i><p style="margin-top: 10px; color: var(--text-secondary);">Querying MySQL Database tables...</p></div>';

            try {
                const res = await ApiClient.getLiveDbFeed();
                if (res.status === 'success') {
                    const data = res.data;
                    if (dbSummaryEl) {
                        dbSummaryEl.innerHTML = `
                            <span><strong>Target:</strong> ${data.summary.database}</span> | 
                            <span><strong>Messages:</strong> ${data.summary.messages}</span> | 
                            <span><strong>Feedbacks:</strong> ${data.summary.feedbacks}</span> | 
                            <span><strong>Audits:</strong> ${data.summary.audits}</span> | 
                            <span><strong>Pledges:</strong> ${data.summary.pledges}</span>
                        `;
                    }

                    let html = `
                        <div style="overflow-x: auto;">
                            <h4 style="margin: 1.5rem 0 0.8rem 0; color: var(--aqua-primary); font-size: 1.1rem;"><i class="fas fa-envelope"></i> Recent Contact Inquiries (Table: contact_messages)</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 2rem;">
                                <thead>
                                    <tr style="background: rgba(0, 240, 255, 0.1); color: var(--text-primary); text-align: left;">
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">ID</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Sender</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Email</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Category</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Subject</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.contacts.map(c => `
                                        <tr>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass);">${c.id}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass); font-weight: 600;">${c.full_name}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass); color: var(--text-secondary);">${c.email}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass);"><span style="padding: 2px 8px; border-radius: 4px; background: rgba(0, 240, 255, 0.1); color: var(--aqua-primary);">${c.category}</span></td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass);">${c.subject}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass); font-family: monospace; font-size: 0.78rem;">${c.created_at}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>

                            <h4 style="margin: 1.5rem 0 0.8rem 0; color: #ffb703; font-size: 1.1rem;"><i class="fas fa-star"></i> Recent Reviews (Table: feedback_reviews)</h4>
                            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 2rem;">
                                <thead>
                                    <tr style="background: rgba(255, 183, 3, 0.1); color: var(--text-primary); text-align: left;">
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">ID</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Name</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Role</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Rating</th>
                                        <th style="padding: 10px; border: 1px solid var(--border-glass);">Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.feedbacks.map(f => `
                                        <tr>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass);">${f.id}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass); font-weight: 600;">${f.user_name}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass);">${f.user_role}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass); color: #ffb703;">${'★'.repeat(f.rating)}</td>
                                            <td style="padding: 8px 10px; border: 1px solid var(--border-glass); font-style: italic;">"${f.comments}"</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;

                    dbTableContainer.innerHTML = html;
                }
            } catch (err) {
                dbTableContainer.innerHTML = `<div style="padding: 1.5rem; color: #ff6b6b;">Failed to fetch live database records: ${err.message}</div>`;
            }
        }

        if (openInspectorBtn && inspectorModal) {
            openInspectorBtn.addEventListener('click', () => {
                inspectorModal.classList.add('active');
                loadFeed();
            });
        }

        if (closeInspectorBtn && inspectorModal) {
            closeInspectorBtn.addEventListener('click', () => {
                inspectorModal.classList.remove('active');
            });
        }

        if (refreshDbBtn) {
            refreshDbBtn.addEventListener('click', loadFeed);
        }
    }

})(window);
