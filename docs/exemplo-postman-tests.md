// Exemplo de script de teste automatizado no Postman
// Adicione no campo "Tests" de cada request

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has pets array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.pets).to.be.an("array");
});

// Para autenticação
pm.test("Token presente na resposta", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.exist;
    pm.environment.set("jwt_token", jsonData.token);
});
