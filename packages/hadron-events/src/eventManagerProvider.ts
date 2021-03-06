import { hasFunctionArgument } from './helpers/functionHelper';
import {
  IEventEmitter,
  IEventListener,
  CallbackEvent,
  IEventsConfig,
} from './types';

/**
 * Provider function to inject emitter and config into variable scope
 * @param emitter event emitter
 * @param config config parameters
 */
const eventManagerProvider = (
  emitter: IEventEmitter,
  config: IEventsConfig,
) => ({
  registerEvents: (listeners: IEventListener[]) => {
    listeners.forEach((listener: IEventListener) => {
      if (listener.event === '' || listener.event === null) {
        throw new Error('eventName can not be empty');
      }
      emitter.on(listener.event, listener.handler);
    });
  },
  emitEvent: (eventName: string, callback: CallbackEvent) => {
    if (eventName === '' || eventName === null) {
      throw new Error('eventName can not be empty');
    }

    if (callback === undefined || callback === null) {
      callback = () => null;
    }

    return emitter
      .listeners(eventName)
      .reduce((prevCallback, currentHandler) => {
        // is first argument called "callback?"
        if (!hasFunctionArgument(currentHandler, 'callback')) {
          return (...args: any[]) => {
            currentHandler(...args);
            // manually run callback
            return prevCallback(...args);
          };
        }
        return (...args: any[]) => currentHandler(prevCallback, ...args);
      }, callback);
  },
});

export default eventManagerProvider;
