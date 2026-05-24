#!/bin/bash

OS_NAME=$(uname -s)
if [[ "$OS_NAME" == *"NT"* || "$OS_NAME" == *"MINGW"* || "$OS_NAME" == *"MSYS"* ]]; then
    EXT="dll"
    LDFLAGS="-lws2_32 -lcrypt32"
else
    EXT="so"
    LDFLAGS="-fPIC"
fi

echo "=== Configurando directorios ==="
mkdir -p server/lib

echo "=== Compilando Componente de Caja Negra (API de C) ==="
# Compilamos la DLL pasándole las librerías de sockets al final para TDM-GCC
g++ -shared -O3 -I./server/include \
    server/src/intraned_api.cpp \
    -o server/lib/libintraned_api.$EXT \
    $LDFLAGS

echo "=== Compilando Aplicación Principal (main.cpp) ==="
g++ -std=c++17 -O3 -I./server/include \
    server/src/main.cpp \
    -L./server/lib -lintraned_api \
    $LDFLAGS \
    -Wl,-rpath,./server/lib \
    -o intraned

echo "=== ¡Proceso de construcción finalizado con éxito! ==="
echo "=========================================================================="
echo " 🔥 ¡POR FIN LO HICE! SE LOGRÓ EL OBJETIVO 😊 🔥 "
echo " 🚀 Librerías dinámicas binarias ejecutadas en SO Windows con éxito 🚀 "
echo "=========================================================================="