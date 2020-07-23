import 'reflect-metadata'
import { validate as classValidate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { Config } from 'spiderbee-types'
import { ConfigValidator } from './config.validator'

const validate = (config: Config) => classValidate(plainToClass(ConfigValidator, config))

export {
  ConfigValidator,
  validate,
}