const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    passwordHash: bcrypt.hashSync('alice123', 10),
    role: 'customer',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    passwordHash: bcrypt.hashSync('bob123', 10),
    role: 'customer',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
    passwordHash: bcrypt.hashSync('carol123', 10),
    role: 'admin',
  },
];

let nextId = users.length + 1;

function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function findById(id) {
  return users.find((user) => user.id === id);
}

function create({ name, email, passwordHash, role }) {
  const user = {
    id: nextId++,
    name,
    email,
    passwordHash,
    role: role || 'customer',
  };
  users.push(user);
  return user;
}

module.exports = {
  users,
  findByEmail,
  findById,
  create,
};
