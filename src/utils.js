// utils.js
export function getUserDataFromLocalStorage() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}
