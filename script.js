async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const CODE1_HASH = '7e0f6dd102d885e5a6c5ec22ed41c15c70ff44900c0407a86538a944864a3e86';
const CODE2_HASH = '75e126cbe0d2828588991c08168149276ffefbc62121f7e9e3c0bb10d7d19297';

const code1Input = document.getElementById('code1');
const code2Input = document.getElementById('code2');
const status1 = document.getElementById('status1');
const status2 = document.getElementById('status2');
const submitBtn = document.getElementById('submitBtn');
const hint = document.getElementById('hint');
const codeContainer = document.getElementById('codeContainer');
const revealContainer = document.getElementById('revealContainer');

let code1Valid = false;
let code2Valid = false;

async function validateCode1() {
    const value = code1Input.value.trim();
    
    if (value.length !== 6) {
        code1Valid = false;
        code1Input.classList.remove('correct', 'incorrect');
        status1.textContent = '';
        status1.className = 'status';
        updateSubmitButton();
        return;
    }
    
    const hash = await sha256(value);
    
    if (hash === CODE1_HASH) {
        code1Valid = true;
        code1Input.classList.remove('incorrect');
        code1Input.classList.add('correct');
        status1.textContent = '✓ CODE 1 korrekt!';
        status1.className = 'status success';
    } else {
        code1Valid = false;
        code1Input.classList.remove('correct');
        code1Input.classList.add('incorrect');
        status1.textContent = '✗ CODE 1 falsch';
        status1.className = 'status error';
    }
    
    updateSubmitButton();
}

async function validateCode2() {
    const value = code2Input.value.trim();
    
    if (value.length !== 6) {
        code2Valid = false;
        code2Input.classList.remove('correct', 'incorrect');
        status2.textContent = '';
        status2.className = 'status';
        updateSubmitButton();
        return;
    }
    
    const hash = await sha256(value);
    
    if (hash === CODE2_HASH) {
        code2Valid = true;
        code2Input.classList.remove('incorrect');
        code2Input.classList.add('correct');
        status2.textContent = '✓ CODE 2 korrekt!';
        status2.className = 'status success';
    } else {
        code2Valid = false;
        code2Input.classList.remove('correct');
        code2Input.classList.add('incorrect');
        status2.textContent = '✗ CODE 2 falsch';
        status2.className = 'status error';
    }
    
    updateSubmitButton();
}

code1Input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
    
    if (this.value.length === 6) {
        validateCode1();
    } else {
        code1Valid = false;
        this.classList.remove('correct', 'incorrect');
        status1.textContent = '';
        status1.className = 'status';
        updateSubmitButton();
    }
});

code2Input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
    
    if (this.value.length === 6) {
        validateCode2();
    } else {
        code2Valid = false;
        this.classList.remove('correct', 'incorrect');
        status2.textContent = '';
        status2.className = 'status';
        updateSubmitButton();
    }
});

code1Input.addEventListener('blur', function() {
    if (this.value.length === 6) {
        validateCode1();
    }
});

code2Input.addEventListener('blur', function() {
    if (this.value.length === 6) {
        validateCode2();
    }
});

function updateSubmitButton() {
    if (code1Valid && code2Valid) {
        submitBtn.disabled = false;
        hint.textContent = '🎉 Beide Codes sind korrekt! Klicke auf den Button!';
        hint.style.color = '#28a745';
        hint.style.fontWeight = 'bold';
    } else if (code1Valid && !code2Valid) {
        submitBtn.disabled = true;
        hint.textContent = '⏳ CODE 1 korrekt! CODE 2 fehlt noch...';
        hint.style.color = '#ff9800';
    } else if (!code1Valid && code2Valid) {
        submitBtn.disabled = true;
        hint.textContent = '⏳ CODE 2 korrekt! CODE 1 fehlt noch...';
        hint.style.color = '#ff9800';
    } else {
        submitBtn.disabled = true;
        hint.textContent = '';
    }
}

submitBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    if (code1Valid && code2Valid) {
        const hash1 = await sha256(code1Input.value.trim());
        const hash2 = await sha256(code2Input.value.trim());
        
        if (hash1 === CODE1_HASH && hash2 === CODE2_HASH) {
            this.disabled = true;
            
            codeContainer.classList.add('hidden');
            revealContainer.classList.remove('hidden');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            createConfetti();
        }
    }
});

function createConfetti() {
    const confettiCount = window.innerWidth < 600 ? 30 : 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = ['#ffd700', '#ff6347', '#4169e1', '#32cd32'][Math.floor(Math.random() * 4)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

updateSubmitButton();