export function parseLocaleDate(localeDateStr: string): Date {
    // Split the dd/mm/yyyy string
    const [day, month, year] = localeDateStr.split('/').map(Number);
    // Construct a valid Date: Note - months are 0-indexed in JS (0 = Jan, 11 = Dec)
    return new Date(year, month - 1, day);
}