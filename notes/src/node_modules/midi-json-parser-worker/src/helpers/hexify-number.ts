export const hexifyNumber = (number: number): string => {
    return number.toString(16).toUpperCase().padStart(2, '0');
};
