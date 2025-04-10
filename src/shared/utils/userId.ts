export const getUserId = () => localStorage.getItem('userId') || '';
export const setUserId = (userId: string) => localStorage.setItem('userId', userId);
