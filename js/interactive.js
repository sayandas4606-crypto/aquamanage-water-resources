/**
 * Water Resources and Management - Interactive Features Module
 * 1. Interactive Tabs Navigation
 * 2. Daily Water Saving Challenges Tracker
 * 3. Academic Water Quiz with Scoring & Explanations
 * 4. Filterable Media Gallery & Fullscreen Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
    initInteractiveTabs();
    initDailyChallenges();
    initWaterQuiz();
    initGalleryFilterAndLightbox();
});

/* --------------------------------------------------------------------------
   1. INTERACTIVE TABS NAVIGATION
   -------------------------------------------------------------------------- */
function initInteractiveTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/* --------------------------------------------------------------------------
   2. DAILY WATER SAVING CHALLENGES TRACKER
   -------------------------------------------------------------------------- */
function initDailyChallenges() {
    const challengeCards = document.querySelectorAll('.challenge-card');
    const totalSavedDisplay = document.getElementById('totalSavedLiters');
    const resetChallengesBtn = document.getElementById('resetChallengesBtn');

    // Load saved states from localStorage
    const savedState = JSON.parse(localStorage.getItem('water_challenges_state') || '{}');

    function calculateTotalSaved() {
        let totalLiters = 0;
        challengeCards.forEach(card => {
            const id = card.getAttribute('data-challenge-id');
            const liters = parseInt(card.getAttribute('data-liters')) || 0;
            const isCompleted = card.classList.contains('completed');

            if (isCompleted) {
                totalLiters += liters;
            }
        });

        if (totalSavedDisplay) {
            totalSavedDisplay.textContent = totalLiters.toLocaleString();
        }

        return totalLiters;
    }

    challengeCards.forEach(card => {
        const id = card.getAttribute('data-challenge-id');
        
        // Restore previous selection
        if (savedState[id]) {
            card.classList.add('completed');
            const icon = card.querySelector('.challenge-checkbox i');
            if (icon) icon.className = 'fas fa-check';
        }

        card.addEventListener('click', () => {
            card.classList.toggle('completed');
            const isNowCompleted = card.classList.contains('completed');
            savedState[id] = isNowCompleted;
            localStorage.setItem('water_challenges_state', JSON.stringify(savedState));

            const icon = card.querySelector('.challenge-checkbox i');
            if (icon) {
                icon.className = isNowCompleted ? 'fas fa-check' : '';
            }

            const currentTotal = calculateTotalSaved();
            if (currentTotal >= 100 && isNowCompleted) {
                triggerMiniCelebration();
            }
        });
    });

    calculateTotalSaved();

    if (resetChallengesBtn) {
        resetChallengesBtn.addEventListener('click', () => {
            localStorage.removeItem('water_challenges_state');
            challengeCards.forEach(card => {
                card.classList.remove('completed');
                const icon = card.querySelector('.challenge-checkbox i');
                if (icon) icon.className = '';
            });
            calculateTotalSaved();
        });
    }

    function triggerMiniCelebration() {
        const badge = document.querySelector('.challenges-summary-badge');
        if (badge) {
            badge.style.transform = 'scale(1.1)';
            badge.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

/* --------------------------------------------------------------------------
   3. ACADEMIC WATER QUIZ ENGINE
   -------------------------------------------------------------------------- */
function initWaterQuiz() {
    const quizData = [
        {
            q: "What percentage of the Earth's total water is available as accessible liquid freshwater for human ecosystems?",
            options: [
                "About 10%",
                "Less than 1% (approx. 0.5% - 0.77%)",
                "Around 2.5%",
                "Nearly 5%"
            ],
            correct: 1,
            explanation: "While 71% of Earth is water, 97.5% is saline ocean water and nearly 2% is locked in polar ice caps and glaciers. Only about 0.5% to 0.77% exists as accessible liquid surface and groundwater."
        },
        {
            q: "Which economic sector accounts for the largest proportion (approximately 70%) of global freshwater withdrawals?",
            options: [
                "Domestic and Municipal Drinking",
                "Thermal and Nuclear Power Generation",
                "Agricultural Irrigation",
                "Textile and Chemical Manufacturing"
            ],
            correct: 2,
            explanation: "According to the UN and FAO, agriculture accounts for ~70% of global freshwater withdrawals, primarily through surface irrigation, canal systems, and deep tube wells."
        },
        {
            q: "What is 'Virtual Water' (or embedded water) in environmental computer science & hydrology?",
            options: [
                "Water generated through 3D computer simulations",
                "The volume of freshwater consumed to produce a specific agricultural or industrial product",
                "Atmospheric humidity detected by remote radar satellites",
                "Synthetic water produced during hydrogen fuel cell combustion"
            ],
            correct: 1,
            explanation: "Virtual water is the hidden volume of water consumed across the entire supply chain to produce goods, food, or energy (e.g., ~15,000 liters of water are needed to produce 1 kg of beef)."
        },
        {
            q: "Which precision irrigation technique reduces water consumption by up to 50-70% compared to conventional flood irrigation?",
            options: [
                "Drip (Trickle) Irrigation",
                "Furrow Canal Irrigation",
                "Uncontrolled Basin Flooding",
                "Overhead High-Pressure Gun Sprinklers"
            ],
            correct: 0,
            explanation: "Drip irrigation delivers water directly to the plant root zone drop-by-drop through emitters, eliminating runoff, deep percolation, and evaporative losses."
        },
        {
            q: "Which technology is commonly employed in modern zero-liquid-discharge (ZLD) plants to recover potable water from industrial wastewater?",
            options: [
                "Simple Gravity Clarification only",
                "Reverse Osmosis (RO) combined with Multi-Effect Evaporation (MEE)",
                "Chemical Coagulation with Alum only",
                "Single-Stage Sand Filtration"
            ],
            correct: 1,
            explanation: "ZLD engineering combines high-recovery Reverse Osmosis membranes with thermal crystallizers / Multi-Effect Evaporators (MEE) to achieve 95-99% water recovery, leaving only solid salts."
        }
    ];

    let currentQIndex = 0;
    let score = 0;
    let answered = false;

    const qNumEl = document.getElementById('quizQNum');
    const questionEl = document.getElementById('quizQuestion');
    const optionsContainer = document.getElementById('quizOptionsContainer');
    const explanationEl = document.getElementById('quizExplanation');
    const nextBtn = document.getElementById('quizNextBtn');
    const scoreBox = document.getElementById('quizScoreBox');
    const quizCard = document.getElementById('quizCardContent');

    if (!questionEl || !optionsContainer) return;

    function renderQuestion(index) {
        answered = false;
        const qObj = quizData[index];
        if (qNumEl) qNumEl.textContent = `Question ${index + 1} of ${quizData.length}`;
        questionEl.textContent = qObj.q;
        optionsContainer.innerHTML = '';
        if (explanationEl) explanationEl.style.display = 'none';
        if (nextBtn) {
            nextBtn.style.display = 'none';
            nextBtn.textContent = (index === quizData.length - 1) ? 'View Final Score' : 'Next Question';
        }

        qObj.options.forEach((optText, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.innerHTML = `<span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--aqua-primary); margin-right: 8px;">${String.fromCharCode(65 + optIdx)}.</span> ${optText}`;
            
            btn.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                const allButtons = optionsContainer.querySelectorAll('.quiz-opt-btn');

                if (optIdx === qObj.correct) {
                    btn.classList.add('correct');
                    score++;
                } else {
                    btn.classList.add('wrong');
                    // Highlight correct answer
                    allButtons[qObj.correct].classList.add('correct');
                }

                if (explanationEl) {
                    explanationEl.style.display = 'block';
                    explanationEl.innerHTML = `<strong>Explanation:</strong> ${qObj.explanation}`;
                }

                if (nextBtn) nextBtn.style.display = 'inline-flex';
            });

            optionsContainer.appendChild(btn);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentQIndex < quizData.length - 1) {
                currentQIndex++;
                renderQuestion(currentQIndex);
            } else {
                showQuizResults();
            }
        });
    }

    function showQuizResults() {
        if (quizCard) quizCard.style.display = 'none';
        if (scoreBox) {
            scoreBox.style.display = 'block';
            const percentage = Math.round((score / quizData.length) * 100);
            scoreBox.innerHTML = `
                <div style="text-align: center; padding: 2rem 1rem;">
                    <div style="font-size: 3.5rem; margin-bottom: 1rem; color: var(--aqua-primary);">
                        <i class="fas fa-award"></i>
                    </div>
                    <h3 style="font-size: 2rem; margin-bottom: 0.5rem;">Quiz Completed!</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">You scored <strong>${score} out of ${quizData.length}</strong> (${percentage}%)</p>
                    <div style="margin-bottom: 2rem;">
                        <span class="calc-grade-badge ${percentage >= 80 ? 'grade-excellent' : (percentage >= 60 ? 'grade-moderate' : 'grade-high')}">
                            ${percentage >= 80 ? '🌟 Water Resource Expert' : (percentage >= 60 ? '💧 Environmental Enthusiast' : '📚 Student Learner')}
                        </span>
                    </div>
                    <button id="restartQuizBtn" class="btn btn-primary">
                        <i class="fas fa-redo"></i> Retake Water Quiz
                    </button>
                </div>
            `;

            const restartBtn = document.getElementById('restartQuizBtn');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    currentQIndex = 0;
                    score = 0;
                    scoreBox.style.display = 'none';
                    if (quizCard) quizCard.style.display = 'block';
                    renderQuestion(0);
                });
            }
        }
    }

    // Initial question load
    renderQuestion(0);
}

/* --------------------------------------------------------------------------
   4. FILTERABLE MEDIA GALLERY & LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryFilterAndLightbox() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('galleryLightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxCloseBtn');

    // Filtering logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox modal logic
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-item-title');
            const desc = item.getAttribute('data-description') || 'Educational Water Resource Photography';

            if (lightboxModal && lightboxImg && img) {
                lightboxImg.src = img.src;
                if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
                if (lightboxDesc) lightboxDesc.textContent = desc;

                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
}
