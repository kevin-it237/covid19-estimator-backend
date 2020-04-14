import normalizeDuration from './utils';

/**
 * Process estimation.
 * @param {Object} data the input data
 * @param {Number} severity the impact of covid-19, 10 for impact and 50 for several impact
 * @returns {Object} An object that contains the impact data
 */
const processImpact = (data, severity) => {
    // Challenge 1
    /** The number of currently infected people */
    const currentlyInfected = data.reportedCases * severity;
    /** get time To Elapse In Days */
    const timeToElapseInDays = normalizeDuration(data.periodType, data.timeToElapse);
    /** infections By Requested Time */
    const infectionsByRequestedTime = currentlyInfected
        * (2 ** Math.floor(timeToElapseInDays / 3));

    // Challenge 2
    /** number of severe positive cases that will require hospitalization */
    const severeCasesByRequestedTime = Math.floor((infectionsByRequestedTime * 15) / 100);
    /** total number of available beds */
    const totalAvailableBeds = (data.totalHospitalBeds * 35) / 100;
    /** number of available beds by requested time */
    const hospitalBedsByRequestedTime = Math.floor(totalAvailableBeds
        - severeCasesByRequestedTime) + 1;

    // Challenge 3
    /** number of severe positive cases that will require ICU care. */
    const casesForICUByRequestedTime = Math.floor((infectionsByRequestedTime * 5) / 100);
    /** number of severe positive cases that will require ventilators. */
    const casesForVentilatorsByRequestedTime = Math.floor((infectionsByRequestedTime * 2) / 100);
    /** estimate how much money the economy is likely to lose daily */
    const dollarsInFlight = Math.floor((infectionsByRequestedTime
        * data.region.avgDailyIncomePopulation
        * data.region.avgDailyIncomeInUSD) / timeToElapseInDays);
    return {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    };
};

export default processImpact;
