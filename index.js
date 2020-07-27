//declaracion de variables y paquetes necesarios
var serverWebSocket = require("websocket").server;
const portWebSocket = process.env.port || 5555;
const http = require("http");
const uuid = require("uuid");

//configuracion de servidor
const server = http.createServer();
server.listen(portWebSocket);
console.log("hola, servidor activo en el puerto 5555");

//creamos un servidor webSocket usando la instancia http creada anteriormente
const webSocketServer = new serverWebSocket({
  httpServer: server,
});

//los clientes q se van a conectar
const clients = {};

//el id de cada cliente debe ser diferente para lo cual implementamos un unico id sencillo utilizando la libraria uuid/v4
const uniqueID = () => {
  return uuid.v4();
};

//configuramos el servicio
webSocketServer.on("request", function (request) {
  //asignamos un id para cada conexion
  var clientID = uniqueID();
  console.log("recibiendo una nueva conexion" + request.origin);
  //aceptamos la conexion, en este caso no tenemos definido ningun protocolo y enviamos null
  const conn = request.accept(null, request.origin);
  //asignamos la conexion al cliente
  clients[clientID] = conn;
  console.log(
    "conectado" + clientID + "en" + Object.getOwnPropertyNames(clients)
  );
  //abrimas la coneccion y configuramos el 'core' del servidor
  conn.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("cliente envio: " + message.utf8Data);
      //enviamos el mensaje a todos las conexiones
      for (client in clients) {
        clients[client].sendUTF(message.utf8Data);
        console.log("el mensaje se envio a " + clients[client]);
      }
    }
  });
});
