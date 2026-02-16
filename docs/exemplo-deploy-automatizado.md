# Exemplo de deploy automatizado para Heroku

- Adicione ao workflow:

```yaml
  deploy-heroku:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Login no Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "nome-do-app"
          heroku_email: "seu-email@dominio.com"
```


## Exemplo para Vercel

- Adicione ao workflow:

```yaml
  deploy-vercel:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```


## Exemplo para Azure

- Adicione ao workflow:

```yaml
  deploy-azure:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Azure Web App Deploy
        uses: azure/webapps-deploy@v2
        with:
          app-name: "nome-do-app"
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: .
```
