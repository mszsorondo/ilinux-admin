# Clase 1: Introducción

## ¿Qué es GNU/Linux?

GNU/Linux es un sistema operativo libre y de código abierto basado en Unix. Fue creado por **Linus Torvalds** en 1991 y desde entonces se ha convertido en el sistema operativo más utilizado en servidores, supercomputadoras y dispositivos embebidos.

### Características principales

- **Código abierto**: cualquiera puede ver, modificar y distribuir el código fuente
- **Seguridad**: modelo de permisos robusto y actualizaciones constantes
- **Estabilidad**: diseñado para funcionar sin interrupciones durante largos períodos
- **Flexibilidad**: se adapta a cualquier entorno, desde un Raspberry Pi hasta un datacenter

## Distribuciones

Una **distribución** (distro) es una versión de Linux empaquetada con herramientas y configuraciones específicas. Las más relevantes para administración de redes:

| Distribución | Uso principal | Sitio oficial |
|---|---|---|
| Debian | Servidores, estabilidad | https://www.debian.org |
| Ubuntu Server | Servidores, facilidad de uso | https://ubuntu.com/server |
| CentOS / Rocky Linux | Entornos empresariales | https://rockylinux.org |
| Kali Linux | Pentesting y seguridad | https://www.kali.org |

## Entorno de laboratorio

Para las prácticas del curso vamos a usar **VirtualBox** para virtualizar nuestras máquinas Linux.

### Software necesario

- [VirtualBox (descarga)](https://www.virtualbox.org/wiki/Downloads)
- [ISO Debian 12](https://www.debian.org/download)
- [ISO Kali Linux](https://www.kali.org/get-kali/#kali-installer-images)

### Requisitos mínimos del equipo

- 8 GB de RAM (recomendado 16 GB)
- 50 GB de espacio en disco libre
- Procesador con soporte de virtualización (VT-x / AMD-V)

## Recursos complementarios

- [The Linux Documentation Project](https://tldp.org)
- [Linux Journey — Guía interactiva para principiantes](https://linuxjourney.com)
- [Guía de referencia Debian](https://www.debian.org/doc/manuals/debian-reference/)
- [Explicación de la estructura de directorios en Linux](https://www.pathname.com/fhs/)
- [OverTheWire Bandit — Práctica de línea de comandos](https://overthewire.org/wargames/bandit/)

## Tarea

1. Instalar VirtualBox en tu equipo
2. Descargar la ISO de Debian 12
3. Investigar: ¿qué diferencia hay entre un kernel monolítico y un microkernel?
