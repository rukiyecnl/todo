export function saveToLocalStorage(key, items){
    localStorage.setItem(key, JSON.stringify(items));
}