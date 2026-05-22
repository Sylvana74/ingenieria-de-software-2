#ifdef _WIN32
    // Forzamos al compilador a identificarse como Windows 10 o superior
    #undef _WIN32_WINNT
    #define _WIN32_WINNT 0x0A00 
    
    #ifndef WIN32_LEAN_AND_MEAN
        #define WIN32_LEAN_AND_MEAN
    #endif
    
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #include <windows.h>

    // Mantenemos el parche por si las dudas tu compilador extraña CreateFile2
    #ifndef CreateFile2
    #define CreateFile2(lpFileName, dwDesiredAccess, dwShareMode, dwCreationDisposition, pCreateExParams) \
            CreateFileW(lpFileName, dwDesiredAccess, dwShareMode, NULL, dwCreationDisposition, FILE_ATTRIBUTE_NORMAL, NULL)
    #endif
#endif

#define CPPHTTPLIB_IMPLEMENTATION
#include "httplib.h"
#include "json.hpp"
#include "intraned_api.h"
#include <cstring>

extern "C" {
    const char* realizar_peticion_json(const char* url) {
        httplib::Client cli(url);
        auto res = cli.Get("/");
                
        if (res) {
            try {
                auto j = nlohmann::json::parse(res->body);
                std::string s = j.dump();
                return strdup(s.c_str()); 
            } catch (...) {
                return nullptr;
            }
        }
        return nullptr;
    }
}