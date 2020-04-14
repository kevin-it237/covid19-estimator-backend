import processImpact from './impact';

const covid19ImpactEstimator = (data) => {
    const impact = processImpact(data, 10);
    const severeImpact = processImpact(data, 50);
    return { data, impact, severeImpact };
};
export default covid19ImpactEstimator;
