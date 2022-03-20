// if (' NGN NG =>LOCL CREDIT-CARD(*) : APPLY PERC 1.4' = AppliedFeeValue = (1.4 / 100) * 1500)

// if (result[])
//     AppliedFeeValue = (1.4 / 100) * 1500)

// 'LNPY0222 NGN LOCL CREDIT-CARD(*) : APPLY FLAT 140' = AppliedFeeValue = 140

// if ('LNPY0223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 140:1.4' = AppliedFeeValue = 140 + ((1.4 / 100) * 1500)



// if Customer.BearsFee is true, ChargeAmount = Transaction Amount + AppliedFeeValue
// if Customer.BearsFee is false, ChargeAmount = Transaction Amount

// const SettlementAmount = ChargeAmount - AppliedFeeValue