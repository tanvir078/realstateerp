targetScope = 'subscription'

param environmentName string = 'prod'
param location string = 'centralindia'
param resourceGroupName string = 'rg-slbl-erp-prod-ci'
param sessionId string
param deployedBy string
param createdAt string
param postgresAdminLogin string = 'slblerpadmin'

@secure()
param postgresAdminPassword string

@secure()
param jwtSecret string

@secure()
param jwtRefreshSecret string

param backendImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
param frontendImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

var tags = {
  'app-onboard-skill': 'true'
  'app-onboard-session-id': sessionId
  'created-at': createdAt
  environment: environmentName
  'deployed-by': deployedBy
}

resource rg 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

module application 'modules/application.bicep' = {
  name: 'slblerp-application'
  scope: rg
  params: {
    location: location
    tags: tags
    postgresAdminLogin: postgresAdminLogin
    postgresAdminPassword: postgresAdminPassword
    jwtSecret: jwtSecret
    jwtRefreshSecret: jwtRefreshSecret
    backendImage: backendImage
    frontendImage: frontendImage
  }
}

output resourceGroupName string = rg.name
output backendFqdn string = application.outputs.backendFqdn
output frontendFqdn string = application.outputs.frontendFqdn
output postgresFqdn string = application.outputs.postgresFqdn
output registryLoginServer string = application.outputs.registryLoginServer
