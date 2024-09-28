export const parseDate = (dateStr) => {
    // Convert 'YYYY-MM-DD HH:MM:SS' to 'YYYY-MM-DDTHH:MM:SSZ'
    const isoDateStr = dateStr.replace(' ', 'T') + 'Z';
    return new Date(isoDateStr);
};