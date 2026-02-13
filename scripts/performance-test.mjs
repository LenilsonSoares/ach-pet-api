import autocannon from "autocannon";

autocannon({
  url: "http://localhost:3000/pets",
  connections: 10,
  duration: 10,
}, (err, result) => {
  if (err) throw err;
  console.log(result);
});
