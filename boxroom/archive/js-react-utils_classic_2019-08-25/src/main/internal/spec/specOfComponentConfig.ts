import { REGEX_DISPLAY_NAME, REGEX_PROP_NAME } from '../constant/constants'
import PropertiesConfig from '../types/PropertiesConfig'
import { Spec, SpecError } from 'js-spec'

const
  specOfPropertiesConfig =
    Spec.and(
      Spec.object,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME)),

      Spec.valuesOf(
        Spec.and(
          Spec.exact({
            type: Spec.optional(Spec.function),
            nullable: Spec.optional(Spec.boolean),
            validate: Spec.optional(Spec.function),
            required: Spec.optional(Spec.boolean),
            defaultValue: Spec.optional(Spec.any)
          }),

          (propConfig: PropertiesConfig<any>) => {
            const
              required = propConfig.required,
              hasRequiredParam = propConfig.hasOwnProperty('required'),
              hasDefaultValue = propConfig.hasOwnProperty('defaultValue')

            let errorMsg = null

            if (hasRequiredParam && hasDefaultValue) {
              errorMsg = 'The parameters "required" and "defaultValue" must '
                + 'not be set both at once'
            } else if (required === false) {
              errorMsg = 'Please do not provide "required: false" as this is redundant'
            }

            return errorMsg ? new Error(errorMsg) : null
          }))),
  
  specOfPropTypesConfig =
    Spec.and(
      Spec.object,
      Spec.hasSomeKeys,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME)),
      Spec.valuesOf(Spec.function)),

  specOfDefaultPropsConfig =
    Spec.and(
      Spec.object,
      Spec.hasSomeKeys,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME))),

  specOfComponentConfig = 
    Spec.and(
      Spec.exact({
        displayName: Spec.match(REGEX_DISPLAY_NAME),
        properties: Spec.optional(specOfPropertiesConfig),
        variableProps: Spec.optional(Spec.boolean),
        propTypes: Spec.optional(specOfPropTypesConfig),
        defaultProps: Spec.optional(specOfDefaultPropsConfig),
        validate: Spec.optional(Spec.function),

        methods:
          Spec.optional(
            Spec.and(
              Spec.arrayOf(Spec.string),
              Spec.unique())),

        render: Spec.function
      }),
    
      config => {
        let error = null

        for (let key of ['propTypes', 'defaultProps']) {
          if (config.hasOwnProperty(key)) {
            if (config.hasOwnProperty('properties')) {
              error = new SpecError(`It\'s not allowed to configure both parameter "properties" and "${key}" at the same time`)
            } else if (config.hasOwnProperty('variableProps')) {
              error = new SpecError(`It's not allowed to configure both parameter "variableProps" and "${key}" at the same time`)
            }
          }

          if (error) {
            break
          }
        }

        return error
      })


export default specOfComponentConfig
