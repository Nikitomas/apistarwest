const products = [
  { id: 1, name: 'Wireless Mouse', price: 25.99, stock: 100 },
  { id: 2, name: 'Mechanical Keyboard', price: 79.99, stock: 50 },
  { id: 3, name: 'USB-C Hub', price: 34.5, stock: 75 },
];

function findById(id) {
  return products.find((product) => product.id === id);
}

function findAll() {
  return products;
}

module.exports = {
  products,
  findById,
  findAll,
};
