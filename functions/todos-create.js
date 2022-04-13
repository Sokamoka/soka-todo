/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

/* export our lambda function as named "handler" export */
exports.handler = async (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
    domain: process.env.FAUNADB_SERVER_DOMAIN,
  });
  /* parse the string body into a useable JS object */
  console.log("event:", event.body);
  const data = JSON.parse(event.body);
  console.log("data", data);
  console.log("Function `todo-create` invoked", data);
  const todoItem = {
    data,
  };
  /* construct the fauna query */
  return client
    .query(q.Create(q.Ref("classes/todos-nuxt3"), todoItem))
    .then((response) => {
      console.log("success", response);
      /* Success! return the response with statusCode 200 */
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    })
    .catch((error) => {
      console.log("error", error);
      /* Error! return the error with statusCode 400 */
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
