// ============================================================
//  ↓↓↓  CONFIGURE AQUI  ↓↓↓
// ============================================================

// Data e hora em que o timer deve ZERAR (horário local do seu PC)
// Formato: new Date('YYYY-MM-DDTHH:MM:SS')
const TARGET_DATE = new Date('2026-05-19T03:17:52');

// IPs do servidor
document.getElementById('ip-java').textContent    = 'java.seuservidor.net:25565';
document.getElementById('ip-bedrock').textContent = 'bedrock.seuservidor.net:19132';

// ============================================================

const totalDuration = TARGET_DATE - new Date();

const terminalMessages = [
  'carregando mapa...',
  'gerando chunks...',
  'inicializando sistema de raças...',
  'calibrando PvP...',
  'aguardando jogadores...',
  'servidor em preparação...',
  'não tente adivinhar o IP...',
  'quase lá...',
];
let msgIndex = 0;

function typeMessage(msg, cb) {
  const el = document.getElementById('terminal-text');
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    el.textContent += msg[i++];
    if (i >= msg.length) { clearInterval(t); setTimeout(cb, 2000); }
  }, 45);
}

function cycleMessages() {
  typeMessage(terminalMessages[msgIndex % terminalMessages.length], cycleMessages);
  msgIndex++;
}
cycleMessages();

function pad(n) { return String(n).padStart(2, '0'); }

function spawnParticles() {
  const p = document.getElementById('particles');
  const chars = ['#', '█', '▓', '▒', '░', '⬛', '🟩'];
  for (let i = 0; i < 60; i++) {
    const span = document.createElement('span');
    span.className = 'particle';
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.animationDuration = (2 + Math.random() * 4) + 's';
    span.style.animationDelay = (Math.random() * 2) + 's';
    span.style.fontSize = (0.5 + Math.random() * 1.5) + 'rem';
    p.appendChild(span);
    setTimeout(() => span.remove(), 8000);
  }
}

function reveal() {
  spawnParticles();
  setTimeout(() => {
    document.getElementById('reveal-overlay').classList.add('active');
    spawnParticles();
  }, 500);
}

function tick() {
  const now  = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    ['hours', 'minutes', 'seconds'].forEach(id =>
      document.getElementById(id).textContent = '00'
    );
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('pct').textContent = '100%';
    reveal();
    return;
  }

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);

  document.getElementById('hours').textContent   = pad(h);
  document.getElementById('minutes').textContent = pad(m);
  document.getElementById('seconds').textContent = pad(s);

  // flash no segundo
  const secEl = document.getElementById('seconds');
  secEl.classList.add('tick');
  setTimeout(() => secEl.classList.remove('tick'), 150);

  // shake nos últimos 10s
  if (diff < 10_000) {
    document.getElementById('countdown-wrapper').classList.add('shaking');
  }

  // barra de progresso
  const elapsed = Math.max(0, totalDuration - diff);
  const pct = Math.min(100, (elapsed / totalDuration) * 100);
  document.getElementById('progress-fill').style.width = pct.toFixed(2) + '%';
  document.getElementById('pct').textContent = pct.toFixed(0) + '%';

  setTimeout(tick, 1000);
}

tick();
