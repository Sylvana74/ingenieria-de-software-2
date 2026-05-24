/**
 * Test: POST /api/auth/login
 */
 testUtils.createTestButton("Test Login Correcto (Pepe y 12345)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Password Incorrecto (Pepe y 123)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '123' })
    });

    const data = await response.json();
    testUtils.log(data);

    // CORRECCIÓN OFICIAL: Cambiamos response.ok por la validación del estado 401
    if (response.status === 401) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Usuario Inexistente", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'usuario_fantasma_123', password: 'password123' })
    });

    const data = await response.json();
    testUtils.log(data);

    // CORRECCIÓN OFICIAL: Si el servidor lo rechaza correctamente, el test pasa a verde
    if (response.status === 401) {
        testUtils.setSuccess(btn);
    }
});
/**
 * Parte II - 1. Pruebas de Autenticación: Registro de Usuarios
 */
testUtils.createTestButton("Test Registro - Usuario Nuevo", async (btn) => {
    // Generamos un número único en base a los milisegundos de la fecha actual
    const timestamp = Date.now();
    const usuarioDinamico = `user_${timestamp}`;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: usuarioDinamico, 
            password: 'passwordSeguro123' 
        })
    });

    const data = await response.json();
    
    // Mostramos en la consola del sistema el nombre mutado que se creó
    console.log(`🤖 Intentando registrar: ${usuarioDinamico}`);
    testUtils.log(data);

    // Si el código es 201 Created, el objetivo se cumplió limpiamente
    if (response.status === 201) {
        testUtils.setSuccess(btn);
        console.log("=========================================");
        console.log("🔥 ¡USUARIO DINÁMICO REGISTRADO CON ÉXITO! 🔥");
        console.log("=========================================");
    }
});
/**
 * Parte II - 2. Pruebas de Seguridad: El Intruso (403 Forbidden)
 */
testUtils.createTestButton("Test Seguridad - Productor accediendo a Admin", async (btn) => {
    // Asegurar Sesión: Iniciamos llamando a okLogin() para simular que somos 'pepe' (Producer)
    const token = await okLogin(); 
    
    // Intentamos ingresar a una ruta exclusiva de administradores
    const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Mandamos el token de pepe
        }
    });

    const data = await response.json();
    testUtils.log(data);

    // VALIDACIÓN: El test es exitoso si el status es 403 (Acceso Prohibido/Denegado)
    if (response.status === 403) {
        testUtils.setSuccess(btn);
        console.log("=========================================");
        console.log("🔒 TEST SEGURIDAD OK: 403 FORBIDDEN DETECTADO 🔒");
        console.log("=========================================");
    }
});


/**
 * Parte II - 3. Pruebas de Recursos: Eliminación Dinámica de Samples
 */
testUtils.createTestButton("Test Eliminar Sample Dinámico", async (btn) => {
    // 1. Asegurar Sesión con un token válido
    const token = await okLogin();

    // 2. Obtener Identificador: Consultamos la lista actual de archivos del usuario
    const listResponse = await fetch('/api/samples/my-samples', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const samples = await listResponse.json();

    // 3. Validar Existencia de los elementos
    if (!samples || samples.length === 0) {
        console.warn("⚠️ Advertencia: Se debe subir un sample primero para poder borrarlo.");
        return;
    }

    // Si hay samples, extraemos el id del primero de la lista
    const targetId = samples[0].id;
    testUtils.log(`Target ID a eliminar: ${targetId}`);

    // 4. Ejecutar Eliminación mediante el verbo DELETE
    const deleteResponse = await fetch(`/api/samples/${targetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await deleteResponse.json();
    testUtils.log(data);

    // VALIDACIÓN: Exitoso si responde con código de estado 200 u ok
    if (deleteResponse.ok || deleteResponse.status === 200) {
        testUtils.setSuccess(btn);
        console.log(`=========================================`);
        console.log(`🗑️ SAMPLE ${targetId} REMOVIDO CON ÉXITO 🗑️`);
        console.log(`=========================================`);
    }
});


/**
 * Parte II - 4. Pruebas de Validación: Carga Incompleta
 */
testUtils.createTestButton("Test Subir Sample - Error por Datos Faltantes", async (btn) => {
    const token = await okLogin();

    // Utilizar FormData para simular la subida de un archivo físico
    const formData = new FormData();
    
    // Agregamos un archivo de audio simulado con un Blob, pero NO agregamos ni category ni display_name
    const audioBlob = new Blob(["datos_de_audio_simulados"], { type: 'audio/mpeg' });
    formData.append('sampleFile', audioBlob, 'test_audio.mp3');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, // FormData no lleva Content-Type manual
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);

    // VALIDACIÓN: El servidor debe rechazar la petición con un error de validación 400
    if (response.status === 400) {
        testUtils.setSuccess(btn);
        console.log("=========================================");
        console.log("🛑 VALIDACIÓN CORRECTA: ERROR 400 POR DATOS FALTANTES 🛑");
        console.log("=========================================");
    }
});