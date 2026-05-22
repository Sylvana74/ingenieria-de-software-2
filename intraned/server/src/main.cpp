#include <iostream>
#include "intraned_api.h" // <-- Única cabecera necesaria para la API de C

int main() {
    std::cout << "Iniciando Intraned con componente estable..." << std::endl;
    
    // Llamamos a la función de la caja negra tal como pide el profesor
    const char* json_res = realizar_peticion_json("http://localhost:8080");
    
    if (json_res) {
        std::cout << "Respuesta recibida exitosamente: " << json_res << std::endl;
        
        // Como se usó strdup internamente, liberamos la memoria al terminar
        free((void*)json_res); 
    } else {
        std::cerr << "Error o respuesta vacía en la petición." << std::endl;
    }

    return 0;
}