export const getUserName = () => localStorage.getItem('username');
export const setUserName = (username: string) => localStorage.setItem('username', username);
