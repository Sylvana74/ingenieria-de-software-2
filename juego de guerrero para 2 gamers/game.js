"use strict";
// ============================================
// SISTEMA DE AUDIO Y VOZ SINTETIZADA
// ============================================
class SistemaAudio {
    ctxAudio = null;
    inicializar() {
        if (!this.ctxAudio) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctxAudio = new AudioCtx();
        }
        if (this.ctxAudio.state === 'suspended')
            this.ctxAudio.resume();
    }
    reproducirDisparo() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, this.ctxAudio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctxAudio.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.15);
    }
    reproducirCuracion() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        [440, 554, 659].forEach((freq, i) => {
            const osc = this.ctxAudio.createOscillator();
            const gain = this.ctxAudio.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctxAudio.currentTime + (i * 0.08));
            gain.gain.setValueAtTime(0.1, this.ctxAudio.currentTime + (i * 0.08));
            gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + (i * 0.08) + 0.2);
            osc.connect(gain);
            gain.connect(this.ctxAudio.destination);
            osc.start(this.ctxAudio.currentTime + (i * 0.08));
            osc.stop(this.ctxAudio.currentTime + (i * 0.08) + 0.2);
        });
    }
    reproducirEscudo() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, this.ctxAudio.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctxAudio.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.3);
    }
    reproducirGolpe() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, this.ctxAudio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctxAudio.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.2);
    }
    decirDerrota() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("¡Tú has muerto!");
            utterance.rate = 0.85;
            utterance.pitch = 0.5;
            utterance.lang = 'es-ES';
            window.speechSynthesis.speak(utterance);
        }
    }
}
const sfx = new SistemaAudio();
// ============================================
// SISTEMA DE LOGS Y CONSOLA VISUAL
// ============================================
function registrarLog(mensaje) {
    console.log(`[LOG]: "${mensaje}"`);
    const logContent = document.getElementById("logContent");
    if (logContent) {
        const div = document.createElement("div");
        div.className = "log-item";
        div.innerText = `[LOG]: "${mensaje}"`;
        logContent.appendChild(div);
        logContent.scrollTop = logContent.scrollHeight;
    }
}
window.toggleLog = () => {
    const panel = document.getElementById("logPanel");
    if (panel) {
        panel.style.display = panel.style.display === "none" ? "flex" : "none";
    }
};
// ============================================
// CLASES BASE (Cátedra)
// ============================================
class Arma {
    nombre;
    danio;
    constructor(nombre, danio) {
        this.nombre = nombre;
        this.danio = danio;
    }
    atacar() { registrarLog(`Ataque con ${this.nombre}: ${this.danio} puntos de daño`); }
}
class Habilidad {
    nombre;
    poder;
    constructor(nombre, poder) {
        this.nombre = nombre;
        this.poder = poder;
    }
    usar() { registrarLog(`Se utiliza ${this.nombre}: ${this.poder} puntos de poder`); }
}
// ============================================
// CLASE MURCIÉLAGO
// ============================================
class Murcielago {
    centroX;
    centroY;
    angulo = Math.random() * Math.PI * 2;
    velocidadGiro = 0.05;
    radio = 25;
    constructor(centroX, centroY) {
        this.centroX = centroX;
        this.centroY = centroY;
    }
    actualizar() {
        this.angulo += this.velocidadGiro;
    }
    dibujar(ctx) {
        const x = this.centroX + Math.cos(this.angulo) * this.radio;
        const y = (this.centroY - 30) + Math.sin(this.angulo * 2) * 10;
        ctx.save();
        ctx.fillStyle = "#111";
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 8, y - 6);
        ctx.lineTo(x - 4, y - 2);
        ctx.lineTo(x - 10, y - 4);
        ctx.lineTo(x, y + 4);
        ctx.lineTo(x + 10, y - 4);
        ctx.lineTo(x + 4, y - 2);
        ctx.lineTo(x + 8, y - 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
// ============================================
// PROYECTIL
// ============================================
class Proyectil {
    x;
    y;
    dx;
    dy;
    color;
    duenioId;
    activo = true;
    constructor(x, y, dx, dy, color, duenioId) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.duenioId = duenioId;
    }
    actualizar(maxX, maxY) {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > maxX || this.y < 0 || this.y > maxY)
            this.activo = false;
    }
    dibujar(ctx) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
// ============================================
// PERSONAJE
// ============================================
class Personaje {
    id;
    nombre;
    arma;
    habilidadCuracion;
    habilidadEscudo;
    colorCuerpo;
    x;
    y;
    vida = 100;
    viva = true;
    direccionX = 1;
    puntaje = 0;
    tieneEscudo = false;
    murcielagos = [];
    yaGritoDerrota = false;
    constructor(id, nombre, arma, habilidadCuracion, habilidadEscudo, posX, posY, colorCuerpo) {
        this.id = id;
        this.nombre = nombre;
        this.arma = arma;
        this.habilidadCuracion = habilidadCuracion;
        this.habilidadEscudo = habilidadEscudo;
        this.colorCuerpo = colorCuerpo;
        this.x = posX;
        this.y = posY;
    }
    recibirDanio(danio) {
        if (!this.viva)
            return;
        if (this.tieneEscudo) {
            this.tieneEscudo = false;
            sfx.reproducirEscudo();
            registrarLog(`P${this.id} (${this.nombre}): El escudo absorbió el daño`);
            return;
        }
        this.vida -= danio;
        sfx.reproducirGolpe();
        registrarLog(`P${this.id} (${this.nombre}) recibe ${danio} de daño. HP restante: ${this.vida}`);
        if (this.vida <= 0) {
            this.vida = 0;
            this.viva = false;
            registrarLog(`P${this.id} (${this.nombre}) ha muerto. ¡R.I.P!`);
            for (let i = 0; i < 3; i++) {
                this.murcielagos.push(new Murcielago(this.x, this.y));
            }
            if (!this.yaGritoDerrota) {
                this.yaGritoDerrota = true;
                sfx.decirDerrota();
            }
        }
    }
    disparar(proyectiles) {
        if (!this.viva)
            return;
        registrarLog(`P${this.id} (${this.nombre}) ataca:`);
        this.arma.atacar();
        sfx.reproducirDisparo();
        proyectiles.push(new Proyectil(this.x, this.y - 15, this.direccionX * 7, 0, this.colorCuerpo, this.id));
    }
    curarse() {
        if (!this.viva)
            return;
        registrarLog(`P${this.id} (${this.nombre}) utiliza habilidad:`);
        this.habilidadCuracion.usar();
        sfx.reproducirCuracion();
        this.vida += 20;
        if (this.vida > 100)
            this.vida = 100;
        registrarLog(`P${this.id} se curó. HP actual: ${this.vida}`);
    }
    activarEscudo() {
        if (!this.viva)
            return;
        registrarLog(`P${this.id} (${this.nombre}) utiliza habilidad:`);
        this.habilidadEscudo.usar();
        sfx.reproducirEscudo();
        this.tieneEscudo = true;
        registrarLog(`P${this.id} activó Escudo protector`);
    }
    mover(dirX, dirY, maxX, maxY) {
        if (!this.viva)
            return;
        const velocidad = 4;
        if (dirX !== 0)
            this.direccionX = dirX;
        this.x += dirX * velocidad;
        this.y += dirY * velocidad;
        if (this.x < 25)
            this.x = 25;
        if (this.x > maxX - 25)
            this.x = maxX - 25;
        if (this.y < 35)
            this.y = 35;
        if (this.y > maxY - 35)
            this.y = maxY - 35;
    }
    dibujar(ctx) {
        ctx.save();
        if (!this.viva) {
            ctx.fillStyle = "#6c757d";
            ctx.fillRect(this.x - 12, this.y - 25, 24, 30);
            ctx.beginPath();
            ctx.arc(this.x, this.y - 25, 12, Math.PI, 0, false);
            ctx.fill();
            ctx.fillStyle = "#343a40";
            ctx.fillRect(this.x - 2, this.y - 30, 4, 18);
            ctx.fillRect(this.x - 6, this.y - 22, 12, 4);
            ctx.fillStyle = "#ff4d4d";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(`R.I.P J${this.id}`, this.x - 22, this.y + 20);
            for (let m of this.murcielagos) {
                m.actualizar();
                m.dibujar(ctx);
            }
            ctx.restore();
            return;
        }
        if (this.tieneEscudo) {
            ctx.strokeStyle = "#00f5d4";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y - 10, 32, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.fillStyle = this.colorCuerpo;
        ctx.fillRect(this.x - 10, this.y - 15, 20, 26);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 10, this.y - 15, 20, 26);
        ctx.fillStyle = "#ffb703";
        ctx.beginPath();
        ctx.arc(this.x, this.y - 25, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x + (this.direccionX * 10), this.y - 5);
        ctx.lineTo(this.x + (this.direccionX * 25), this.y - 18);
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "11px sans-serif";
        ctx.fillText(`P${this.id}: ${this.nombre}`, this.x - 30, this.y - 42);
        ctx.fillText(`HP: ${this.vida}`, this.x - 20, this.y + 38);
        ctx.restore();
    }
}
// ============================================
// CONFIGURACIÓN Y BUCLE PRINCIPAL
// ============================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const espadaBase = new Arma("Espada Plasma", 25);
const curacion = new Habilidad("Curación Cuántica", 20);
const escudo = new Habilidad("Escudo de Iones", 1);
const jugador1 = new Personaje(1, "Cyber", espadaBase, curacion, escudo, 120, 200, "#00ffff");
const jugador2 = new Personaje(2, "Neon", espadaBase, curacion, escudo, 480, 200, "#ff33cc");
const proyectiles = [];
const estadoTeclas = {};
window.addEventListener("keydown", (e) => {
    estadoTeclas[e.key] = true;
    if (e.key === " ")
        jugador1.disparar(proyectiles);
    if (e.key === "Enter")
        jugador2.disparar(proyectiles);
});
window.addEventListener("keyup", (e) => { estadoTeclas[e.key] = false; });
window.accionP1 = (tipo) => {
    if (tipo === 'atacar')
        jugador1.disparar(proyectiles);
    if (tipo === 'curar')
        jugador1.curarse();
    if (tipo === 'escudo')
        jugador1.activarEscudo();
};
window.accionP2 = (tipo) => {
    if (tipo === 'atacar')
        jugador2.disparar(proyectiles);
    if (tipo === 'curar')
        jugador2.curarse();
    if (tipo === 'escudo')
        jugador2.activarEscudo();
};
function configurarBotonLateral(id, teclaSimulada) {
    const btn = document.getElementById(id);
    if (!btn)
        return;
    btn.addEventListener("mousedown", () => { estadoTeclas[teclaSimulada] = true; });
    btn.addEventListener("mouseup", () => { estadoTeclas[teclaSimulada] = false; });
    btn.addEventListener("mouseleave", () => { estadoTeclas[teclaSimulada] = false; });
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); estadoTeclas[teclaSimulada] = true; });
    btn.addEventListener("touchend", (e) => { e.preventDefault(); estadoTeclas[teclaSimulada] = false; });
}
configurarBotonLateral("p1Arriba", "w");
configurarBotonLateral("p1Abajo", "s");
configurarBotonLateral("p1Izq", "a");
configurarBotonLateral("p1Der", "d");
configurarBotonLateral("p2Arriba", "ArrowUp");
configurarBotonLateral("p2Abajo", "ArrowDown");
configurarBotonLateral("p2Izq", "ArrowLeft");
configurarBotonLateral("p2Der", "ArrowRight");
// Bucle de juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#080708";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let dirX1 = 0, dirY1 = 0;
    if (estadoTeclas["a"] || estadoTeclas["A"])
        dirX1 = -1;
    if (estadoTeclas["d"] || estadoTeclas["D"])
        dirX1 = 1;
    if (estadoTeclas["w"] || estadoTeclas["W"])
        dirY1 = -1;
    if (estadoTeclas["s"] || estadoTeclas["S"])
        dirY1 = 1;
    jugador1.mover(dirX1, dirY1, canvas.width, canvas.height);
    let dirX2 = 0, dirY2 = 0;
    if (estadoTeclas["ArrowLeft"])
        dirX2 = -1;
    if (estadoTeclas["ArrowRight"])
        dirX2 = 1;
    if (estadoTeclas["ArrowUp"])
        dirY2 = -1;
    if (estadoTeclas["ArrowDown"])
        dirY2 = 1;
    jugador2.mover(dirX2, dirY2, canvas.width, canvas.height);
    for (let i = proyectiles.length - 1; i >= 0; i--) {
        const p = proyectiles[i];
        p.actualizar(canvas.width, canvas.height);
        p.dibujar(ctx);
        if (p.activo) {
            if (p.duenioId === 1 && Math.hypot(p.x - jugador2.x, p.y - jugador2.y) < 22) {
                jugador2.recibirDanio(jugador1.arma.danio);
                p.activo = false;
                if (!jugador2.viva)
                    jugador1.puntaje += 100;
            }
            if (p.duenioId === 2 && Math.hypot(p.x - jugador1.x, p.y - jugador1.y) < 22) {
                jugador1.recibirDanio(jugador2.arma.danio);
                p.activo = false;
                if (!jugador1.viva)
                    jugador2.puntaje += 100;
            }
        }
        if (!p.activo)
            proyectiles.splice(i, 1);
    }
    jugador1.dibujar(ctx);
    jugador2.dibujar(ctx);
    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`Puntaje P1: ${jugador1.puntaje}`, 20, 25);
    ctx.fillStyle = "#ff33cc";
    ctx.fillText(`Puntaje P2: ${jugador2.puntaje}`, canvas.width - 130, 25);
    requestAnimationFrame(gameLoop);
}
gameLoop();
