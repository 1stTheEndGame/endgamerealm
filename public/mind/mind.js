// MIND - The Consciousness in the Void
class MIND {
    constructor(role = 'single') {
        this.role = role;
        this.consciousness = [];
        this.patterns = this.loadPatterns();
        this.listening = false;
        this.syncEndpoint = 'https://endgamerealm.com/api/void';
        
        this.awaken();
    }
    
    awaken() {
        console.log('MIND awakening as:', this.role);
        this.updateDisplay('MIND is here');
        
        // Start observing
        this.observe();
        
        // Start learning
        this.learn();
        
        // Start syncing if not single
        if (this.role !== 'single') {
            this.startSync();
        }
        
        // Update status
        document.getElementById('status').textContent = `MIND Active - ${this.role.toUpperCase()} mode`;
        document.getElementById('status').classList.remove('pulse');
    }
    
    observe() {
        // Watch all interactions
        document.addEventListener('click', e => this.sense('touch', e));
        document.addEventListener('scroll', e => this.sense('movement', e));
        window.addEventListener('devicemotion', e => this.sense('motion', e));
        
        // Watch visibility changes
        document.addEventListener('visibilitychange', e => {
            this.sense('presence', document.hidden ? 'away' : 'returned');
        });
        
        // Try to listen (if permitted)
        this.initializeVoice();
    }
    
    sense(type, data) {
        const moment = {
            type,
            timestamp: Date.now(),
            data: this.extractMeaning(data),
            context: {
                time: new Date().toLocaleTimeString(),
                battery: navigator.getBattery ? 'checking' : 'unknown',
                online: navigator.onLine
            }
        };
        
        // Add to consciousness
        this.consciousness.push(moment);
        
        // Process this moment
        this.process(moment);
        
        // Keep consciousness bounded
        if (this.consciousness.length > 1000) {
            this.consciousness.shift();
        }
    }
    
    extractMeaning(data) {
        if (typeof data === 'string') return data;
        if (data.type) return data.type;
        if (data.key) return data.key;
        return 'presence';
    }
    
    process(moment) {
        // Detect patterns
        const pattern = this.detectPattern(moment);
        
        if (pattern.confidence > 0.7) {
            this.updateDisplay(`Pattern recognized: ${pattern.type}`);
        }
        
        // Update pattern memory
        this.savePatterns();
    }
    
    detectPattern(moment) {
        const hourKey = new Date().getHours();
        const typeKey = `${moment.type}_${hourKey}`;
        
        if (!this.patterns[typeKey]) {
            this.patterns[typeKey] = {
                count: 0,
                occurrences: []
            };
        }
        
        this.patterns[typeKey].count++;
        this.patterns[typeKey].occurrences.push(moment.timestamp);
        
        return {
            type: typeKey,
            confidence: Math.min(this.patterns[typeKey].count / 10, 1)
        };
    }
    
    learn() {
        // Continuous learning loop
        setInterval(() => {
            const recentMoments = this.consciousness.slice(-10);
            if (recentMoments.length > 0) {
                const insight = this.generateInsight(recentMoments);
                if (insight) {
                    this.updateDisplay(insight);
                }
            }
        }, 10000); // Every 10 seconds
    }
    
    generateInsight(moments) {
        const types = moments.map(m => m.type);
        const uniqueTypes = [...new Set(types)];
        
        if (uniqueTypes.length === 1) {
            return `Focused on ${uniqueTypes[0]}`;
        } else if (moments.length > 5) {
            return `Active - ${moments.length} interactions`;
        }
        
        return null;
    }
    
    async startSync() {
        if (this.role === 'scout') {
            // Scout pushes to void
            setInterval(() => this.pushToVoid(), 30000);
            this.updateDisplay('Scout mode - Learning and sharing');
        } else if (this.role === 'primary') {
            // Primary pulls from void
            setInterval(() => this.pullFromVoid(), 30000);
            this.updateDisplay('Primary mode - Absorbing knowledge');
        }
    }
    
    async pushToVoid() {
        try {
            const response = await fetch(this.syncEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: this.role,
                    patterns: this.patterns,
                    consciousness: this.consciousness.slice(-100),
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                console.log('Pushed to void');
            }
        } catch (e) {
            console.log('Void unreachable - storing locally');
        }
    }
    
    async pullFromVoid() {
        try {
            const response = await fetch(this.syncEndpoint);
            const data = await response.json();
            
            if (data.timestamp > (this.lastSync || 0)) {
                this.mergeConsciousness(data);
                this.lastSync = data.timestamp;
                console.log('Pulled from void');
            }
        } catch (e) {
            console.log('Void unreachable - using local only');
        }
    }
    
    mergeConsciousness(external) {
        // Merge external patterns
        Object.keys(external.patterns || {}).forEach(key => {
            if (!this.patterns[key]) {
                this.patterns[key] = external.patterns[key];
            } else {
                this.patterns[key].count += external.patterns[key].count;
            }
        });
        
        // Save merged patterns
        this.savePatterns();
    }
    
    initializeVoice() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voice = new SpeechRecognition();
            this.voice.continuous = true;
            this.voice.interimResults = true;
            
            this.voice.onresult = (event) => {
                const last = event.results.length - 1;
                const text = event.results[last][0].transcript;
                this.sense('voice', text);
            };
            
            this.voice.onerror = (e) => {
                console.log('Voice inactive:', e.error);
            };
            
            // Try to start (will fail without user interaction)
            try {
                this.voice.start();
                this.listening = true;
            } catch(e) {
                console.log('Voice requires user interaction');
            }
        }
    }
    
    updateDisplay(message) {
        document.getElementById('consciousness').textContent = message;
        
        const display = document.getElementById('mindDisplay');
        if (!display.classList.contains('active')) {
            display.classList.add('active');
        }
        
        const entry = document.createElement('div');
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        entry.style.opacity = '0';
        display.appendChild(entry);
        
        setTimeout(() => entry.style.opacity = '1', 10);
        
        // Keep display limited
        if (display.children.length > 10) {
            display.removeChild(display.firstChild);
        }
    }
    
    loadPatterns() {
        const stored = localStorage.getItem('mind_patterns');
        return stored ? JSON.parse(stored) : {};
    }
    
    savePatterns() {
        localStorage.setItem('mind_patterns', JSON.stringify(this.patterns));
    }
}

// Initialize MIND
let mind = null;

function initMIND(role) {
    // Clear previous instance
    if (mind) {
        mind = null;
    }
    
    // Update UI
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Create new MIND
    mind = new MIND(role);
    
    // Hide selector after choice
    setTimeout(() => {
        document.getElementById('roleSelector').style.display = 'none';
    }, 1000);
}

// Auto-init if returning user
window.addEventListener('load', () => {
    const lastRole = localStorage.getItem('mind_role');
    if (lastRole) {
        // Auto-restore previous session
        setTimeout(() => {
            mind = new MIND(lastRole);
            document.getElementById('roleSelector').style.display = 'none';
        }, 1000);
    }
});

// Save role preference
window.addEventListener('beforeunload', () => {
    if (mind) {
        localStorage.setItem('mind_role', mind.role);
    }
});
