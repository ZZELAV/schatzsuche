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
const validateBtn1 = document.getElementById('validateBtn1');
const validateBtn2 = document.getElementById('validateBtn2');
const status1 = document.getElementById('status1');
const status2 = document.getElementById('status2');
const submitBtn = document.getElementById('submitBtn');
const hint = document.getElementById('hint');
const codeContainer = document.getElementById('codeContainer');
const revealContainer = document.getElementById('revealContainer');

let code1Valid = false;
let code2Valid = false;

code1Input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
});

code2Input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
});

validateBtn1.addEventListener('click', async function() {
    const value = code1Input.value.trim();
    
    console.log('Prüfe Code 1:', value);
    
    if (value.length !== 6) {
        alert('CODE 1 muss genau 6 Ziffern haben!');
        return;
    }
    
    status1.textContent = '⏳ Wird geprüft...';
    status1.className = 'status';
    
    const hash = await sha256(value);
    
    console.log('Code 1 Hash:', hash);
    console.log('Erwartet:', CODE1_HASH);
    console.log('Match:', hash === CODE1_HASH);
    
    if (hash === CODE1_HASH) {
        code1Valid = true;
        code1Input.classList.add('correct');
        code1Input.classList.remove('incorrect');
        status1.textContent = '✓ CODE 1 ist korrekt!';
        status1.className = 'status success';
        validateBtn1.classList.add('validated');
        validateBtn1.textContent = '✓ Korrekt';
    } else {
        code1Valid = false;
        code1Input.classList.add('incorrect');
        code1Input.classList.remove('correct');
        status1.textContent = '✗ CODE 1 ist falsch';
        status1.className = 'status error';
        alert('CODE 1 ist falsch. Bitte überprüfe deine Eingabe.');
    }
    
    updateSubmitButton();
});

validateBtn2.addEventListener('click', async function() {
    const value = code2Input.value.trim();
    
    console.log('Prüfe Code 2:', value);
    
    if (value.length !== 6) {
        alert('CODE 2 muss genau 6 Ziffern haben!');
        return;
    }
    
    status2.textContent = '⏳ Wird geprüft...';
    status2.className = 'status';
    
    const hash = await sha256(value);
    
    console.log('Code 2 Hash:', hash);
    console.log('Erwartet:', CODE2_HASH);
    console.log('Match:', hash === CODE2_HASH);
    
    if (hash === CODE2_HASH) {
        code2Valid = true;
        code2Input.classList.add('correct');
        code2Input.classList.remove('incorrect');
        status2.textContent = '✓ CODE 2 ist korrekt!';
        status2.className = 'status success';
        validateBtn2.classList.add('validated');
        validateBtn2.textContent = '✓ Korrekt';
    } else {
        code2Valid = false;
        code2Input.classList.add('incorrect');
        code2Input.classList.remove('correct');
        status2.textContent = '✗ CODE 2 ist falsch';
        status2.className = 'status error';
        alert('CODE 2 ist falsch. Bitte überprüfe deine Eingabe.');
    }
    
    updateSubmitButton();
});

function updateSubmitButton() {
    console.log('Update Submit - Code1:', code1Valid, 'Code2:', code2Valid);
    
    if (code1Valid && code2Valid) {
        submitBtn.disabled = false;
        hint.textContent = '🎉 Beide Codes sind korrekt! Klicke auf "Geheimnis lüften"!';
        hint.style.color = '#28a745';
        hint.style.fontWeight = 'bold';
    } else if (code1Valid && !code2Valid) {
        submitBtn.disabled = true;
        hint.textContent = '⏳ CODE 1 korrekt! Prüfe jetzt CODE 2.';
        hint.style.color = '#ff9800';
    } else if (!code1Valid && code2Valid) {
        submitBtn.disabled = true;
        hint.textContent = '⏳ CODE 2 korrekt! Prüfe jetzt CODE 1.';
        hint.style.color = '#ff9800';
    } else {
        submitBtn.disabled = true;
        hint.textContent = '';
    }
}

submitBtn.addEventListener('click', function() {
    console.log('Submit geklickt');
    
    if (code1Valid && code2Valid) {
        console.log('Beide Codes valid - zeige Enthüllung');
        
        this.disabled = true;
        
        codeContainer.classList.add('hidden');
        revealContainer.classList.remove('hidden');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        createConfetti();
    } else {
        alert('Bitte beide Codes validieren!');
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

console.log('Script geladen');
console.log('CODE1_HASH:', CODE1_HASH);
console.log('CODE2_HASH:', CODE2_HASH);

window.addEventListener('load', async function() {
    console.log('=== HASH TEST ===');
    const test1 = await sha256('288186');
    const test2 = await sha256('112005');
    console.log('Hash von "288186":', test1);
    console.log('Erwartet:', CODE1_HASH);
    console.log('Match:', test1 === CODE1_HASH);
    console.log('---');
    console.log('Hash von "112005":', test2);
    console.log('Erwartet:', CODE2_HASH);
    console.log('Match:', test2 === CODE2_HASH);
});