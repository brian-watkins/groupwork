export enum ResultType {
  OK,
  ERROR,
}

export interface Ok<T, E> {
  type: ResultType.OK
  value: T
  map<S>(mapper: (val: T) => S): Result<S, E>
  mapError<X>(mapper: (err: E) => X): Result<T, X>
  valueOr(handler: (error: E) => T): T
}

export interface Err<T, E> {
  type: ResultType.ERROR
  error: E
  map<S>(mapper: (val: T) => S): Result<S, E>
  mapError<X>(mapper: (err: E) => X): Result<T, X>
  valueOr(handler: (error: E) => T): T
}

export type Result<T, E = void> = Ok<T, E> | Err<T, E>

export function okResult<T, E = void>(value: T): Result<T, E> {
  return {
    type: ResultType.OK,
    value,
    map(mapper) {
      return okResult(mapper(value))
    },
    mapError() {
      return okResult(value)
    },
    valueOr() {
      return value
    },
  }
}

export function errorResult<T, E = void>(error: E): Result<T, E> {
  return {
    type: ResultType.ERROR,
    error,
    map() {
      return errorResult(error)
    },
    mapError(mapper) {
      return errorResult(mapper(error))
    },
    valueOr(handler) {
      return handler(error)
    },
  }
}
