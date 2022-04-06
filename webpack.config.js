const { join } = require('path')
const Encore = require('@symfony/webpack-encore')

if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'development')
}

Encore.setOutputPath('./dist')
Encore.setPublicPath('/')

Encore.addAliases({
  '~': join(__dirname, 'src'),
})

Encore.addEntry('../index', './src/flight.ts')

// Encore.splitEntryChunks()
Encore.disableSingleRuntimeChunk()
Encore.cleanupOutputBeforeBuild()
Encore.enableSourceMaps(!Encore.isProduction())
// Encore.enableVersioning(Encore.isProduction())
Encore.enableTypeScriptLoader()

const config = Encore.getWebpackConfig()
config.infrastructureLogging = {
  level: 'warn',
}
config.stats = 'errors-warnings'

module.exports = config
