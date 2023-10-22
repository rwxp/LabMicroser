const { ApolloServer, AuthenticationError } = require('apollo-server');

const validTokens = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkxIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIzfQ.mC0TjRtRVz4uD875aHWhVS3C7O5TMo4igevUOS0kAaM",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkyIiwibmFtZSI6IkppbSBEb2UiLCJpYXQiOjE1MTYyMzkwMjR9.PnY5wuwRohcdEd0lAfzhHlZgCmlWQOKO6fP8GprcFeY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkzIiwibmFtZSI6Ikpvc2ggRG9lIiwiaWF0IjoxNTE2MjM5MDI1fQ.9VskLxYTZC2xvl7KZ5a3M-ik-0IjOkh-9iP6HvNzMfI",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODk0IiwibmFtZSI6Ikp1ZHkgRG9lIiwiaWF0IjoxNTE2MjM5MDI2fQ.0g2M7uh2rIqA67CLvIpT5aR7Iz-EGt37QJ20qG9G7_w"
  ];

const typeDefs = `
  type Query {
    service1: String
    service2: String
    service3: String
  }
`;

const resolvers = {
  Query: {
    service1: (parent, args, context, info) => {
        console.log(context.token);
        return "Hola, soy servicio1 Papitas con salchichas!";
    },
    service2: () => "Hola, soy servicio2 Besitos de cerezas!",
    service3: () => "Hola, soy servicio3 Cachetada con Trucha !",
  },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split('Bearer ')[1];

        // Verificamos si el token está en nuestra lista de tokens válidos
        if (!token || !validTokens.includes(token)) {
          throw new AuthenticationError("No estás autorizado");
        }
    
        return { token };
    }
  });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
