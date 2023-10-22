const { ApolloServer, AuthenticationError } = require('apollo-server');
const axios = require('axios'); 

const typeDefs = `
  type Query {
    service1: [String]
    service2: String
    service3: String
  }
`;

const resolvers = {
  Query: {
    service1: async (parent, args, context, info) => {
      console.log(context.token);
      try {
          const response = await axios.get('http://salchipapitas:5000/comestibles');
          const data = response.data;
          return [...data.papas, ...data.salchichas];
      } catch (err) {
          console.error("Error al obtener datos de salchipapitas", err);
          return [];
      }
  },
  service2: async () => {
    try {
        const response = await axios.get('http://besoscerezas:8080/besos');
        const data = response.data;
        let result = "Hola, soy servicio2 Besitos sabor cerezas! Aquí tienes algunos besos y sus frutas asociadas: ";
        for (const [key, value] of Object.entries(data)) {
            result += `Beso ${key} -> ${value}, `;
        }
        return result.slice(0, -2); // Para eliminar la última coma y espacio
    } catch (err) {
        console.error("Error al obtener datos de besoscerezas", err);
        return "Error al obtener datos de besoscerezas";
    }
  },
    service3: () => "Hola, soy servicio3 Cachetada con Trucha !",
  },
};

async function getContext({ req }) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split('Bearer ')[1];

    try {
        const response = await axios.post('http://authservice:3000/verify-token', { token: token });
        console.log(response.data)
        if (response.data && response.data.isValid) {
            return { token };
        } else {
            throw new AuthenticationError("No estás autorizado");
        }
    } catch (err) {
        throw new AuthenticationError("Error al validar el token");
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: getContext
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

