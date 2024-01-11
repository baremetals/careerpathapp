# Careers Application

Built using: node.js@18, express, mongoDB, and mongoose.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn dev2

# watch mode
$ yarn watch

# production mode
$ yarn start
```
<!-- TODO -->
## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test
```
## Support

## Stay in touch

- Author - [Daniel Asante]
- Website - []()
- Twitter - []()

## License

# Deploy to aws azure app service
az login
az webapp create
az webapp up --name careerpathapp --resource-group <resource-group> --plan <app-service-plan> --runtime "DOTNETCORE|3.1" --location <region> --html

az webapp up --name discareerapi --resource-group discareer --plan CareerpathApp --runtime "NODE|18-lts" --location uksouth
