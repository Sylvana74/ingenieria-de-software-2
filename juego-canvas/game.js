"use strict";
// ============================================
// ARMA
// ============================================
class Arma {
    nombre;
    danio;
    constructor(nombre, danio) {
        this.nombre = nombre;
        this.danio = danio;
    }
    atacar() {
        console.log(`⚔️ Ataque con ${this.nombre}: ${this.danio} puntos de daño`);
    }
    getDanio() {
        return this.danio;
    }
    getNombre() {
        return this.nombre;
    }
}
// ============================================
// HABILIDAD
// ============================================
class Habilidad {
    nombre;
    poder;
    constructor(nombre, poder) {
        this.nombre = nombre;
        this.poder = poder;
    }
    usar() {
        console.log(`✨ Se utiliza ${this.nombre}: ${this.poder} puntos de poder`);
    }
    getNombre() {
        return this.nombre;
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
    // Coordenadas de posición y velocidad para el movimiento
    x;
    y;
    velocidad = 4;
    constructor(nombre, vida, arma, habilidad, posX, posY) {
        this.nombre = nombre;
        this.vida = vida;
        this.arma = arma;
        this.habilidad = habilidad;
        this.x = posX;
        this.y = posY;
    }
    atacar() {
        console.log(`${this.nombre} ataca:`);
        this.arma.atacar();
    }
    usarHabilidad() {
        console.log(`${this.nombre} utiliza una habilidad:`);
        this.habilidad.usar();
    }
    cambiarArma(nuevaArma) {
        this.arma = nuevaArma;
        console.log(`${this.nombre} ahora utiliza ${nuevaArma.getNombre()}`);
    }
    cambiarHabilidad(nuevaHabilidad) {
        this.habilidad = nuevaHabilidad;
        console.log(`${this.nombre} ahora usa la habilidad ${nuevaHabilidad.getNombre()}`);
    }
    recibirDanio(danio) {
        this.vida -= danio;
        console.log(`${this.nombre} recibió ${danio} puntos de daño.`);
        console.log(`Vida restante: ${this.vida}`);
    }
    // Métodos de movimiento dentro del canvas
    mover(direccion, maxX, maxY) {
        if (direccion === "ARRIBA" && this.y > 40)
            this.y -= this.velocidad;
        if (direccion === "ABAJO" && this.y < maxY - 40)
            this.y += this.velocidad;
        if (direccion === "IZQUIERDA" && this.x > 40)
            this.x -= this.velocidad;
        if (direccion === "DERECHA" && this.x < maxX - 40)
            this.x += this.velocidad;
    }
    // ============================================
    // RENDERIZADO GRÁFICO (HTML5 Canvas)
    // ============================================
    dibujar(ctx) {
        // 1. Dibujar efecto visual según la Habilidad equipada
        const nombreHabilidad = this.habilidad.getNombre();
        ctx.lineWidth = 3;
        if (nombreHabilidad.includes("Curación")) {
            ctx.strokeStyle = "#2ec4b6";
            ctx.fillStyle = "rgba(46, 196, 182, 0.2)";
        }
        else {
            ctx.strokeStyle = "#f72585";
            ctx.fillStyle = "rgba(247, 37, 133, 0.2)";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 2. Dibujar el cuerpo del Personaje
        ctx.fillStyle = "#3a86ff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1d3557";
        ctx.stroke();
        // 3. Dibujar gráficamente el Arma equipada
        const nombreArma = this.arma.getNombre();
        ctx.lineWidth = 4;
        if (nombreArma.includes("Espada")) {
            ctx.strokeStyle = "#e71d36";
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y);
            ctx.lineTo(this.x + 45, this.y - 20);
            ctx.stroke();
        }
        else {
            ctx.strokeStyle = "#ffb703";
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y, 15, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
        }
        // 4. Textos informativos flotantes sobre el personaje
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px sans-serif";
        ctx.fillText(`${this.nombre}`, this.x - 30, this.y - 55);
        ctx.fillText(`Arma: ${this.arma.getNombre()}`, this.x - 55, this.y + 60);
        ctx.fillText(`Habilidad: ${this.habilidad.getNombre()}`, this.x - 55, this.y + 78);
    }
}
// ============================================
// CONFIGURACIÓN DE OBJETOS Y JUEGO
// ============================================
const espada = new Arma("Espada de fuego", 30);
const arco = new Arma("Arco mágico", 20);
const curacion = new Habilidad("Curación", 25);
const escudo = new Habilidad("Escudo mágico", 15);
// Creamos al héroe en el centro del canvas (ancho 600, alto 400)
const heroe = new Personaje("Guerrero Principal", 100, espada, curacion, 300, 200);
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Control de teclas presionadas para movimiento fluido
const teclasPresionadas = {};
window.addEventListener("keydown", (e) => {
    teclasPresionadas[e.key] = true;
    // Cambios de arma y habilidad en tiempo real con teclas numéricas
    if (e.key === "1")
        heroe.cambiarArma(espada);
    if (e.key === "2")
        heroe.cambiarArma(arco);
    if (e.key === "3")
        heroe.cambiarHabilidad(curacion);
    if (e.key === "4")
        heroe.cambiarHabilidad(escudo);
});
window.addEventListener("keyup", (e) => {
    teclasPresionadas[e.key] = false;
});
// Bucle principal del juego (Game Loop)
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fondo de pantalla
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Procesar movimiento según las teclas presionadas
    if (teclasPresionadas["ArrowUp"] || teclasPresionadas["w"])
        heroe.mover("ARRIBA", canvas.width, canvas.height);
    if (teclasPresionadas["ArrowDown"] || teclasPresionadas["s"])
        heroe.mover("ABAJO", canvas.width, canvas.height);
    if (teclasPresionadas["ArrowLeft"] || teclasPresionadas["a"])
        heroe.mover("IZQUIERDA", canvas.width, canvas.height);
    if (teclasPresionadas["ArrowRight"] || teclasPresionadas["d"])
        heroe.mover("DERECHA", canvas.width, canvas.height);
    // Dibujar al personaje en su posición actual
    heroe.dibujar(ctx);
    requestAnimationFrame(gameLoop);
}
gameLoop();
