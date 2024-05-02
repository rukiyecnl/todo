import { qs } from "./querySelector.js";
import { qsAll } from "./querySelector.js";

export function bindEvents(selector, eventType, cbFunction){
    const element = qs(selector);
    element.addEventListener(eventType, cbFunction);
}

export function bindEventsAll(selector, eventType, cbFunction){
    const elements = qsAll(selector);
    for (const element of elements) {

        element.addEventListener(eventType, cbFunction);
        
    }
}