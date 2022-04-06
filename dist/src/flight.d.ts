import { Controllers } from './types';
declare global {
    interface Window {
        FL: {
            registerController: (name: string, controller: any) => void;
            controllers: Controllers;
        };
    }
}
