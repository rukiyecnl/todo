export function qs(selector){
    const element = document.querySelector(selector);
    return element;
}

export function qsAll(selector){
    const elements = document.querySelectorAll(selector);
    return elements;
}