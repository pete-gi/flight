export type EventModifier = ('prevent' | 'stop' | 'stopImmediate') | undefined

export type Controller = Record<string, any>

export type Controllers = {
  [key: string]: any
}

export type InitOptions = {
  prefix?: string
}
