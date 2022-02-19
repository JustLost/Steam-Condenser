//Atlas for autofill search
//

const app = require("./app");

let collection = null;
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(process.env.MONGODB_URI);

  console.log(`Server listening on port http://localhost:${PORT}`);
});

module.exports = collection;
