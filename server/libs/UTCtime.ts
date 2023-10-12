import * as momentTz from 'moment-timezone';

export const ChangeMMTime = async (date = new Date()) => {
    const localTimeZone = momentTz.tz.guess();
    const localTime = momentTz.tz(new Date(date && date), localTimeZone);

    const formatDate = localTime.format();

    return formatDate;
};
