const { getAppliedFeeValue, getChargeAmount, getSettlementAmount } = require('../controllers/calculate.value');

const createResult = (configuration, amount, customer) =>{
    let result = {}
    result.AppliedFeeID = configuration.feeId;
    result.AppliedFeeValue = getAppliedFeeValue(configuration.feeType, configuration.feeValue, amount);
    result.ChargeAmount = getChargeAmount(result.AppliedFeeValue, customer.BearsFee, amount);
    result.SettlementAmount = getSettlementAmount(result.ChargeAmount, result.AppliedFeeValue);
 
    return result

}

module.exports = {createResult}