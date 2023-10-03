import * as momentTz from 'moment-timezone';

export const ChangeMMTime = async (date = new Date()) => {
    const localTimeZone = momentTz.tz.guess();
    console.log(localTimeZone);
    const localTime = momentTz.tz(new Date(date && date), localTimeZone);

    const formatDate = localTime.format();
    console.log({
        formattedDate: formatDate,
    });

    return formatDate;
};
