// Servidor mock de API usando json-server
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("src/services/db.json");
const middlewares = jsonServer.defaults();
const PORT = 3001;

// Dados iniciais
const initialData = {
  clients: [
    {
      id: "1",
      firstName: "Leanne",
      lastName: "Graham",
      email: "Sincere@april.biz",
      contactAt: "2023-10-15",
      address: "Kulas Light, 556 - Gwenborough",
      phone: "1-770-736-8031 x56442",
      status: "activated",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      firstName: "Ervin",
      lastName: "Howell",
      email: "Shanna@melissa.tv",
      contactAt: "2024-01-22",
      address: "Victor Plains, 869 - Wisokyburgh",
      phone: "010-692-6593 x09125",
      status: "activated",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      firstName: "Clementine",
      lastName: "Bauch",
      email: "Nathan@yesenia.net",
      contactAt: "2024-02-10",
      address: "Douglas Extension, 847 - McKenziehaven",
      phone: "1-463-123-4447",
      status: "deactivated",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Rotas customizadas se necessário
server.use((req, res, next) => {
  console.log(`[Mock API] ${req.method} ${req.url}`);
  next();
});

// Usa o router do json-server
server.use("/api", router);

// Cria arquivo db.json se não existir
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "db.json");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  console.log("📁 db.json criado com dados iniciais");
}

server.listen(PORT, () => {
  console.log(`🚀 Mock API Server rodando em http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   GET    http://localhost:${PORT}/api/clients`);
  console.log(`   GET    http://localhost:${PORT}/api/clients/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/clients`);
  console.log(`   PUT    http://localhost:${PORT}/api/clients/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/clients/:id`);
});

module.exports = server;
