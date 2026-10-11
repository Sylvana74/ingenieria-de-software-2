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
    reproducirEspecial() {
        this.inicializar();
        if (!this.ctxAudio)
            return;
        const osc = this.ctxAudio.createOscillator();
        const gain = this.ctxAudio.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, this.ctxAudio.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, this.ctxAudio.currentTime + 0.5);
        gain.gain.setValueAtTime(0.2, this.ctxAudio.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctxAudio.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctxAudio.destination);
        osc.start();
        osc.stop(this.ctxAudio.currentTime + 0.5);
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
// CLASES BASE
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
// ESPINA / PÚA
// ============================================
class Espina {
    x;
    y;
    dx;
    dy;
    activo = true;
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    actualizar(maxX, maxY) {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > maxX || this.y < 0 || this.y > maxY) {
            this.activo = false;
        }
    }
    dibujar(ctx) {
        ctx.save();
        ctx.strokeStyle = "#ff0055";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#ff5588";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
// ============================================
// PROYECTIL Y BOLA DE ESPINAS ESPECIAL
// ============================================
class Proyectil {
    x;
    y;
    dx;
    dy;
    color;
    duenioId;
    activo = true;
    esEspecial = false;
    faseEspinas = 0;
    temporizadorRondas = 0;
    rondasEjecutadas = 0;
    espinasActivas = [];
    constructor(x, y, dx, dy, color, duenioId, especial = false) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.duenioId = duenioId;
        this.esEspecial = especial;
    }
    actualizar(maxX, maxY) {
        if (!this.esEspecial || this.faseEspinas === 0) {
            this.x += this.dx;
            this.y += this.dy;
            if (this.x < 0 || this.x > maxX || this.y < 0 || this.y > maxY)
                this.activo = false;
            if (this.esEspecial && (Math.abs(this.x - (this.duenioId === 1 ? 120 : 480)) > 160)) {
                this.dx = 0;
                this.dy = 0;
                this.faseEspinas = 1;
            }
        }
        else if (this.faseEspinas === 1) {
            this.temporizadorRondas++;
            if (this.temporizadorRondas >= 40) {
                this.temporizadorRondas = 0;
                this.rondasEjecutadas++;
                for (let i = 0; i < 8; i++) {
                    const angulo = (i * Math.PI / 4);
                    const velocidadEspina = 4;
                    const espinaDx = Math.cos(angulo) * velocidadEspina;
                    const espinaDy = Math.sin(angulo) * velocidadEspina;
                    this.espinasActivas.push(new Espina(this.x, this.y, espinaDx, espinaDy));
                }
                if (this.rondasEjecutadas >= 3) {
                    this.faseEspinas = 2;
                }
            }
        }
        for (let i = this.espinasActivas.length - 1; i >= 0; i--) {
            this.espinasActivas[i].actualizar(maxX, maxY);
            if (!this.espinasActivas[i].activo) {
                this.espinasActivas.splice(i, 1);
            }
        }
        if (this.faseEspinas === 2 && this.espinasActivas.length === 0) {
            this.activo = false;
        }
    }
    dibujar(ctx) {
        ctx.save();
        ctx.shadowBlur = this.esEspecial ? 25 : 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.esEspecial ? 10 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        for (let espina of this.espinasActivas) {
            espina.dibujar(ctx);
        }
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
    posXInicial;
    posYInicial;
    colorCuerpo;
    x;
    y;
    vida = 100;
    vidasRestantes = 3;
    viva = true;
    direccionX = 1;
    tieneEscudo = false;
    murcielagos = [];
    // Cooldowns (milisegundos)
    ultimoAtaque = 0;
    ultimaCuracion = 0;
    ultimoEscudo = 0;
    tiempoRecargaAtaque = 1200; // 1.2s
    tiempoRecargaHabilidad = 4000; // 4.0s
    golpesAcertados = 0;
    habilidadEspecialLista = false;
    constructor(id, nombre, arma, habilidadCuracion, habilidadEscudo, posXInicial, posYInicial, colorCuerpo) {
        this.id = id;
        this.nombre = nombre;
        this.arma = arma;
        this.habilidadCuracion = habilidadCuracion;
        this.habilidadEscudo = habilidadEscudo;
        this.posXInicial = posXInicial;
        this.posYInicial = posYInicial;
        this.colorCuerpo = colorCuerpo;
        this.x = posXInicial;
        this.y = posYInicial;
    }
    verificarImpacto(px, py) {
        if (!this.viva)
            return { golpeado: false, esCritico: false };
        // Hitbox Cabeza (Crítico)
        const distanciaCabeza = Math.hypot(px - this.x, py - (this.y - 25));
        if (distanciaCabeza <= 11)
            return { golpeado: true, esCritico: true };
        // Hitbox Cuerpo
        if (px >= this.x - 10 && px <= this.x + 10 && py >= this.y - 15 && py <= this.y + 11) {
            return { golpeado: true, esCritico: false };
        }
        return { golpeado: false, esCritico: false };
    }
    recibirDanio(danio, esCritico = false) {
        if (!this.viva)
            return;
        if (this.tieneEscudo) {
            this.tieneEscudo = false;
            sfx.reproducirEscudo();
            registrarLog(`P${this.id} (${this.nombre}): El escudo absorbió el daño`);
            return;
        }
        const danioFinal = esCritico ? danio * 1.5 : danio;
        this.vida -= Math.round(danioFinal);
        sfx.reproducirGolpe();
        if (esCritico) {
            registrarLog(`🎯 ¡GOLPE CRÍTICO A LA CABEZA! P${this.id} recibe ${Math.round(danioFinal)} de daño.`);
        }
        else {
            registrarLog(`P${this.id} (${this.nombre}) recibe ${danio} de daño. HP: ${this.vida}`);
        }
        if (this.vida <= 0) {
            this.vida = 0;
            this.viva = false;
            this.vidasRestantes--;
            registrarLog(`P${this.id} (${this.nombre}) ha muerto. Vidas restantes: ${this.vidasRestantes}`);
            for (let i = 0; i < 3; i++) {
                this.murcielagos.push(new Murcielago(this.x, this.y));
            }
            sfx.decirDerrota();
            if (this.vidasRestantes > 0) {
                setTimeout(() => {
                    this.vida = 100;
                    this.viva = true;
                    this.x = this.posXInicial;
                    this.y = this.posYInicial;
                    this.murcielagos = [];
                    this.golpesAcertados = 0;
                    this.habilidadEspecialLista = false;
                    registrarLog(`P${this.id} (${this.nombre}) ha reaparecido.`);
                }, 2500);
            }
        }
    }
    disparar(proyectiles) {
        if (!this.viva)
            return false;
        const ahora = Date.now();
        if (ahora - this.ultimoAtaque < this.tiempoRecargaAtaque)
            return false;
        this.ultimoAtaque = ahora;
        registrarLog(`P${this.id} (${this.nombre}) ataca:`);
        this.arma.atacar();
        sfx.reproducirDisparo();
        proyectiles.push(new Proyectil(this.x, this.y - 15, this.direccionX * 7, 0, this.colorCuerpo, this.id, false));
        return true;
    }
    dispararEspecial(proyectiles) {
        if (!this.viva || !this.habilidadEspecialLista)
            return false;
        this.habilidadEspecialLista = false;
        this.golpesAcertados = 0;
        registrarLog(`✨ ¡P${this.id} (${this.nombre}) LANZA BOLA DE ESPINAS!`);
        sfx.reproducirEspecial();
        proyectiles.push(new Proyectil(this.x, this.y - 15, this.direccionX * 5, 0, "#ff0055", this.id, true));
        return true;
    }
    curarse() {
        if (!this.viva)
            return false;
        const ahora = Date.now();
        if (ahora - this.ultimaCuracion < this.tiempoRecargaHabilidad)
            return false;
        this.ultimaCuracion = ahora;
        registrarLog(`P${this.id} (${this.nombre}) utiliza habilidad:`);
        this.habilidadCuracion.usar();
        sfx.reproducirCuracion();
        this.vida += 25;
        if (this.vida > 100)
            this.vida = 100;
        registrarLog(`P${this.id} se curó. HP actual: ${this.vida}`);
        return true;
    }
    activarEscudo() {
        if (!this.viva)
            return false;
        const ahora = Date.now();
        if (ahora - this.ultimoEscudo < this.tiempoRecargaHabilidad)
            return false;
        this.ultimoEscudo = ahora;
        registrarLog(`P${this.id} (${this.nombre}) utiliza habilidad:`);
        this.habilidadEscudo.usar();
        sfx.reproducirEscudo();
        this.tieneEscudo = true;
        registrarLog(`P${this.id} activó Escudo protector`);
        return true;
    }
    registrarAciertoGolpe() {
        if (this.habilidadEspecialLista)
            return;
        this.golpesAcertados++;
        registrarLog(`P${this.id} progreso habilidad especial: ${this.golpesAcertados}/3 golpes`);
        if (this.golpesAcertados >= 3) {
            this.habilidadEspecialLista = true;
            registrarLog(`🔥 ¡HABILIDAD ESPECIAL DE ESPINAS LISTA PARA P${this.id}!`);
        }
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
        // Cabeza
        ctx.fillStyle = "#ffb703";
        ctx.beginPath();
        ctx.arc(this.x, this.y - 25, 11, 0, Math.PI * 2);
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
        ctx.fillText(`P${this.id}: ${this.nombre}`, this.x - 30, this.y - 45);
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
// Control estricto de eventos para evitar que se queden trabadas las teclas
window.addEventListener("keydown", (e) => {
    if (e.repeat)
        return; // Evita disparos automáticos al mantener presionada la barra espaciadora o enter
    // Jugador 1 Teclas
    if (e.code === "Space") {
        e.preventDefault();
        jugador1.disparar(proyectiles);
    }
    if (e.key === "f" || e.key === "F")
        jugador1.dispararEspecial(proyectiles);
    if (e.key === "c" || e.key === "C")
        jugador1.curarse();
    if (e.key === "e" || e.key === "E")
        jugador1.activarEscudo();
    // Jugador 2 Teclas
    if (e.key === "Enter") {
        e.preventDefault();
        jugador2.disparar(proyectiles);
    }
    if (e.key === "l" || e.key === "L")
        jugador2.dispararEspecial(proyectiles);
    if (e.key === "Shift")
        jugador2.curarse();
    if (e.key === "p" || e.key === "P")
        jugador2.activarEscudo();
    estadoTeclas[e.key] = true;
    estadoTeclas[e.code] = true;
});
window.addEventListener("keyup", (e) => {
    estadoTeclas[e.key] = false;
    estadoTeclas[e.code] = false;
});
// Limpiar estado si la ventana pierde el foco
window.addEventListener("blur", () => {
    for (let k in estadoTeclas)
        estadoTeclas[k] = false;
});
window.accionP1 = (tipo) => {
    if (tipo === 'atacar')
        jugador1.disparar(proyectiles);
    if (tipo === 'especial')
        jugador1.dispararEspecial(proyectiles);
    if (tipo === 'curar')
        jugador1.curarse();
    if (tipo === 'escudo')
        jugador1.activarEscudo();
};
window.accionP2 = (tipo) => {
    if (tipo === 'atacar')
        jugador2.disparar(proyectiles);
    if (tipo === 'especial')
        jugador2.dispararEspecial(proyectiles);
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
// Actualización visual de los botones de la interfaz HTML en tiempo real
function actualizarBotonesUI() {
    const ahora = Date.now();
    // JUGADOR 1
    const btnP1Atk = document.getElementById("btnP1Atacar");
    const cdAtk1 = jugador1.tiempoRecargaAtaque - (ahora - jugador1.ultimoAtaque);
    if (cdAtk1 > 0) {
        btnP1Atk.disabled = true;
        btnP1Atk.innerText = `Atacar (${(cdAtk1 / 1000).toFixed(1)}s)`;
    }
    else {
        btnP1Atk.disabled = false;
        btnP1Atk.innerText = "⚔️ Atacar";
    }
    const btnP1Esp = document.getElementById("btnP1Especial");
    if (jugador1.habilidadEspecialLista) {
        btnP1Esp.disabled = false;
        btnP1Esp.innerText = "✨ ¡Especial (F)!";
    }
    else {
        btnP1Esp.disabled = true;
        btnP1Esp.innerText = `Especial (${jugador1.golpesAcertados}/3)`;
    }
    const btnP1Cur = document.getElementById("btnP1Curar");
    const cdHab1 = jugador1.tiempoRecargaHabilidad - (ahora - jugador1.ultimaCuracion);
    if (cdHab1 > 0) {
        btnP1Cur.disabled = true;
        btnP1Cur.innerText = `Curar (${(cdHab1 / 1000).toFixed(1)}s)`;
    }
    else {
        btnP1Cur.disabled = false;
        btnP1Cur.innerText = "🧪 Curación";
    }
    const btnP1Esc = document.getElementById("btnP1Escudo");
    const cdEsc1 = jugador1.tiempoRecargaHabilidad - (ahora - jugador1.ultimoEscudo);
    if (cdEsc1 > 0) {
        btnP1Esc.disabled = true;
        btnP1Esc.innerText = `Escudo (${(cdEsc1 / 1000).toFixed(1)}s)`;
    }
    else {
        btnP1Esc.disabled = false;
        btnP1Esc.innerText = "🛡️ Escudo";
    }
    // JUGADOR 2
    const btnP2Atk = document.getElementById("btnP2Atacar");
    const cdAtk2 = jugador2.tiempoRecargaAtaque - (ahora - jugador2.ultimoAtaque);
    if (cdAtk2 > 0) {
        btnP2Atk.disabled = true;
        btnP2Atk.innerText = `Atacar (${(cdAtk2 / 1000).toFixed(1)}s)`;
    }
    else {
        btnP2Atk.disabled = false;
        btnP2Atk.innerText = "⚔️ Atacar";
    }
    const btnP2Esp = document.getElementById("btnP2Especial");
    if (jugador2.habilidadEspecialLista) {
        btnP2Esp.disabled = false;
        btnP2Esp.innerText = "✨ ¡Especial (L)!";
    }
    else {
        btnP2Esp.disabled = true;
        btnP2Esp.innerText = `Especial (${jugador2.golpesAcertados}/3)`;
    }
    const btnP2Cur = document.getElementById("btnP2Curar");
    const cdHab2 = jugador2.tiempoRecargaHabilidad - (ahora - jugador2.ultimaCuracion);
    if (cdHab2 > 0) {
        btnP2Cur.disabled = true;
        btnP2Cur.innerText = `Curar (${(cdHab2 / 1000).toFixed(1)}s)`;
    }
    else {
        btnP2Cur.disabled = false;
        btnP2Cur.innerText = "🧪 Curación";
    }
    const btnP2Esc = document.getElementById("btnP2Escudo");
    const cdEsc2 = jugador2.tiempoRecargaHabilidad - (ahora - jugador2.ultimoEscudo);
    if (cdEsc2 > 0) {
        btnP2Esc.disabled = true;
        btnP2Esc.innerText = `Escudo (${(cdEsc2 / 1000).toFixed(1)}s)`;
    }
    else {
        btnP2Esc.disabled = false;
        btnP2Esc.innerText = "🛡️ Escudo";
    }
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#080708";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Movimiento P1 (WASD)
    let dirX1 = 0, dirY1 = 0;
    if (estadoTeclas["a"] || estadoTeclas["A"] || estadoTeclas["ArrowLeft"] && false)
        dirX1 = -1; // Seguro antisubversión
    if (estadoTeclas["a"] || estadoTeclas["A"])
        dirX1 = -1;
    if (estadoTeclas["d"] || estadoTeclas["D"])
        dirX1 = 1;
    if (estadoTeclas["w"] || estadoTeclas["W"])
        dirY1 = -1;
    if (estadoTeclas["s"] || estadoTeclas["S"])
        dirY1 = 1;
    jugador1.mover(dirX1, dirY1, canvas.width, canvas.height);
    // Movimiento P2 (Flechas)
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
    // Actualizar botones de interfaz
    actualizarBotonesUI();
    for (let i = proyectiles.length - 1; i >= 0; i--) {
        const p = proyectiles[i];
        p.actualizar(canvas.width, canvas.height);
        p.dibujar(ctx);
        if (p.activo) {
            if (p.duenioId === 1) {
                // Verificar impacto de las espinas de la habilidad especial con la hitbox (cabeza o cuerpo) de P2
                for (let espina of p.espinasActivas) {
                    if (espina.activo) {
                        const impactoEspina = jugador2.verificarImpacto(espina.x, espina.y);
                        if (impactoEspina.golpeado) {
                            jugador2.recibirDanio(10, impactoEspina.esCritico);
                            espina.activo = false;
                        }
                    }
                }
                // Verificar proyectil normal de P1
                const impacto = jugador2.verificarImpacto(p.x, p.y);
                if (impacto.golpeado && !p.esEspecial) {
                    jugador2.recibirDanio(jugador1.arma.danio, impacto.esCritico);
                    p.activo = false;
                    jugador1.registrarAciertoGolpe();
                }
            }
            if (p.duenioId === 2) {
                // Verificar impacto de las espinas de la habilidad especial con la hitbox de P1
                for (let espina of p.espinasActivas) {
                    if (espina.activo) {
                        const impactoEspina = jugador1.verificarImpacto(espina.x, espina.y);
                        if (impactoEspina.golpeado) {
                            jugador1.recibirDanio(10, impactoEspina.esCritico);
                            espina.activo = false;
                        }
                    }
                }
                // Verificar proyectil normal de P2
                const impacto = jugador1.verificarImpacto(p.x, p.y);
                if (impacto.golpeado && !p.esEspecial) {
                    jugador1.recibirDanio(jugador2.arma.danio, impacto.esCritico);
                    p.activo = false;
                    jugador2.registrarAciertoGolpe();
                }
            }
        }
        if (!p.activo)
            proyectiles.splice(i, 1);
    }
    jugador1.dibujar(ctx);
    jugador2.dibujar(ctx);
    // Textos de Vidas en pantalla
    ctx.fillStyle = "#00ffff";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`Vidas P1: ${"❤️".repeat(jugador1.vidasRestantes)}`, 20, 25);
    ctx.fillStyle = "#ff33cc";
    ctx.fillText(`Vidas P2: ${"❤️".repeat(jugador2.vidasRestantes)}`, canvas.width - 150, 25);
    requestAnimationFrame(gameLoop);
}
gameLoop();
