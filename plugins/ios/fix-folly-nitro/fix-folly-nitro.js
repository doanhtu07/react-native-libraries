const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('node:fs')
const path = require('node:path')

/**
 * Fixes 'folly/folly-config.h' file not found errors from Nitro-based pods
 * (NitroModules, NitroContextMenu, etc.).
 *
 * ISSUE:
 * React Native's core podspecs define `-DFOLLY_NO_CONFIG=1` so the
 * `#ifndef FOLLY_NO_CONFIG / #include <folly/folly-config.h> / #endif`
 * guard in RCT-Folly's Config.h is skipped. Third-party Nitro pods don't
 * inherit these flags by default, so when their C++/Swift glue transitively includes
 * folly headers, the preprocessor guard fails to trigger, causing Clang to look for
 * `folly-config.h` and throw `file not found`.
 *
 * SOLUTION:
 * Apply `FOLLY_NO_CONFIG=1` and required Folly preprocessor definitions globally across all
 * Pod targets, and append RCT-Folly to HEADER_SEARCH_PATHS as a fallback.
 */
const fixFollyNitro = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (localConfig) => {
      const podfilePath = path.join(
        localConfig.modRequest.platformProjectRoot,
        'Podfile',
      )

      if (!fs.existsSync(podfilePath)) return localConfig

      let content = fs.readFileSync(podfilePath, 'utf-8')

      // Prevent duplicate injection if plugin runs multiple times
      if (content.includes('FOLLY_NO_CONFIG=1')) return localConfig

      const targetAnchor = 'react_native_post_install('
      const startIdx = content.indexOf(targetAnchor)
      if (startIdx === -1) return localConfig

      // Find the closing ')' of react_native_post_install(...)
      const closingParenIdx = content.indexOf(')', startIdx)
      if (closingParenIdx === -1) return localConfig

      // Find the end of the line containing that closing parenthesis
      const lineEndIdx = content.indexOf('\n', closingParenIdx)
      if (lineEndIdx === -1) return localConfig

      const patchCode = `
    # Inject Folly preprocessor flags & search paths into all pod targets for Nitro compatibility
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |c|
        defs = c.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
        defs = [defs] unless defs.is_a?(Array)
        %w[FOLLY_NO_CONFIG=1 FOLLY_MOBILE=1 FOLLY_USE_LIBCPP=1 FOLLY_CFG_NO_COROUTINES=1].each do |flag|
          defs << flag unless defs.include?(flag)
        end
        c.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs

        paths = c.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
        paths = [paths] unless paths.is_a?(Array)
        rct_folly_path = '"$(PODS_ROOT)/Headers/Public/RCT-Folly"'
        paths << rct_folly_path unless paths.include?(rct_folly_path)
        c.build_settings['HEADER_SEARCH_PATHS'] = paths
      end
    end`

      content =
        content.slice(0, lineEndIdx) +
        '\n' +
        patchCode +
        content.slice(lineEndIdx)

      fs.writeFileSync(podfilePath, content)

      return localConfig
    },
  ])
}

module.exports = fixFollyNitro
