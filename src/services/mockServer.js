import { createServer, Model, Response } from "miragejs";

export function makeMockServer() {
  return createServer({
    environment: process.env.NODE_ENV,

    models: {
      client: Model,
    },

    seeds(server) {
      // Carrega clientes do localStorage ou usa padrão
      const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");

      if (savedClients.length > 0) {
        savedClients.forEach((client) => {
          server.create("client", {
            ...client,
            // Garante que clientes editados da API tenham os campos certos
            isLocal: false,
            isEditedApiProduct: false,
          });
        });
      } else {
        // Clientes padrão
        server.create("client", {
          id: "1",
          firstName: "Leanne",
          lastName: "Graham",
          email: "Sincere@april.biz",
          contactAt: "2023-10-15",
          address: "Kulas Light, 556 - Gwenborough",
          phone: "1-770-736-8031 x56442",
          status: "activated",
          isLocal: false,
          isEditedApiProduct: false,
        });

        server.create("client", {
          id: "2",
          firstName: "Ervin",
          lastName: "Howell",
          email: "Shanna@melissa.tv",
          contactAt: "2024-01-22",
          address: "Victor Plains, 869 - Wisokyburgh",
          phone: "010-692-6593 x09125",
          status: "deactivated",
          isLocal: false,
          isEditedApiProduct: false,
        });

        server.create("client", {
          id: "3",
          firstName: "Clementine",
          lastName: "Bauch",
          email: "Nathan@yesenia.net",
          contactAt: "2024-02-10",
          address: "Douglas Extension, 847 - McKenziehaven",
          phone: "1-463-123-4447",
          status: "activated",
          isLocal: false,
          isEditedApiProduct: false,
        });
      }
    },

    routes() {
      this.namespace = "api";

      // GET /api/clients - Lista todos os clientes
      this.get("/clients", (schema) => {
        return schema.clients.all();
      });

      // GET /api/clients/:id - Retorna cliente específico
      this.get("/clients/:id", (schema, request) => {
        const id = request.params.id;
        const client = schema.clients.find(id);

        if (!client) {
          return new Response(404, {}, { error: "Cliente não encontrado" });
        }

        return client;
      });

      // POST /api/clients - Cria novo cliente
      this.post("/clients", (schema, request) => {
        try {
          const attrs = JSON.parse(request.requestBody);
          const newClient = {
            ...attrs,
            id: `mock-${Date.now()}`,
            contactAt: new Date().toISOString().split("T")[0],
            isLocal: true,
            isEditedApiProduct: false,
          };

          const createdClient = schema.clients.create(newClient);

          // Atualiza localStorage
          const allClients = schema.clients.all().models;
          localStorage.setItem("clients", JSON.stringify(allClients));

          return createdClient;
        } catch (error) {
          return new Response(400, {}, { error: "Dados inválidos" });
        }
      });

      // PUT /api/clients/:id - Atualiza cliente
      this.put("/clients/:id", (schema, request) => {
        try {
          const id = request.params.id;
          const attrs = JSON.parse(request.requestBody);
          const client = schema.clients.find(id);

          if (!client) {
            return new Response(404, {}, { error: "Cliente não encontrado" });
          }

          client.update(attrs);

          // Atualiza localStorage
          const allClients = schema.clients.all().models;
          localStorage.setItem("clients", JSON.stringify(allClients));

          return client;
        } catch (error) {
          return new Response(400, {}, { error: "Dados inválidos" });
        }
      });

      // PATCH /api/clients/:id - Atualização parcial
      this.patch("/clients/:id", (schema, request) => {
        try {
          const id = request.params.id;
          const attrs = JSON.parse(request.requestBody);
          const client = schema.clients.find(id);

          if (!client) {
            return new Response(404, {}, { error: "Cliente não encontrado" });
          }

          client.update(attrs);

          // Atualiza localStorage
          const allClients = schema.clients.all().models;
          localStorage.setItem("clients", JSON.stringify(allClients));

          return client;
        } catch (error) {
          return new Response(400, {}, { error: "Dados inválidos" });
        }
      });

      // DELETE /api/clients/:id - Remove cliente
      this.delete("/clients/:id", (schema, request) => {
        const id = request.params.id;
        const client = schema.clients.find(id);

        if (!client) {
          return new Response(404, {}, { error: "Cliente não encontrado" });
        }

        client.destroy();

        // Atualiza localStorage
        const allClients = schema.clients.all().models;
        localStorage.setItem("clients", JSON.stringify(allClients));

        return { success: true, message: "Cliente removido com sucesso" };
      });

      // Reseta namespace para não interferir com outras APIs
      this.namespace = "";
      this.passthrough();
    },
  });
}
