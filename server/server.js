const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const productsDB = [
    {
      id: 1, productName: 'abc', price: '2.99', category: 'SHIRTS',
      image: "https://www.istockphoto.com/photo/formal-shirt-with-button-down-collar-isolated-on-white-gm856917576-141225609",
    },
    {
        id: 2, productName: 'xyz', price: '5.99', category: 'JEANS',
        image: "https://www.istockphoto.com/photo/blue-jeans-isolated-with-clipping-path-gm600373506-103229995",
    },
  ];

  const resolvers = {
    Query: {
        productList,
    },
    Mutation: {
        productAdd,
    },
  };


  function productAdd(_, { product }) {
    product.id = productsDB.length + 1;
    productsDB.push(product);
    return product;
  }

function productList() {
  return productsDB;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(4000, function () {
  console.log('App started on port 4000');
});