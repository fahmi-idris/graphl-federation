const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const products = [
  {
    upc: "1",
    name: "MSI Gaming Chair",
    price: 3000000,
    weight: 40000
  },
  {
    upc: "2",
    name: "Macbook Pro 2020",
    price: 30000000,
    weight: 2000
  },
  {
    upc: "3",
    name: "PS5",
    price: 8000000,
    weight: 5000
  }
];


const typeDefs = gql`
  extend type Query {
    products(first: Int = 5): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    products(_, args) {
      return products.slice(0, args.first);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
