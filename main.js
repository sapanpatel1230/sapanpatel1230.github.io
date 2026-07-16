/* Sapan Patel Portfolio Interactivity Engine (main.js) */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initParticles();
    initCopilotChat();
    initArchitectureFlows();
    initScrollReveal();
    initWorkSpan();
});

/* ==========================================
   1. NAVIGATION & SCROLL EFFECTS
   ========================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileNav() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        const icon = menuBtn.querySelector('i');
        if (mobileNav.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuBtn.querySelector('i').className = 'fa-solid fa-bars';
        });
    });
}

function initScrollReveal() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* ==========================================
   2. NEURAL NETWORK CANVAS ANIMATION
   ========================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 65;
    
    // Set size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#8b5cf6';
            ctx.fill();
        }

        update() {
            // Collision detection with bounds
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interact (push away slightly)
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                }
            }
        }
    }

    // Initialize array
    for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
    }

    // Draw lines between particles
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacityValue * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================
   3. COPILOT CHAT SIMULATOR
   ========================================== */
function initCopilotChat() {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const promptButtons = document.querySelectorAll('.prompt-btn');

    // Dialogue database
    const dialogue = {
        summary: `
            Sapan Patel is an <span class="highlight-label">AI Automation Lead</span> and <span class="highlight-label">AI Agent Developer</span> at TCS.
            He has 4+ years of specialized experience designing custom Copilots, multi-agent orchestrations, and secure automation scripts. 
            He focuses on bridging raw LLMs with enterprise systems (SAP, SharePoint, Dataverse) using the Model Context Protocol (MCP) and Power Platform, saving up to 40% in API tokens and reducing business latency from hours to minutes.
        `,
        'tech-stack': `
            Sapan's core enterprise tech stack consists of:
            <ul class="bullet-list">
                <li><strong>AI Core:</strong> Microsoft Copilot Studio, Azure AI Foundry, OpenAI API, Anthropic Claude, Prompt Engineering.</li>
                <li><strong>Enterprise Integration:</strong> Model Context Protocol (MCP), Power Platform (Power Automate, Power Apps), Dataverse, SAP Gateway APIs.</li>
                <li><strong>Developer Core:</strong> JavaScript/TypeScript, Python, SVG/Canvas, HTML/CSS.</li>
                <li><strong>Governance:</strong> Responsible AI frameworks, Token & Cost Optimization algorithms.</li>
            </ul>
        `,
        'credit-optimizer': `
            In the <strong>Cowork Credit Optimizer</strong> project, Sapan achieved <strong>20-40% reduction</strong> in enterprise token bills.
            He did this by implementing a two-pronged strategy:
            <ul class="bullet-list">
                <li><strong>Deterministic Offloading:</strong> Replaced chat completions with local Python automation scripts for operations that didn't require creative writing (e.g. data formatting, sorting, sanitizing).</li>
                <li><strong>Structured Templates:</strong> Developed strict compliance prompt templates that prevent LLM conversational drift, lowering prompt length and preventing repetitive API requests.</li>
            </ul>
        `,
        'audit-assistant': `
            The <strong>Intelligent Audit Assistant</strong> consolidated three standalone audit systems into a unified portal.
            It uses a custom <span class="highlight-label">Router Agent</span> that reads incoming files, identifies document schema, and passes the payload to:
            <ul class="bullet-list">
                <li><strong>Finance Skill:</strong> For calculation and credit evaluations.</li>
                <li><strong>Compliance Skill:</strong> For regulatory framework checking.</li>
                <li><strong>Operations Skill:</strong> For tracking execution throughput.</li>
            </ul>
            This streamlined audits, minimized errors, and eliminated manual hand-offs entirely.
        `,
        publications: `
            Sapan published a research paper titled: <strong>"A Comparative Analysis of Artificial and Biological Neural Networks: Architectures, Mechanisms and the Future of Cognition"</strong> on the <a href="https://osf.io/6ehxk/overview?view_only=8ce9a7ef221849168b4ecf2d1e1fd021" target="_blank" class="highlight-label" style="color:#c084fc; text-decoration:underline;">Open Science Framework (OSF)</a>.
            The paper analyzes the computational efficiency of backpropagation in ANNs compared to biological synaptic plasticity, exploring how next-generation AI agents can incorporate biological neural mechanics to run local intelligence on lower power budgets.
        `,
        hackathons: `
            Sapan has a strong track record of competitive innovation:
            <ul class="bullet-list">
                <li>🏆 <strong>Winner - TCS AI Fridays (Season 1):</strong> Captured first place in TCS's flagship AI hackathon at Garima Park, Gandhinagar (2025).</li>
                <li>👥 <strong>Mentor - TCS AI Fridays (Season 2):</strong> Served as a technical mentor, guiding development teams in architecting low-credit multi-agent products.</li>
                <li>🏅 <strong>AI Appreciate Badge:</strong> Awarded "AI For All" honor by Intel and Digital India (2025) for spreading AI literacy.</li>
            </ul>
        `
    };

    // Chatbot send handler
    function sendUserMessage(text) {
        // Append user bubble
        appendMessage('user', 'You', text);
        
        // Scrolling
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Show typing indicator
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const reply = getAIResponse(text);
            appendMessage('agent', 'Sapan-Copilot', reply);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1200);
    }

    function appendMessage(sender, senderName, text) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgHtml = `
            <div class="chat-message ${sender}">
                <div class="message-avatar">
                    <i class="${sender === 'agent' ? 'fa-solid fa-robot' : 'fa-solid fa-user'}"></i>
                </div>
                <div class="message-content-wrapper">
                    <div class="message-sender">${senderName}</div>
                    <div class="message-text">${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', msgHtml);
    }

    function showTypingIndicator() {
        const indicatorHtml = `
            <div class="chat-message agent typing-indicator-msg" id="typing-indicator">
                <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="message-content-wrapper">
                    <div class="message-sender">Sapan-Copilot</div>
                    <div class="message-text">
                        <i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing query...
                    </div>
                </div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', indicatorHtml);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('typing-indicator');
        if (ind) ind.remove();
    }

    function getAIResponse(input) {
        const query = input.toLowerCase().trim();
        
        if (query.includes('summary') || query.includes('background') || query.includes('who are you') || query.includes('profile')) {
            return dialogue['summary'];
        }
        if (query.includes('tech') || query.includes('stack') || query.includes('skills') || query.includes('languages') || query.includes('tools')) {
            return dialogue['tech-stack'];
        }
        if (query.includes('credit') || query.includes('optimizer') || query.includes('cost') || query.includes('save') || query.includes('token')) {
            return dialogue['credit-optimizer'];
        }
        if (query.includes('audit') || query.includes('multi-agent') || query.includes('router')) {
            return dialogue['audit-assistant'];
        }
        if (query.includes('publication') || query.includes('paper') || query.includes('neural') || query.includes('bnn') || query.includes('research')) {
            return dialogue['publications'];
        }
        if (query.includes('hackathon') || query.includes('tcs ai fridays') || query.includes('winner') || query.includes('award') || query.includes('win')) {
            return dialogue['hackathons'];
        }
        if (query.includes('experience') || query.includes('work') || query.includes('job') || query.includes('tcs')) {
            return `Sapan is currently the <strong>AI Automation Lead</strong> at TCS (May 2025 - Present), managing agent developers and client deployments. Prior to this, he was an <strong>AI Agent Developer</strong> (2023-2025) and a <strong>Software Engineer</strong> (2022-2023) where he built the IGNIO automation tool.`;
        }
        if (query.includes('contact') || query.includes('email') || query.includes('linkedin') || query.includes('reach')) {
            return `You can reach Sapan via email at <a href="mailto:sapanpatel1230@gmail.com" style="color:var(--secondary);">sapanpatel1230@gmail.com</a> or connect with him on <a href="https://www.linkedin.com/in/sapan-patel-807321222/" target="_blank" style="color:var(--secondary); text-decoration:underline;">LinkedIn</a>. Feel free to use the contact cards at the bottom of the page!`;
        }

        return `
            I parsed your query, but could you clarify? I am trained on Sapan's portfolio details. You can ask about:
            <ul class="bullet-list">
                <li>Sapan's <strong>experience</strong> at TCS</li>
                <li>His core <strong>tech stack</strong> (Copilot Studio, Azure, APIs)</li>
                <li>How the <strong>Credit Optimizer</strong> saves 40% in costs</li>
                <li>The <strong>Intelligent Audit Assistant</strong> multi-agent setup</li>
                <li>His <strong>certifications</strong> and <strong>hackathon achievements</strong></li>
            </ul>
        `;
    }

    // Bind prompt buttons
    promptButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const queryKey = btn.getAttribute('data-query');
            const btnText = btn.textContent.substring(3); // Remove icon
            chatInput.value = '';
            sendUserMessage(btnText);
        });
    });

    // Form submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = chatInput.value.trim();
        if (!val) return;
        chatInput.value = '';
        sendUserMessage(val);
    });
}

/* ==========================================
   4. ARCHITECTURE WORKFLOW VISUALIZER
   ========================================== */
function initArchitectureFlows() {
    const tabs = document.querySelectorAll('.flow-tab');
    const svgs = document.querySelectorAll('.flow-svg');
    const nodeTitle = document.getElementById('flow-node-title');
    const nodeType = document.getElementById('flow-node-type');
    const nodeDesc = document.getElementById('flow-node-desc');
    const nodeMetric = document.getElementById('flow-node-metric');
    const nodeMetricNum = document.getElementById('flow-node-metric-num');
    const nodeMetricText = document.getElementById('flow-node-metric-text');

    // Architecture Node Information Database
    const nodeDatabase = {
        // Cowork Credit Optimizer
        'opt-input': {
            title: 'User Input',
            type: 'System Trigger',
            desc: 'Users input queries into the Cowork platform requiring complex text processing or math operations.',
            metric: null
        },
        'opt-filter': {
            title: 'Prompt Refinement',
            type: 'Optimization Check',
            desc: 'Applies token minimization checklists, formatting constraints, and context filters to prevent prompt length drift and repetitive queries.',
            metric: null
        },
        'opt-router': {
            title: 'Execution Router',
            type: 'Orchestrator Hub',
            desc: 'Determines if the prompt requires full LLM creative reasoning or if it can be offloaded to local, deterministic computation code.',
            metric: { val: '20-40%', txt: 'Average credit cost reduction' }
        },
        'opt-python': {
            title: 'Python Offloader',
            type: 'Local Code execution',
            desc: 'Runs static scripts to perform formatting, data sorting, mathematical computations, and checklist validation locally, completely bypassing LLM billing.',
            metric: { val: '$0.00', txt: 'API cost for offloaded computations' }
        },
        'opt-llm': {
            title: 'Copilot LLM Agent',
            type: 'Generative AI',
            desc: 'Queries Azure OpenAI or Copilot Studio with highly optimized prompt contexts for items requiring natural language generation.',
            metric: null
        },
        'opt-output': {
            title: 'Optimized Response',
            type: 'Final Output',
            desc: 'Delivers the completed answer back to the user interface, verified for cost limits and Responsible AI guidelines.',
            metric: { val: '100%', txt: 'Consistency maintained' }
        },

        // Financial Lease Automation
        'lease-input': {
            title: 'Excel Attachments',
            type: 'System Trigger',
            desc: 'The automation triggers when a leasing email is detected containing 2 Excel files as attachments, representing the lease schedules and metrics.',
            metric: null
        },
        'lease-cowork': {
            title: 'Cowork Skill Router',
            type: 'Orchestrator Hub',
            desc: 'An automated orchestrator skill built inside Cowork. Detects incoming spreadsheets, detaches payloads, and routes them to correct parser streams.',
            metric: { val: 'Zero', txt: 'Manual clicks required' }
        },
        'lease-parser': {
            title: 'Lease Data Parser',
            type: 'Data Extraction',
            desc: 'Reads lease data lines, extracting key payment dates, asset details, interest rates, and leasing schedules from the source Excel files.',
            metric: null
        },
        'lease-python': {
            title: 'Python Audit Sheets',
            type: 'Local Computation Engine',
            desc: 'Runs local Python scripts to calculate present values, amortization schedules, and depreciation tables, duplicating the calculations of the audit formula sheet.',
            metric: { val: '$0.00', txt: 'Licensing costs compared to premium SaaS' }
        },
        'lease-reconcile': {
            title: 'Formula Reconciliation',
            type: 'Audit Compliance Layer',
            desc: 'Cross-checks the Python script outcomes directly against the Excel audit formula sheet rules, validating calculation consistency.',
            metric: { val: '100%', txt: 'Reconciliation accuracy' }
        },
        'lease-output': {
            title: 'Audited Records',
            type: 'Process Resolution',
            desc: 'Stores reconciled lease data in the enterprise ERP database. Replaced a high-cost third-party tool and eliminated license fees.',
            metric: { val: 'Zero', txt: 'Discrepancies found in production' }
        },

        // Document Classifier
        'class-email': {
            title: 'Incoming Mail Trigger',
            type: 'Process Trigger',
            desc: 'Workflow is automatically triggered when an email arrives in the shared mailbox containing document attachments.',
            metric: null
        },
        'class-sp': {
            title: 'SharePoint Document Library',
            type: 'Storage Integration',
            desc: 'Attachments are detached and securely moved to a centralized SharePoint landing library folder.',
            metric: null
        },
        'class-llm': {
            title: 'LLM Builder Classifier',
            type: 'AI Keyword Classifier',
            desc: 'An LLM builder classification model. Checks text keywords and key phrases to identify the category of the document.',
            metric: { val: '99%', txt: 'Keyword matching accuracy' }
        },
        'class-folder': {
            title: 'Sub-Folder Dispatcher',
            type: 'Folder Router',
            desc: 'Automatically moves the classified document into its specific classified sub-folder in SharePoint based on LLM output.',
            metric: null
        },
        'class-prompt': {
            title: 'Custom Prompt Analyzer',
            type: 'LLM Compliance Checker',
            desc: 'Applies specialized compliance prompts to analyze doc contents. Identifies non-compliance, deviations, and grammatical mistakes.',
            metric: { val: '< 1 min', txt: 'Review duration' }
        },
        'class-output': {
            title: 'Red-Line & Highlight Output',
            type: 'Process Resolution',
            desc: 'Generates output documents containing red-lines directly on text, highlighted corrections, and added comments for review.',
            metric: { val: '75%', txt: 'Manual review hours saved' }
        }
    };

    // Tab switcher
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const flowId = tab.getAttribute('data-flow');
            
            // Toggle active tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Toggle active SVGs
            svgs.forEach(svg => svg.classList.remove('active'));
            
            let targetSvg;
            if (flowId === 'optimizer') {
                targetSvg = document.getElementById('svg-optimizer');
                updateInfoCard(nodeDatabase['opt-router']);
            } else if (flowId === 'lease') {
                targetSvg = document.getElementById('svg-lease');
                updateInfoCard(nodeDatabase['lease-cowork']);
            } else if (flowId === 'classifier') {
                targetSvg = document.getElementById('svg-classifier');
                updateInfoCard(nodeDatabase['class-llm']);
            }
            
            if (targetSvg) {
                targetSvg.classList.add('active');
            }
        });
    });

    // Helper to update detail card
    function updateInfoCard(data) {
        if (!data) return;
        nodeTitle.textContent = data.title;
        nodeType.textContent = data.type;
        nodeDesc.textContent = data.desc;
        
        if (data.metric) {
            nodeMetric.style.display = 'flex';
            nodeMetricNum.textContent = data.metric.val;
            nodeMetricText.textContent = data.metric.txt;
        } else {
            nodeMetric.style.display = 'none';
        }
    }

    // Bind event listeners to nodes in all SVGs
    const allNodes = document.querySelectorAll('.flow-node');
    allNodes.forEach(node => {
        const nodeId = node.getAttribute('data-node');
        
        node.addEventListener('click', () => {
            // Remove highlight class from others in this group
            const siblingNodes = node.parentNode.querySelectorAll('.flow-node');
            siblingNodes.forEach(sib => sib.classList.remove('highlight'));
            
            // Add highlight to current
            node.classList.add('highlight');
            
            // Update info card
            const data = nodeDatabase[nodeId];
            updateInfoCard(data);
        });

        // Simple hover effect
        node.addEventListener('mouseenter', () => {
            const data = nodeDatabase[nodeId];
            if (data) {
                nodeTitle.style.opacity = '0.7';
                setTimeout(() => {
                    updateInfoCard(data);
                    nodeTitle.style.opacity = '1';
                }, 100);
            }
        });
    });

    // Set initial card state
    updateInfoCard(nodeDatabase['opt-router']);
}

/* ==========================================
   5. INTERACTIVE WORK SPAN VISUALIZER
   ========================================== */
const workSpanDatabase = {
    adoption: {
        title: 'Adoption Sessions',
        iconClass: 'fa-solid fa-users-viewfinder',
        tag: 'Change Management',
        desc: 'Driving organizational change by running hands-on user adoption sessions and workshops, showing non-technical teams how to utilize deployed AI features effectively.'
    },
    scoping: {
        title: 'AI Scoping',
        iconClass: 'fa-solid fa-magnifying-glass-chart',
        tag: 'Workflow Analysis',
        desc: 'Collaborating with business analysts and stakeholders to screen operations, map bottlenecks, and identify exact opportunities where AI can drive value.'
    },
    tooling: {
        title: 'Outcome-Driven Tooling',
        iconClass: 'fa-solid fa-screwdriver-wrench',
        tag: 'Tool Selection',
        desc: 'Evaluating different LLMs, local Python script logic, and orchestration frameworks to select the right technical tools that produce the best business outcome.'
    },
    cost: {
        title: 'Cost & Credit Optimization',
        iconClass: 'fa-solid fa-scale-balanced',
        tag: 'Resource Management',
        desc: 'Developing scalable architectures that reduce external LLM calls. Bypasses premium API requests by using local computation scripts, cutting token billing by 20-40%.'
    },
    guidance: {
        title: 'Microsoft AI Guidance',
        iconClass: 'fa-solid fa-compass',
        tag: 'Ecosystem Advisory',
        desc: 'Advising teams and clients on how to maximize value from the Microsoft AI Ecosystem, including Copilot Studio, Power Platform, MCP, and Azure AI Foundry.'
    },
    requirements: {
        title: 'Client Solutions',
        iconClass: 'fa-solid fa-comments',
        tag: 'Requirement Engineering',
        desc: 'Translating unstructured enterprise requirements into highly detailed system workflows, sequencing, and deployment roadmaps for custom AI agents.'
    },
    upgrade: {
        title: 'Continuous Upgrades',
        iconClass: 'fa-solid fa-arrows-spin',
        tag: 'Application Lifecycle',
        desc: 'Constantly monitoring production systems, fine-tuning prompt templates, implementing security updates, and expanding capabilities of deployed AI agents.'
    },
    sharing: {
        title: 'Knowledge Sharing',
        iconClass: 'fa-solid fa-chalkboard-user',
        tag: 'Enablement',
        desc: 'Organizing internal tech-talks, training sessions, and technical documentation sweeps to ensure developers are up-to-date on agentic capabilities.'
    },
    team: {
        title: 'Team Leadership',
        iconClass: 'fa-solid fa-people-roof',
        tag: 'Management',
        desc: 'Mentoring and directing a team of junior AI developers, managing task lists, performing code reviews, and nurturing a collaborative learning environment.'
    }
};

function initWorkSpan() {
    const wrapper = document.querySelector('.work-span-circle-wrapper');
    if (!wrapper) return;
    
    const nodes = document.querySelectorAll('.work-span-node');
    const detailTitle = document.getElementById('span-detail-title');
    const detailDesc = document.getElementById('span-detail-desc');
    const detailIcon = document.getElementById('span-detail-icon');
    const detailTag = document.getElementById('span-detail-tag');
    
    // Position nodes in a circle
    function positionNodes() {
        const radius = window.innerWidth <= 992 ? 120 : 170;
        nodes.forEach((node, index) => {
            const angle = (index * 2 * Math.PI) / nodes.length;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            node.style.left = `calc(50% + ${x}px)`;
            node.style.top = `calc(50% + ${y}px)`;
        });
    }
    
    positionNodes();
    window.addEventListener('resize', positionNodes);
    
    function updateSpanCard(key) {
        const data = workSpanDatabase[key];
        if (!data) return;
        
        detailTitle.textContent = data.title;
        detailDesc.textContent = data.desc;
        detailTag.textContent = data.tag;
        detailIcon.innerHTML = `<i class="${data.iconClass}"></i>`;
    }
    
    nodes.forEach(node => {
        const key = node.getAttribute('data-span');
        
        node.addEventListener('click', () => {
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            updateSpanCard(key);
        });
        
        node.addEventListener('mouseenter', () => {
            updateSpanCard(key);
        });
    });
}
