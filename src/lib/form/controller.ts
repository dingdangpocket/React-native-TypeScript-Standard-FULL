/**
 * @file: controller.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { usePersistFn } from '@euler/utils/hooks';
import {
  ReactNode,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { FormData } from './types';

export class ValidateErrorObject {
  constructor(public error: ValidateError) {}
}

export type ValidateError =
  | Exclude<ReactNode, null | undefined>
  | Error
  | ValidateErrorObject;

export type FormFieldState<V> = {
  value: V;
  loading?: boolean;
  error?: ValidateError;
  validating?: boolean;
  update: (value: V | (() => Partial<V>)) => void;
  onBlur: () => void;
  setLoading(loading: boolean): void;
  setError(error: ValidateError | null | undefined): void;
};

export type FormState<T extends FormData> = {
  [p in keyof Required<T>]: FormFieldState<T[p]>;
};

type Action<T extends FormData> =
  | {
      type: 'change';
      prop: keyof T;
      value: any;
    }
  | { type: 'validate'; prop: keyof T }
  | {
      type: 'validate_done';
      prop: keyof T;
      result: ValidateResult;
    }
  | {
      type: 'loading';
      prop: keyof T;
      loading: boolean;
    }
  | {
      type: 'error';
      prop: keyof T;
      error: ValidateError | null | undefined;
    }
  | {
      type: 'errors';
      errors: {
        [p in keyof T]: ValidateError;
      };
    }
  | ((state: FormState<T>) => FormState<T>);

export type ValidateErrorResult = { error: ValidateError };
export type ValidateResult = true | ValidateErrorResult;

export type SyncFieldValidator<T extends FormData, V> = (
  value: V,
  data: Readonly<FormState<T>>,
) => ValidateResult;
export type FieldValidator<T extends FormData, V> =
  | SyncFieldValidator<T, V>
  | {
      type: 'async';
      validate: (
        value: V,
        data: Readonly<FormState<T>>,
      ) => Promise<ValidateResult>;
    };
export type FieldOption<T extends FormData, V> = {
  defaultValue: V;
  validators?: FieldValidator<T, V>[];
  validateOnChange?: boolean;
  required?: boolean;
  empty?: (vaule: V) => boolean;
};

function isSyncValidator<T extends FormData, V>(
  validator: FieldValidator<T, V>,
): validator is SyncFieldValidator<T, V> {
  return typeof validator === 'function';
}

function required<T extends FormData, V>(field: FieldOption<T, V>) {
  return (value: any): ValidateResult => {
    if (
      value == null ||
      (typeof field.defaultValue === 'string' && value.trim() === '') ||
      field.empty?.(value)
    ) {
      return { error: '该字段不能为空' };
    }
    return true;
  };
}

export function useFormController<T extends FormData>(fields: {
  [p in keyof T]: FieldOption<T, T[p]>;
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keys = useMemo(() => Object.keys(fields) as (keyof T)[], []);
  const fieldsValidating = useRef(new Map<keyof T, boolean>()).current;
  const [dirty, setDirty] = useState(false);

  const reducer = usePersistFn(
    (state: FormState<T>, action: Action<T>): FormState<T> => {
      if (typeof action === 'function') {
        return action(state);
      }
      switch (action.type) {
        case 'change': {
          const { prop, value } = action;
          const field = fields[prop];
          let fieldState: FormFieldState<T[typeof prop]> = state[prop];

          if (fieldState === state[prop] && value === fieldState.value) {
            return state;
          }

          // try to validate and potentially show the error message instantly
          if (field.validateOnChange && field.validators) {
            const validators = field.validators.filter(isSyncValidator);
            for (const validator of validators) {
              const result = validator(value, state);
              if (result === true) {
                if (fieldState.error) {
                  fieldState = {
                    ...fieldState,
                    error: undefined,
                  };
                }
              } else {
                fieldState = {
                  ...fieldState,
                  error: result.error,
                };
              }
            }
          }

          fieldsValidating.set(prop, false);
          setDirty(true);

          return {
            ...state,
            [prop]: { ...fieldState, error: undefined, value },
          };
        }

        case 'validate': {
          const { prop } = action;
          const field = fields[prop];

          let validators = field.validators ?? [];

          if (field.required) {
            validators = [required(field), ...validators];
          }

          if (!validators.length) {
            return state;
          }

          const value = state[prop].value;
          let index = validators.findIndex(x => !isSyncValidator(x));
          const end = index === -1 ? validators.length : index;

          // the sync validators should fire immediately.
          for (let i = 0; i < end; i++) {
            const validator = validators[i] as SyncFieldValidator<
              T,
              typeof prop
            >;
            const res = validator(value, state);
            if (res !== true) {
              return {
                ...state,
                [prop]: {
                  ...state[prop],
                  error: res.error,
                },
              };
            }
          }

          if (index === -1) {
            // if there're no async validators, update the state right away.
            return {
              ...state,
              [prop]: state[prop].error
                ? {
                    ...state[prop],
                    error: undefined,
                  }
                : state[prop],
            };
          }

          // begin handle async validators.

          const onValidateError = (result: ValidateErrorResult) => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            dispatch({ type: 'validate_done', prop, result });
          };

          const handleResult = (res: ValidateResult) => {
            // skip if the field value is changed before validation finishes
            if (fieldsValidating.get(prop) === false) return;

            if (res !== true) {
              onValidateError(res);
              return;
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            next();
          };

          const next = () => {
            if (index >= field.validators!.length) {
              // we're done, and there're no validation errors
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              dispatch({ type: 'validate_done', prop, result: true });
              return;
            }

            // skip if the field value is changed before validation finishes
            if (fieldsValidating.get(prop) === false) return;

            const validator = field.validators![index++];

            // sync validator might come after async validators
            if (isSyncValidator(validator)) {
              const res = validator(value, state);
              handleResult(res);
            } else {
              // execute async validator
              validator
                .validate(value, state)
                .then(handleResult)
                .catch(error => {
                  onValidateError({ error });
                });
            }
          };

          fieldsValidating.set(prop, true);

          next();

          return {
            ...state,
            [prop]: {
              ...state[prop],
              validating: true,
            },
          };
        }

        case 'validate_done': {
          const { prop, result } = action;
          return {
            ...state,
            [prop]: {
              ...state[prop],
              error: result === true ? undefined : result.error,
              validating: false,
            },
          };
        }

        case 'loading': {
          const { prop, loading } = action;
          return {
            ...state,
            [prop]: {
              ...state[prop],
              loading,
              error: undefined,
            },
          };
        }

        case 'error': {
          const { prop, error } = action;
          return {
            ...state,
            [prop]: {
              ...state[prop],
              loading: false,
              error: error ?? undefined,
            },
          };
        }

        case 'errors': {
          const { errors } = action;
          state = { ...state };
          for (const prop in errors) {
            state[prop] = {
              ...state[prop],
              loading: false,
              error: errors[prop],
            };
          }
          return state;
        }

        default:
          return state;
      }
    },
  );

  const [form, dispatch] = useReducer(
    reducer,
    keys.reduce((acc, key) => {
      acc[key] = {
        value: fields[key].defaultValue,
        update: value => {
          if (typeof value === 'function') {
            const changes = (value as any)();
            dispatch(state => {
              return {
                ...state,
                [key]: {
                  ...state[key],
                  value: {
                    ...state[key].value,
                    ...changes,
                  },
                },
              };
            });
            setDirty(true);
          } else {
            dispatch({ type: 'change', prop: key, value });
          }
        },
        onBlur: () => {
          dispatch({ type: 'validate', prop: key });
        },
        setLoading: (loading: boolean) => {
          dispatch({ type: 'loading', prop: key, loading });
        },
        setError: (error: ValidateError | null | undefined) => {
          dispatch({ type: 'error', prop: key, error });
        },
      };
      return acc;
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }, {} as FormState<T>),
  );

  const validateAll = useCallback(async () => {
    const errors: { [p in keyof T]: ValidateError } = {} as any;
    for (const prop of keys) {
      const field = fields[prop];
      let validators = field.validators ?? [];
      if (field.required) {
        validators = [required(field), ...validators];
      }

      for (const validator of validators) {
        if (isSyncValidator(validator)) {
          const result = validator(form[prop].value, form);
          if (result !== true) {
            console.log(result);
            errors[prop] = new ValidateErrorObject(result.error);
            break;
          }
        } else {
          const result = await validator.validate(form[prop].value, form);
          if (result !== true) {
            console.log(result);
            errors[prop] = new ValidateErrorObject(result.error);
            break;
          }
        }
      }
    }

    if (Object.keys(errors).length) {
      dispatch({ type: 'errors', errors });
      return false;
    }

    return true;
  }, [fields, form, keys]);

  const isAllValid = useCallback(() => {
    for (const prop of keys) {
      const field = fields[prop];

      if (form[prop].error || form[prop].loading) return false;

      let validators = field.validators ?? [];
      if (field.required) {
        validators = [required(field), ...validators];
      }

      for (const validator of validators) {
        if (isSyncValidator(validator)) {
          const result = validator(form[prop].value, form);
          if (result !== true) {
            return false;
          }
        }
      }
    }

    return true;
  }, [fields, form, keys]);

  return { form, dirty, dispatch, validateAll, isAllValid, setDirty };
}

// type Foo = { x: string; y: number; };

// const { form } = useFormController<Foo>({x: { defaultValue: '' }, y: { defaultValue: 0 }});

// form.x.value
