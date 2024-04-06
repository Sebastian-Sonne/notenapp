/**
 * function to get data from local storage
 * @param {*} key key of data
 * @returns data
 */
export function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

/**
 * function to save data at key to local storage
 * @param {*} key data key
 * @param {*} data data
 */
export function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}