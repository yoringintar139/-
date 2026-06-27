targetScope = 'subscription'

@description('Environment name')
param environmentName string

@description('Azure region')
param location string = 'koreacentral'

@description('NEIS API Key')
@secure()
param neisApiKey string

var resourceGroupName = 'rg-${environmentName}'
var tags = { 'azd-env-name': environmentName }

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

module resources 'resources.bicep' = {
  name: 'resources'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    neisApiKey: neisApiKey
    tags: tags
  }
}

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = resources.outputs.AZURE_CONTAINER_REGISTRY_ENDPOINT
output SERVICE_WEB_URI string = resources.outputs.SERVICE_WEB_URI
