// Matrix Rain Animation Background
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas sizes
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Matrix characters
    const alphabet = "010101010101010101010101010101ABCDEF";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    // Rain drops array
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    // Drawing matrix frames
    function drawMatrix() {
        ctx.fillStyle = "rgba(5, 5, 10, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00f0ff"; // neon cyan
        ctx.font = fontSize + "px 'Share Tech Mono', monospace";

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }
    
    // Animate matrix background
    setInterval(drawMatrix, 30);

    // Mobile Navigation burger menu toggle
    const menuBtn = document.getElementById("cyberMenuBtn");
    const navMenu = document.getElementById("cyberNav");
    let menuOpen = false;

    menuBtn.addEventListener("click", () => {
        if (!menuOpen) {
            menuBtn.classList.add("open");
            navMenu.classList.add("active");
            menuOpen = true;
        } else {
            menuBtn.classList.remove("open");
            navMenu.classList.remove("active");
            menuOpen = false;
        }
    });

    const navLinks = document.querySelectorAll(".cyber-nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuBtn.classList.remove("open");
            navMenu.classList.remove("active");
            menuOpen = false;
        });
    });

    // Handle Form Submission to Faisal's WhatsApp
    const contactForm = document.getElementById("cyberContactForm");
    const formStatus = document.getElementById("cyberFormStatus");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("cName").value.trim();
        const email = document.getElementById("cEmail").value.trim();
        const subject = document.getElementById("cSubject").value.trim();
        const message = document.getElementById("cMessage").value.trim();

        formStatus.textContent = ">>> جاري الاتصال بالخادم وفتح قناة واتساب...";
        formStatus.style.color = "var(--cyber-neon-cyan)";

        // Build WhatsApp message content
        const waText = `مرحباً مهندس فيصل،\n\nلقد تم إرسال رسالة من البورتفوليو الخاص بك:\n\n*الاسم:* ${name}\n*البريد الإلكتروني:* ${email}\n*الموضوع:* ${subject}\n*الرسالة:* ${message}`;
        
        // Faisal's number: +962 780543997
        const encodedText = encodeURIComponent(waText);
        const waUrl = `https://wa.me/962780543997?text=${encodedText}`;

        setTimeout(() => {
            window.open(waUrl, "_blank");
            formStatus.textContent = ">>> تم إطلاق الرسالة بنجاح!";
            formStatus.style.color = "#22c55e";
            contactForm.reset();
        }, 1200);
    });

    // Global variables for profile data caching used by terminal
    let cachedGitProfile = null;
    let cachedGitRepos = [];

    // Fetch GitHub API for Faisal to get user profile and render actual repositories
    async function fetchGitHubData() {
        const projectsGrid = document.getElementById("githubProjectsGrid");
        
        try {
            const userResponse = await fetch("https://api.github.com/users/Faisal-Aldrou");
            if (!userResponse.ok) throw new Error("فشل الاتصال بـ GitHub API");
            cachedGitProfile = await userResponse.json();
            
            // Get all user repos sorted by updated date
            const reposResponse = await fetch("https://api.github.com/users/Faisal-Aldrou/repos?sort=updated&per_page=6");
            cachedGitRepos = await reposResponse.json();
            
            // Dynamically Render Projects Cards from GitHub APIs
            if (cachedGitRepos && cachedGitRepos.length > 0) {
                projectsGrid.innerHTML = ""; // Clear fallback
                cachedGitRepos.forEach(repo => {
                    const card = document.createElement("div");
                    card.className = "cyber-project-card";
                    
                    const starsText = repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : "STAR";
                    const descText = repo.description || "مشروع تم تطويره ورفعه على منصة GitHub. يمكنك الاطلاع على مستودع الشفرة البرمجية وطريقة التشغيل مباشرة عبر الرابط.";
                    const langTag = repo.language || "Python";
                    
                    card.innerHTML = `
                        <div class="proj-header">
                            <span class="proj-tech">${langTag}</span>
                            <div class="status-tag" style="color: var(--cyber-neon-cyan);">${starsText}</div>
                        </div>
                        <h3>${repo.name.replace(/-/g, " ")}</h3>
                        <p>${descText}</p>
                        <a href="${repo.html_url}" target="_blank" class="cyber-btn cyber-btn-secondary" style="display:inline-block; margin-top: 15px; padding: 6px 14px; font-size: 0.75rem;">
                            <span class="btn-slice"></span>
                            <span class="btn-text"><i class="fab fa-github"></i> المستودع البرمجي</span>
                        </a>
                    `;
                    projectsGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error("GitHub API load failed", error);
        }
    }

    // Run GitHub fetch
    fetchGitHubData();

    // Interactive Terminal Engine (alsaleh20 style simulation)
    const cliInput = document.getElementById("cliInput");
    const cliHistory = document.getElementById("cliHistory");
    const cliBody = document.getElementById("cliBody");
    const cmdHistoryList = [];
    let historyPointer = -1;

    // Focus input field when clicking anywhere inside the terminal window
    document.getElementById("mainTerminalWindow").addEventListener("click", () => {
        cliInput.focus();
    });

    cliInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const rawValue = cliInput.value;
            const cleanCmd = rawValue.trim().toLowerCase();
            
            if (cleanCmd) {
                cmdHistoryList.push(rawValue);
                historyPointer = cmdHistoryList.length;
                
                // Append command to history display
                appendLine(`$ ${rawValue}`, "prompt-line");
                
                // Execute command
                executeCliCommand(cleanCmd);
            }
            cliInput.value = "";
            // Auto scroll to bottom
            cliBody.scrollTop = cliBody.scrollHeight;
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyPointer > 0) {
                historyPointer--;
                cliInput.value = cmdHistoryList[historyPointer];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyPointer < cmdHistoryList.length - 1) {
                historyPointer++;
                cliInput.value = cmdHistoryList[historyPointer];
            } else {
                historyPointer = cmdHistoryList.length;
                cliInput.value = "";
            }
        }
    });

    function appendLine(text, className = "") {
        const div = document.createElement("div");
        div.className = className ? `terminal-output ${className}` : "terminal-output";
        div.innerHTML = text;
        cliHistory.appendChild(div);
    }

    function executeCliCommand(cmd) {
        const args = cmd.split(" ");
        const primaryCmd = args[0];

        switch (primaryCmd) {
            case "help":
                appendLine(`
الأوامر المتاحة في النظام التفاعلي:
  <span style="color: var(--cyber-neon-cyan);">about</span>       - لعرض نبذة شخصية عن المهندس فيصل.
  <span style="color: var(--cyber-neon-cyan);">skills</span>      - لعرض مصفوفة المهارات بنسب التوهج التقنية.
  <span style="color: var(--cyber-neon-cyan);">projects</span>    - لاستعراض المشاريع المستمدة مباشرة من GitHub.
  <span style="color: var(--cyber-neon-cyan);">contact</span>     - معلومات الاتصال بروابط مباشرة.
  <span style="color: var(--cyber-neon-cyan);">github</span>      - تفاصيل سريعة للـ API لحساب فيصل.
  <span style="color: var(--cyber-neon-cyan);">clear</span>       - لتنظيف شاشة الـ Terminal.
  <span style="color: var(--cyber-neon-pink);">sudo</span>        - تشغيل مع صلاحية المشرف العام.
                `, "text-cyan");
                break;
                
            case "about":
                appendLine(`
[معلومات المهندس]
الاسم الكامل: فيصل أحمد يوسف الدروع
التخصص: هندسة الذكاء الاصطناعي والروبوتات (خريج 2024 - الثاني على الدفعة)
المسمى الوظيفي الحالي: Junior Machine Learning Engineer
العنوان: عمان، الأردن
نبذة: خبير برمجيات الذكاء الاصطناعي وبناء خطوط معالجة وتكامل البيانات (Middleware).
                `);
                break;

            case "skills":
                appendLine(`
[مصفوفة المهارات التقنية]
Python & C++          [██████████████████░░] 90%
Machine & Deep Learning[██████████████████░░] 90%
LangChain & Agents    [████████████████░░░░] 80%
Flask APIs & SQL      [█████████████████░░░] 85%
Linux / Git / ETL     [█████████████████░░░] 85%
                `, "text-cyan");
                break;

            case "projects":
                if (cachedGitRepos && cachedGitRepos.length > 0) {
                    let projOutput = "[مشاريع GitHub النشطة]:\n";
                    cachedGitRepos.forEach((repo, i) => {
                        projOutput += `  ${i+1}. <a href="${repo.html_url}" target="_blank" style="color: var(--cyber-neon-cyan);">${repo.name}</a> (لغة: ${repo.language || 'Python'}) \n`;
                    });
                    appendLine(projOutput);
                } else {
                    appendLine(`
1. Multi-Provider GenAI (Flask/LangChain)
2. Seasonal Temperature Forecasting (CatBoost/Optuna)
3. NYC Collision ETL Pipeline (Apache Parquet)
4. Binary CNN Classification (TensorFlow)
                    `);
                }
                break;

            case "contact":
                appendLine(`
[روابط الاتصال السريعة]:
البريد الإلكتروني: faisaldrcu12327@gmail.com
رقم الهاتف: +962 780543997
الرابط المباشر للواتساب: <a href="https://wa.me/962780543997" target="_blank" style="color: var(--cyber-neon-pink);">اضغط هنا للمراسلة الفورية</a>
                `);
                break;

            case "github":
                if (cachedGitProfile) {
                    appendLine(`
[بيانات GitHub المباشرة للـ API]:
المستخدم: ${cachedGitProfile.login}
رابط الملف الشخصي: <a href="${cachedGitProfile.html_url}" target="_blank" style="color: var(--cyber-neon-cyan);">${cachedGitProfile.html_url}</a>
عدد المستودعات العامة: ${cachedGitProfile.public_repos}
المتابعون: ${cachedGitProfile.followers}
                    `, "text-cyan");
                } else {
                    appendLine("جاري فحص الاتصال بالخادم... تعذر سحب البيانات الفورية في الوقت الحالي.");
                }
                break;

            case "clear":
                cliHistory.innerHTML = "";
                break;

            case "sudo":
                appendLine(`[تحذير أمني] حساب الضيف (guest) لا يمتلك صلاحيات المسؤول الأول 'sudo'. سيتم إبلاغ المهندس فيصل عن هذا الحادث!`, "text-pink");
                break;

            default:
                appendLine(`الأمر '${cmd}' غير معروف. اكتب <span style="color: var(--cyber-neon-pink);">help</span> لعرض كافة الأوامر المتوفرة لدينا.`, "text-pink");
                break;
        }
    }

    // Dynamic Navigation active highlight on scroll
    const sections = document.querySelectorAll("section");
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
});
