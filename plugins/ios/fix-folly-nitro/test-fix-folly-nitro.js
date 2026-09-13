const fs = require('node:fs')
const path = require('node:path')

const main = () => {
  const podfilePath = path.join(__dirname, '../../../ios/Podfile')

  if (!fs.existsSync(podfilePath)) return

  let content = fs.readFileSync(podfilePath, 'utf-8')
  if (content.includes("target.name == 'RCT-Folly'")) return

  const targetAnchor = 'react_native_post_install('
  const startIdx = content.indexOf(targetAnchor)
  if (startIdx === -1) return

  // Find the closing ')' of the react_native_post_install(...) function call
  const closingParenIdx = content.indexOf(')', startIdx)
  if (closingParenIdx === -1) return

  // Find the end of the line containing that closing parenthesis
  const lineEndIdx = content.indexOf('\n', closingParenIdx)
  if (lineEndIdx === -1) return

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

  // Insert right after the react_native_post_install block
  content =
    content.slice(0, lineEndIdx) + '\n' + patchCode + content.slice(lineEndIdx)

  fs.writeFileSync(podfilePath, content)
}

main()
