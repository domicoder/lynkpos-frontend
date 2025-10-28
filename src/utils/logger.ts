/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
export default class Logger {
  static log(componentName: string, message: string, ...args: any[]) {
    if (import.meta.env.VITE_ENV == 'development') {
      const APP_NAME = import.meta.env.VITE_APP_NAME.toUpperCase();

      console.log(
        `[${APP_NAME}] ${`__${componentName}__`} ——`,
        message,
        ...args,
      );
    }
  }
  static debug(componentName: string, message: string, ...args: any[]) {
    if (import.meta.env.VITE_ENV == 'development') {
      const APP_NAME = import.meta.env.VITE_APP_NAME.toUpperCase();

      console.debug(
        `[${APP_NAME}] ${`__${componentName}__`} ——`,
        message,
        ...args,
      );
    }
  }
  static error(componentName: string, message: string, ...args: any[]) {
    if (import.meta.env.VITE_ENV == 'development') {
      const APP_NAME = import.meta.env.VITE_APP_NAME.toUpperCase();

      console.error(
        `[${APP_NAME}] ${`__${componentName}__`} ——`,
        message,
        ...args,
      );
    }
  }
  static warn(componentName: string, message: string, ...args: any[]) {
    if (import.meta.env.VITE_ENV == 'development') {
      const APP_NAME = import.meta.env.VITE_APP_NAME.toUpperCase();

      console.warn(
        `[${APP_NAME}] ${`__${componentName}__`} ——`,
        message,
        ...args,
      );
    }
  }
  static info(componentName: string, message: string, ...args: any[]) {
    if (import.meta.env.VITE_ENV == 'development') {
      const APP_NAME = import.meta.env.VITE_APP_NAME.toUpperCase();

      console.info(
        `[${APP_NAME}] ${`__${componentName}__`} ——`,
        message,
        ...args,
      );
    }
  }
}

/*

  Example of usage:

  Logger.log('ComponentName', 'Debugging', arg1, arg2);
  Logger.debug('ComponentName', 'Message', arg1, arg2, arg3);
  Logger.error('ComponentName', 'Error occurred', error);
  Logger.info('ComponentName', 'Successfully', result);
  Logger.debug('ComponentName', 'Successfully');

  const json = { foo: 'bar' };
  Logger.debug('ComponentName', 'export request successfully sent', json);

*/
