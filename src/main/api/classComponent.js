import validateClassComponentConfig
  from '../internal/validation/validateClassComponentConfig'

import determineDefaultProps from '../internal/helper/determineDefaultProps'
import determinePropTypes from '../internal/helper/determinePropTypes'
import extendClass from '../internal/helper/extendClass'

export default function classComponent(config) {
  const error = validateClassComponentConfig(config)

  if (error) {
    throw new Error(
      `[classComponent] ${error.message}`)
  }

  const
    ret = extendClass(config.base),
    displayName = config.displayName,
    defaultProps = determineDefaultProps(config.properties),

    propTypes = determinePropTypes(
      config.properties,
      config.validate,
      config.displayName,
      false)

  Object.defineProperties(ret, {
    displayName: {
      value: displayName
    },

    defaultProps: {
      value: defaultProps,
    },

    propTypes: {
      value: propTypes
    },

    contextTypes: {
      value: null
    },

    childContextTypes: {
      value: null
    }
  })

  return ret
}
