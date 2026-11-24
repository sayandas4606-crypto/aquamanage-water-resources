# Water Resources and Management (AQUAMANAGE)
### B.Tech Computer Science & Engineering — Capstone / Educational Presentation Portal
**Theme:** Ocean Blue, Electric Aqua, Clean White, Dark Navy  
**Target:** University-Level Evaluation & Public Environmental Awareness  
**Alignment:** United Nations Sustainable Development Goal (SDG) 6: Clean Water and Sanitation  

---

## 🌟 1. Project Overview

**HydroSphere: Water Resources & Management** is a full-stack, responsive, university-grade educational web portal. Built specifically for an engineering college group presentation, it combines hydrological science with modern computer science architectures:
- **Rich Hydrological Curriculum:** 12 structured academic sections covering planetary water distribution, aquifers, surface waters, precision agricultural irrigation, global crises, and conservation technologies.
- **Interactive Suite:** A real-time mathematical Water Footprint Calculator with World Health Organization (WHO) benchmarks, daily water-saving challenge tracker, academic water quiz, and filterable image gallery with fullscreen lightbox.
- **Full-Stack Database Architecture:** Real-time data recording using PHP (PDO) and a normalized MySQL relational database for contact inquiries, peer/faculty feedback, conservation pledges, and water usage records.
- **Live Presentation Inspector:** An embedded live database viewer allowing presenters to show MySQL table insertions to their professors in real time!
- **Universal Dual-Mode Compatibility:** Operates seamlessly when served through full LAMP/WAMP/XAMPP stacks, and features graceful client-side simulation when previewed in standalone static environments.

---

## 💻 2. Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | HTML5, Modern CSS3 (Variables, 3D Depth, Glassmorphism), Bootstrap 5 Grid |
| **Typography** | Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*) |
| **Icons & FX** | Font Awesome 6, Dynamic Canvas 2D Bubble Physics, CSS Layered SVG Waves |
| **Client Logic** | Vanilla ES6+ JavaScript (Modular Architecture, IntersectionObserver, LocalStorage) |
| **Backend API** | PHP 7.4+ / PHP 8.x (RESTful JSON Endpoints with PDO Prepared Statements) |
| **Database** | MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+ |

---

## 📂 3. Directory Structure

```text
water-resources-management/
│
├── index.html              # Main responsive single-page web portal (12 sections)
├── database.sql            # Complete MySQL database creation script with seed records
├── README.md               # Comprehensive documentation and viva presentation guide
│
├── css/
│   ├── style.css           # Core styling, glassmorphic cards, typography, dark/light theme
│   ├── animations.css      # SVG wave parallax, floating bubble physics, glow pulses
│   └── responsive.css      # Breakpoints for mobile, tablet, laptop, and ultra-wide screens
│
├── js/
│   ├── main.js             # Theme toggle, scrollspy, navbar, animated stat counters, 3D tilt
│   ├── calculator.js       # Real-time mathematical water footprint calculator & PDF export
│   ├── interactive.js      # Daily challenges, academic quiz engine, gallery lightbox
│   └── api-client.js       # AJAX fetch client, MySQL persistence, presentation DB inspector
│
└── api/
    ├── db.php              # PDO Database connection with error handling & JSON responses
    ├── contact.php         # POST endpoint for contact queries (contact_messages table)
    ├── feedback.php        # POST & GET endpoints for reviews (feedback_reviews table)
    ├── pledge.php          # POST & GET endpoints for water pledges (water_pledges table)
    ├── calc-record.php     # POST endpoint for saving water audits (water_usage_records table)
    └── live-feed.php       # Live MySQL monitor endpoint for college presentation demo
```

---

## 🗄️ 4. MySQL Database Schema

The database `water_management_db` contains 4 normalized tables:

1. **`contact_messages`**:
   - `id` (INT PK AI), `full_name`, `email`, `phone`, `subject`, `category`, `message`, `ip_address`, `created_at`, `status`.
2. **`feedback_reviews`**:
   - `id` (INT PK AI), `user_name`, `user_email`, `user_role`, `rating` (1-5), `feedback_category`, `comments`, `created_at`, `is_approved`.
3. **`water_usage_records`**:
   - `id` (INT PK AI), `user_name`, `family_members`, `daily_liters`, `monthly_liters`, `annual_liters`, `per_capita_daily`, `efficiency_grade`, `breakdown_json`, `created_at`.
4. **`water_pledges`**:
   - `id` (INT PK AI), `full_name`, `institution`, `target_liters_to_save`, `pledge_action`, `created_at`.

---

## 🚀 5. How to Run Locally

### Method A: Using XAMPP (Recommended for Full PHP & MySQL Features)

1. **Download & Install XAMPP:**
   - Download XAMPP from [apachefriends.org](https://www.apachefriends.org/) (includes Apache, PHP, and MySQL).
2. **Move Project Folder:**
   - Copy the `water-resources-management` folder into XAMPP's `htdocs` directory:
     - Windows: `C:\xampp\htdocs\water-resources-management`
     - Mac: `/Applications/XAMPP/htdocs/water-resources-management`
3. **Start Apache & MySQL:**
   - Open the **XAMPP Control Panel** and click **Start** next to **Apache** and **MySQL**.
4. **Import Database:**
   - Open your browser and navigate to `http://localhost/phpmyadmin/`.
   - Click on the **Import** tab at the top.
   - Click **Choose File** and select `database.sql` from the project folder.
   - Click **Go** at the bottom. This will automatically create the database `water_management_db` and all tables with sample data.
5. **Launch the Portal:**
   - Open your browser and visit:
     ```text
     http://localhost/water-resources-management/
     ```

---

### Method B: Using PHP Built-In Web Server & MySQL

If you have PHP installed via CLI:
```bash
# Navigate to the project directory
cd path/to/water-resources-management

# Start PHP built-in development server
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

---

### Method C: Standalone Client Mode (Instant Preview)

If you need to quickly preview the UI without starting a web server or database:
- Simply double-click `index.html` to open it directly in Chrome, Edge, Firefox, or Safari.
- The portal's built-in `api-client.js` detects the offline mode and simulates form submissions and calculations smoothly in `localStorage` without generating any errors!

---

## 🌐 6. How to Publish the Website Publicly (Hosting & Domain)

### Option 1: Free PHP & MySQL Web Hosting (InfinityFree / 000webhost)

1. Register a free account at [InfinityFree](https://www.infinityfree.com/) or [000webhost](https://www.000webhost.com/).
2. Create a new website and note down the FTP/Control Panel credentials.
3. Open **phpMyAdmin** from the hosting Control Panel, create a database, and import `database.sql`.
4. Open `api/db.php` and update the credentials:
   ```php
   $host     = 'sqlxxx.infinityfree.com'; // Your hosting DB host
   $dbname   = 'if0_xxxx_water_db';        // Your hosting DB name
   $username = 'if0_xxxx';                 // Your hosting DB user
   $password = 'your_account_password';    // Your hosting DB password
   ```
5. Open the **File Manager** (or connect via FileZilla FTP) and upload all files from `water-resources-management` into `htdocs` or `public_html`.
6. Your portal is now publicly accessible via your free subdomain (e.g., `https://aquamanage.epizy.com`).

### Option 2: Shared Hosting with Custom Domain (Hostinger, Bluehost, cPanel)

1. Purchase your domain name (e.g. `watermanagementproject.org` or `aquamanage.live`) and shared hosting.
2. Log in to **cPanel** > **MySQL Database Wizard**:
   - Create database name, user, and strong password. Grant all privileges.
3. Open **cPanel** > **phpMyAdmin**, select the created database, and click **Import** to upload `database.sql`.
4. Edit `api/db.php` with your live database credentials.
5. In **cPanel File Manager**, upload all project files into `public_html`.
6. Access your public website via your domain name!

---

## 🎓 7. B.Tech Presentation & Viva Voce Guide

When presenting this project to your college professors and evaluation panel, highlight these key engineering strengths:

1. **Interdisciplinary Relevance (CS + Environmental Studies):**
   - Emphasize how computer science principles (IoT sensors, predictive analytics, relational databases) directly solve environmental sustainability issues aligned with **UN SDG 6**.
2. **Mathematical Rigor in the Calculator:**
   - Explain how the calculator factors flow rates: 9 L/min showerheads, 7 L dual-flush toilets, 6 L/min sink taps, and compares personal consumption against the **WHO 135 L/capita/day standard**.
3. **Live MySQL Demonstration:**
   - Click the **"View Live MySQL Feed"** button on the page. Submit a test message or review in front of the professor and click "Refresh Feed" to prove real-time data persistence.
4. **Modern UI Architecture:**
   - Point out the responsive glassmorphism, dynamic 2D canvas water bubbles, SVG wave parallax, CSS dark/light mode toggle with `localStorage` caching, and 3D hover effects.
5. **Code Hygiene & Security:**
   - Highlight the use of **PDO Prepared Statements** in PHP to prevent SQL Injection, HTML output sanitization (`htmlspecialchars`), and client-side form validation.

---

## 👥 8. Project Credits

- **Course:** B.Tech Computer Science & Engineering (Final Year Capstone)
- **Academic Year:** 2026 – 2027
- **Faculty Mentor:** Prof. Dr. K. V. Narayana (Department of CSE)
- **Team Members:**
  - Aarav Mehta (Lead Architect & Full Stack Developer)
  - Rohan Varma (Frontend & UI/UX Specialist)
  - Sneha Kulkarni (Database & Backend Engineer)
  - Vikramaditya Roy (Hydrology Research & Analytics)

---
*“Every Drop Counts. Every Action Matters. SAVE WATER, SAVE LIFE.”*
