/**
 * Normalize duration into days
 * @param {String} periodType that is "DAYS","WEEKS" or "MONTHS"
 * @param {Number} timeToElapse the time to elapse
 */
const normalizeDuration = (periodType, timeToElapse) => {
    let time = timeToElapse;
    if (periodType.trim().toLocaleLowerCase() === 'days') {
        time = timeToElapse;
    } else if (periodType.trim().toLocaleLowerCase() === 'weeks') {
        time = (7 * timeToElapse);
    } else if (periodType.trim().toLocaleLowerCase() === 'months') {
        time = (30 * timeToElapse);
    }
    return time;
};

export default normalizeDuration;
