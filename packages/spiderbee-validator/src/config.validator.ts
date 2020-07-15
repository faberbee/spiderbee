import { Config } from 'spiderbee-types'
import { IsOptional, IsString, IsUrl, IsBoolean, ValidateNested } from 'class-validator'
import { ActionValidatorType, TypeAction } from './actions.validators'

export class ConfigValidator implements Config {
  @IsOptional()
  @IsString()
  id?: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsBoolean()
  noscript?: boolean;

  @ValidateNested({ each: true })
  @TypeAction()
  actions: ActionValidatorType[];
}
