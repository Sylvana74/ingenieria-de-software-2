#ifndef INTRANED_API_H
#define INTRANED_API_H

#ifdef __cplusplus
extern "C" {
#endif

// Oculta la complejidad de HTTP y JSON en una sola función de C
const char* realizar_peticion_json(const char* url);

#ifdef __cplusplus
}
#endif

#endif // INTRANED_API_H