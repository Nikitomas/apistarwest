const app = require('./src/app');
const { port } = require('./src/config/env');

app.listen(port, () => {
  console.log(`apistarwest API listening on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
