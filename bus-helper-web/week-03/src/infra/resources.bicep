@description('Environment name')
param environmentName string

@description('Azure region')
param location string

@description('NEIS API Key')
@secure()
param neisApiKey string

param tags object = {}

var abbrs = {
  logAnalyticsWorkspace: 'log-'
  appInsights: 'appi-'
  containerRegistry: 'cr'
  containerAppsEnvironment: 'cae-'
  userAssignedIdentity: 'id-'
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${abbrs.logAnalyticsWorkspace}${environmentName}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${abbrs.appInsights}${environmentName}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource uami 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${abbrs.userAssignedIdentity}${environmentName}'
  location: location
  tags: tags
}

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: '${abbrs.containerRegistry}${replace(environmentName, '-', '')}'
  location: location
  tags: tags
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: false }
}

resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, uami.id, 'acrpull')
  scope: acr
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: uami.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

resource cae 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${abbrs.containerAppsEnvironment}${environmentName}'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource apiApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'api-${environmentName}'
  location: location
  tags: union(tags, { 'azd-service-name': 'api' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${uami.id}': {} }
  }
  properties: {
    managedEnvironmentId: cae.id
    configuration: {
      registries: [{ server: acr.properties.loginServer, identity: uami.id }]
      ingress: { external: false, targetPort: 8000 }
      secrets: [{ name: 'neis-api-key', value: neisApiKey }]
    }
    template: {
      containers: [{
        name: 'api'
        image: '${acr.properties.loginServer}/api:latest'
        env: [{ name: 'NEIS_API_KEY', secretRef: 'neis-api-key' }]
        resources: { cpu: json('0.25'), memory: '0.5Gi' }
      }]
      scale: { minReplicas: 0, maxReplicas: 3 }
    }
  }
}

resource webApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'web-${environmentName}'
  location: location
  tags: union(tags, { 'azd-service-name': 'web' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${uami.id}': {} }
  }
  properties: {
    managedEnvironmentId: cae.id
    configuration: {
      registries: [{ server: acr.properties.loginServer, identity: uami.id }]
      ingress: { external: true, targetPort: 8080 }
    }
    template: {
      containers: [{
        name: 'web'
        image: '${acr.properties.loginServer}/web:latest'
        env: [{ name: 'API_UPSTREAM', value: '${apiApp.properties.configuration.ingress.fqdn}:443' }]
        resources: { cpu: json('0.25'), memory: '0.5Gi' }
      }]
      scale: { minReplicas: 0, maxReplicas: 3 }
    }
  }
}

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = acr.properties.loginServer
output SERVICE_WEB_URI string = 'https://${webApp.properties.configuration.ingress.fqdn}'
