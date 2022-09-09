import * as yup from 'yup';
import { AnyObject, Maybe } from 'yup/lib/types';

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    noWhitespace(): StringSchema<TType, TContext>;
    alphabetsOnly(): StringSchema<TType, TContext>;
    alphaNumbericOnly(): StringSchema<TType, TContext>;
  }
}

export default yup;
