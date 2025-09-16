

type Result = {
    [key: string]: string | number; // Result object with dynamic property names
};

export function convertDates(
    data: Record<string, number> | undefined,
    datePropertyName: string = 'date',
    amountPropertyName: string = 'amount'
): Result[] {
    const result: Result[] = [];

    for (const dateRange in data) {  // Change 'let' to 'const' here
        const amount = data[dateRange];

        // Split the date range into start and end dates
        const [startDate, endDate] = dateRange.split(' ');

        // Extract month abbreviation (assuming "September" for now)
        const monthAbbreviation = startDate.split('-')[1].slice(0, 3); // 'Sep'

        // Format the new date range string
        const formattedDate = `${startDate}-${endDate} ${monthAbbreviation}`;

        // Create the object with dynamic property names
        const formattedObject: Result = {};
        formattedObject[datePropertyName] = formattedDate;
        formattedObject[amountPropertyName] = amount;

        result.push(formattedObject);
    }

    return result;
}