export declare type EventModifier = ('prevent' | 'stop' | 'stopImmediate') | undefined;
export declare type Controller = Record<string, any>;
export declare type Controllers = {
    [key: string]: any;
};
export declare type InitOptions = {
    prefix?: string;
};
