# Aplicación Burguer Queen 

Este proyecto consiste en el desarrollo de una aplicación móvil de comida rápida utilizando el framework Ionic. La aplicación permite a los usuarios simular la realización de un pedido, seleccionando productos del menú, añadiéndolos a un carrito y eligiendo un método de pago. El objetivo principal es ofrecer una experiencia fluida de usuario que refleje un flujo real de compra en una plataforma digital, integrando tanto la lógica de negocio como la interfaz gráfica responsiva para dispositivos móviles.

# Tecnologias empleadas 

Angular 19
Node JS 20.9.0
Ionic 7.1.1 
Docker 
Mongo db 
Editor Visual Studio Code

# Instalación 
Pasos para realizar la instalación de este proyecto: 

## Clonar el repositorio
git clone https://github.com/giojibo/burguer-queen

## Entra a la carpeta 

cd 04-burguer-queen 

## Instala las dependencias 
npm install

## Como correr el proyecto

Una vez instalado las dependencias lo que se hace es primero correr el contenedor con el comando: 
docker compose -p burger-queen up -d

Este comando ejecuta el archivo docker-compose.yml en docker. 

Posteriomente se inicia el front-end con el comando ionic serve 
