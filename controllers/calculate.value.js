const getAppliedFeeValue = (feeType, feeValue, transActionAmount) =>{
    if(feeType == 'FLAT'){
        return Number(feeValue);
    }else if(feeType == 'PERC'){
        return Math.round(transActionAmount * (Number(feeValue)/100));
    }else if(feeType == 'FLAT_PERC'){
        const percentage = feeValue.split(':')[1];
        const charge = feeValue.split(':')[0];
        return Math.round(Number(charge) + (transActionAmount * (Number(percentage)/100)))
    }
}

const getChargeAmount = (appliedFeeValue, bearsFee, transActionAmount) =>{
    if(bearsFee == true){
        return appliedFeeValue + transActionAmount;
    }else{
        return transActionAmount
    }
}

const getSettlementAmount = (chargeAmount, appliedFeeValue) =>{
    return chargeAmount - appliedFeeValue
}

module.exports = {
    getAppliedFeeValue,
    getChargeAmount,
    getSettlementAmount
}