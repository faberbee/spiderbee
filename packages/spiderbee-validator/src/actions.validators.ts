import { ClickAction, EachAction, IfAction, LinksAction, LoopAction, MouseDownAction, MouseMoveActionSelector, MouseMoveActionMovement, MouseUpAction, TextAction, UrlAction, WaitAction, WriteAction, ScrollAction, FormAction } from 'spiderbee-types'
import { IsIn, IsOptional, IsString, IsBoolean, ValidateNested, IsInt, Min, Max, ValidateIf } from 'class-validator'
import { Type } from 'class-transformer'

export abstract class BaseActionValidator {
  @IsIn(['url', 'text', 'links', 'loop', 'each', 'if', 'mouse_move', 'mouse_down', 'mouse_up', 'click', 'write', 'wait', 'form', 'scroll'])
  type: any
}

export type ActionValidatorType =
  UrlActionValidator |
  TextActionValidator |
  LinksActionValidator |
  LoopActionValidator |
  EachActionValidator |
  IfActionValidator |
  MouseMoveActionValidator |
  MouseDownActionValidator |
  MouseUpActionValidator |
  ClickActionValidator |
  WriteActionValidator |
  WaitActionValidator |
  FormActionValidator |
  ScrollActionValidator

export const TypeAction = () => Type(() => BaseActionValidator, {
  discriminator: {
    property: 'type',
    subTypes: [
      { value: UrlActionValidator, name: 'url' },
      { value: TextActionValidator, name: 'text' },
      { value: LinksActionValidator, name: 'links' },
      { value: LoopActionValidator, name: 'loop' },
      { value: EachActionValidator, name: 'each' },
      { value: IfActionValidator, name: 'if' },
      { value: MouseMoveActionValidator, name: 'mouse_move' },
      { value: MouseDownActionValidator, name: 'mouse_down' },
      { value: MouseUpActionValidator, name: 'mouse_up' },
      { value: ClickActionValidator, name: 'click' },
      { value: WriteActionValidator, name: 'write' },
      { value: WaitActionValidator, name: 'wait' },
      { value: FormActionValidator, name: 'form' },
      { value: ScrollActionValidator, name: 'scroll' },
    ]
  },
  keepDiscriminatorProperty: true
})

export class UrlActionValidator extends BaseActionValidator implements UrlAction {
  type: 'url';

  @IsString()
  resultKey: string;
}

export class TextActionValidator extends BaseActionValidator implements TextAction {
  type: 'text';

  @IsString()
  selector: string;

  @IsString()
  resultKey: string;

  @IsOptional()
  @IsBoolean()
  skipIfFails?: boolean;
}

export class LinksActionValidator extends BaseActionValidator implements LinksAction {
  type: 'links';

  @IsString()
  selector: string;

  @IsString()
  resultKey: string;

  @IsOptional()
  @IsString()
  regex?: string;

  @IsOptional()
  @ValidateNested()
  navigate?: NavigateValidator;

  @IsOptional()
  @IsBoolean()
  skipIfFails?: boolean;
}

class NavigateValidator {
  @IsOptional()
  @IsBoolean()
  noscript?: boolean;

  @ValidateNested({ each: true })
  @TypeAction()
  actions: ActionValidatorType[];
}

export class LoopActionValidator extends BaseActionValidator implements LoopAction {
  type: 'loop';

  @IsString()
  resultKey: string;

  @IsInt()
  @Min(1)
  @Max(100)
  times: number;

  @ValidateNested({ each: true })
  @TypeAction()
  actions: ActionValidatorType[];
}

export class EachActionValidator extends BaseActionValidator implements EachAction {
  type: 'each';

  @IsString()
  selector: string;

  @IsString()
  resultKey: string;

  @IsOptional()
  @IsBoolean()
  infinite?: boolean;

  @IsOptional()
  @IsBoolean()
  skipIfFails?: boolean;

  @ValidateNested({ each: true })
  @TypeAction()
  actions: ActionValidatorType[];
}

export class IfActionValidator extends BaseActionValidator implements IfAction {
  type: 'if';

  @IsString()
  selector: string;

  @ValidateNested({ each: true })
  @TypeAction()
  actions: ActionValidatorType[];
}

export class MouseMoveActionValidator extends BaseActionValidator implements MouseMoveActionSelector, MouseMoveActionMovement {
  type: 'mouse_move';

  @ValidateIf(o => o.movement === undefined)
  @IsString()
  selector: string;

  @ValidateIf(o => o.selector === undefined)
  @ValidateNested()
  movement: MovementValidator;

  @IsOptional()
  @IsBoolean()
  skipIfFails?: boolean;
}

class MovementValidator {
  @IsInt()
  x: number;

  @IsInt()
  y: number;
}

export class MouseDownActionValidator implements MouseDownAction {
  type: 'mouse_down';
}

export class MouseUpActionValidator implements MouseUpAction {
  type: 'mouse_up';
}

export class ClickActionValidator extends BaseActionValidator implements ClickAction {
  type: 'click';

  @IsOptional()
  @IsString()
  selector?: string;

  @IsOptional()
  @IsBoolean()
  skipIfFails?: boolean;
}

export class WriteActionValidator implements WriteAction {
  type: 'write';

  @IsOptional()
  @IsString()
  selector?: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsBoolean()
  skipIfFails?: boolean;
}

export class WaitActionValidator extends BaseActionValidator implements WaitAction {
  type: 'wait';

  @IsInt()
  @Min(0)
  @Max(60000)
  millis: number;
}

export class FormActionValidator implements FormAction {
  type: 'form'

  @ValidateNested({ each: true })
  inputs: WriteAction[]

  @ValidateNested()
  submit: ClickAction
}

export class ScrollActionValidator implements ScrollAction {
  type: 'scroll';

  @IsString()
  selector: string;
}