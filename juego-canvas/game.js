"use strict";
// ============================================
// SISTEMA DE AUDIO NATIVO (Efectos de ruido / Sonidos)
// ============================================
class GeneradorSonido {
    ctxAudio = null;
    inicializar() {
        if (!this.ctxAudio) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctxAudio = new AudioCtx();
        }
        if (this.ctxAudio.state === 'suspended') {
            this.ctxAudio.resume();
        }
    }
    reproducirLaser() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, this.ctxAudio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctxAudio.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.15);
    }
    reproducirArco() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctxAudio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctxAudio.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.2);
    }
    reproducirSanacion() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        [440, 554.37, 659.25].forEach((freq, i) => {
            const osc = this.ctxAudio.createOscillator();
            const gain = this.ctxAudio.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctxAudio.currentTime + (i * 0.08));
            gain.gain.setValueAtTime(0.08, this.ctxAudio.currentTime + (i * 0.08));
            gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + (i * 0.08) + 0.25);
            osc.connect(gain);
            gain.connect(this.ctxAudio.destination);
            osc.start(this.ctxAudio.currentTime + (i * 0.08));
            osc.stop(this.ctxAudio.currentTime + (i * 0.08) + 0.25);
        });
    }
    reproducirEscudo() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.ctxAudio.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.ctxAudio.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.3);
    }
    reproducirDisparoLuz() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctxAudio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctxAudio.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.25);
    }
}
const sfx = new GeneradorSonido();
// ============================================
// ARMA Y HABILIDAD (Cátedra)
// ============================================
class Arma {
    nombre;
    danio;
    constructor(nombre, danio) {
        this.nombre = nombre;
        this.danio = danio;
    }
    atacar() { console.log(`⚔️ Ataque con ${this.nombre}: ${this.danio} puntos de daño`); }
    getDanio() { return this.danio; }
    getNombre() { return this.nombre; }
}
class Habilidad {
    nombre;
    poder;
    constructor(nombre, poder) {
        this.nombre = nombre;
        this.poder = poder;
    }
    usar() { console.log(`✨ Se utiliza ${this.nombre}: ${this.poder} puntos de poder`); }
    getNombre() { return this.nombre; }
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
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }
    actualizar() {
        this.x += this.dx;
        this.y += this.dy;
    }
    dibujar(ctx) {
        ctx.save();
        ctx.shadowBlur = 15;
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
    nombre;
    vida;
    arma;
    habilidad;
    x;
    y;
    velocidad = 4;
    direccionX = 1;
    direccionY = 0;
    constructor(nombre, vida, arma, habilidad, posX, posY) {
        this.nombre = nombre;
        this.vida = vida;
        this.arma = arma;
        this.habilidad = habilidad;
        this.x = posX;
        this.y = posY;
    }
    atacar(proyectiles) {
        this.arma.atacar();
        sfx.reproducirDisparoLuz();
        const colorProyectil = this.arma.getNombre().includes("plasma") ? "#00ffcc" : "#ff00ff";
        proyectiles.push(new Proyectil(this.x, this.y, this.direccionX * 8, this.direccionY * 8, colorProyectil));
    }
    usarHabilidad() { this.habilidad.usar(); }
    cambiarArma(nuevaArma) {
        this.arma = nuevaArma;
        if (nuevaArma.getNombre().includes("plasma")) {
            sfx.reproducirLaser();
        }
        else {
            sfx.reproducirArco();
        }
        console.log(`${this.nombre} ahora utiliza ${nuevaArma.getNombre()}`);
    }
    cambiarHabilidad(nuevaHabilidad) {
        this.habilidad = nuevaHabilidad;
        if (nuevaHabilidad.getNombre().includes("Sanación")) {
            sfx.reproducirSanacion();
        }
        else {
            sfx.reproducirEscudo();
        }
        console.log(`${this.nombre} ahora usa la habilidad ${nuevaHabilidad.getNombre()}`);
    }
    mover(dirX, dirY, maxX, maxY) {
        if (dirX !== 0 || dirY !== 0) {
            this.direccionX = dirX !== 0 ? dirX : this.direccionX;
            this.direccionY = dirY;
        }
        this.x += dirX * this.velocidad;
        this.y += dirY * this.velocidad;
        if (this.x < 30)
            this.x = 30;
        if (this.x > maxX - 30)
            this.x = maxX - 30;
        if (this.y < 40)
            this.y = 40;
        if (this.y > maxY - 40)
            this.y = maxY - 40;
    }
    dibujar(ctx) {
        const nombreHabilidad = this.habilidad.getNombre();
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = nombreHabilidad.includes("Sanación") ? "#00ff88" : "#ff3366";
        ctx.lineWidth = 2;
        ctx.strokeStyle = nombreHabilidad.includes("Sanación") ? "#00ff88" : "#ff3366";
        ctx.fillStyle = nombreHabilidad.includes("Sanación") ? "rgba(0, 255, 136, 0.1)" : "rgba(255, 51, 102, 0.1)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // Personaje Humanoide
        ctx.fillStyle = "#2b2d42";
        ctx.fillRect(this.x - 12, this.y - 12, 24, 28);
        ctx.strokeStyle = "#8d99ae";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 12, this.y - 12, 24, 28);
        ctx.fillStyle = "#ffb703";
        ctx.beginPath();
        ctx.arc(this.x, this.y - 24, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#d90429";
        ctx.beginPath();
        ctx.arc(this.x, this.y - 28, 10, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#1d3557";
        ctx.fillRect(this.x - 10, this.y + 16, 8, 14);
        ctx.fillRect(this.x + 2, this.y + 16, 8, 14);
        const nombreArma = this.arma.getNombre();
        ctx.save();
        ctx.shadowBlur = 15;
        if (nombreArma.includes("plasma")) {
            ctx.shadowColor = "#00ffcc";
            ctx.strokeStyle = "#00ffcc";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.x + (this.direccionX * 10), this.y);
            ctx.lineTo(this.x + (this.direccionX * 35), this.y - 20);
            ctx.stroke();
        }
        else {
            ctx.shadowColor = "#ff00ff";
            ctx.strokeStyle = "#ff00ff";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x + (this.direccionX * 15), this.y, 16, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px sans-serif";
        ctx.fillText(`${this.nombre}`, this.x - 30, this.y - 50);
        ctx.fillStyle = "#00ffcc";
        ctx.fillText(`Arma: ${this.arma.getNombre()}`, this.x - 65, this.y + 50);
        ctx.fillStyle = "#ff00ff";
        ctx.fillText(`Habilidad: ${this.habilidad.getNombre()}`, this.x - 65, this.y + 66);
    }
}
// ============================================
// CONFIGURACIÓN Y BUCLE PRINCIPAL
// ============================================
const espada = new Arma("Espada de plasma flúor", 30);
const arco = new Arma("Arco láser neón", 20);
const curacion = new Habilidad("Sanación Cuántica", 25);
const escudo = new Habilidad("Barrera de Iones", 15);
const heroe = new Personaje("Guerrero Cyber", 100, espada, curacion, 300, 175);
const proyectiles = [];
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const estadoTeclas = {};
window.addEventListener("keydown", (e) => { estadoTeclas[e.key] = true; });
window.addEventListener("keyup", (e) => { estadoTeclas[e.key] = false; });
// Conexión con los botones de la interfaz
window.cambiarArmaEspada = () => heroe.cambiarArma(espada);
window.cambiarArmaArco = () => heroe.cambiarArma(arco);
window.cambiarHabCuracion = () => heroe.cambiarHabilidad(curacion);
window.cambiarHabEscudo = () => heroe.cambiarHabilidad(escudo);
window.dispararLuz = () => {
    heroe.atacar(proyectiles);
    heroe.usarHabilidad();
};
function configurarBoton(id, teclaSimulada) {
    const btn = document.getElementById(id);
    if (!btn)
        return;
    btn.addEventListener("mousedown", () => { estadoTeclas[teclaSimulada] = true; });
    btn.addEventListener("mouseup", () => { estadoTeclas[teclaSimulada] = false; });
    btn.addEventListener("mouseleave", () => { estadoTeclas[teclaSimulada] = false; });
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); estadoTeclas[teclaSimulada] = true; });
    btn.addEventListener("touchend", (e) => { e.preventDefault(); estadoTeclas[teclaSimulada] = false; });
}
configurarBoton("btnArriba", "ArrowUp");
configurarBoton("btnAbajo", "ArrowDown");
configurarBoton("btnIzquierda", "ArrowLeft");
configurarBoton("btnDerecha", "ArrowRight");
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0b090a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let dirX = 0;
    let dirY = 0;
    if (estadoTeclas["ArrowUp"] || estadoTeclas["w"] || estadoTeclas["W"])
        dirY = -1;
    if (estadoTeclas["ArrowDown"] || estadoTeclas["s"] || estadoTeclas["S"])
        dirY = 1;
    if (estadoTeclas["ArrowLeft"] || estadoTeclas["a"] || estadoTeclas["A"])
        dirX = -1;
    if (estadoTeclas["ArrowRight"] || estadoTeclas["d"] || estadoTeclas["D"])
        dirX = 1;
    heroe.mover(dirX, dirY, canvas.width, canvas.height);
    for (let i = proyectiles.length - 1; i >= 0; i--) {
        proyectiles[i].actualizar();
        proyectiles[i].dibujar(ctx);
        if (proyectiles[i].x < 0 || proyectiles[i].x > canvas.width || proyectiles[i].y < 0 || proyectiles[i].y > canvas.height) {
            proyectiles.splice(i, 1);
        }
    }
    heroe.dibujar(ctx);
    requestAnimationFrame(gameLoop);
}
gameLoop();
