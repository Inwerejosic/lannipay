const express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser');
const {createResult} = require('./helpers/reusable')
const {getAppliedFeeValue, getChargeAmount, getSettlementAmount} = require('./controllers/calculate.value');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/fees', (req, res) => {
    
    const FeeConfigurationSpec = req.body.FeeConfigurationSpec;
    const settingsArray = FeeConfigurationSpec.split('\n');
    const recordsToSaveArray = []
    for(let i = 0; i < settingsArray.length; i++){
        const record = settingsArray[i].split(' ');
        const recordObject = {};
        recordObject.feeId = record[0];
        recordObject.feeCurrency = record[1];
        recordObject.feeLocale = record[2];
        recordObject.feeEntity = record[3].split('(')[0];
        recordObject.entityProperty = record[3].split('(')[1].split('').slice(0, -1).join('');
        recordObject.feeType = record[6];
        recordObject.feeValue = record[7].split('').slice(0).join('');
        recordsToSaveArray.push(recordObject)

    }
    // Helping to save the FeeConfigurationSpec into the Json file
    const jsonFormat = JSON.stringify(recordsToSaveArray)
    fs.writeFileSync("./database.json", jsonFormat);
    res.status(200).json({
        "status": "ok"
      })
})

app.post('/compute-transaction-fee', (req,res)=>{
    try{
        const FeeConfigurationSpec = fs.readFileSync('./database.json',
            {encoding:'utf8', flag:'r'});
        const configuration = JSON.parse(FeeConfigurationSpec);
        let result  = {};
        const { Amount, Currency, PaymentEntity, Customer, CurrencyCountry }  = req.body
        const local = CurrencyCountry == PaymentEntity.Country ? 'LOCL' : 'INTL';
        const response = {};
        const feeLocales = configuration.map((item) => item.feeLocale)
        for(let i = 0; i < configuration.length; i++){
            if(Currency == configuration[i].feeCurrency){
                if(configuration[i].feeLocale == local){
                    if(configuration[i].feeEntity == PaymentEntity.Type){
                        if(PaymentEntity.Type == 'USSD'){
                            if(PaymentEntity.Issuer == configuration[i].entityProperty){
                                let outcome = createResult(configuration[i], Amount, Customer);
                                result = {...outcome}
                            }
                            if(configuration[i].entityProperty == '*' && Object.keys(result).length === 0){
                                let outcome = createResult(configuration[i], Amount, Customer);
                                result = {...outcome}
                            }
                        }
                        if(PaymentEntity.Type !== 'USSD'){
                            if(PaymentEntity.Type == configuration[i].feeEntity){
                                let outcome = createResult(configuration[i], Amount, Customer);
                                result = {...outcome}
                            }
                        }
                    }
                    if(configuration[i].feeEntity == '*' && Object.keys(result).length === 0) {
                       
                        if(PaymentEntity.Issuer == configuration[i].entityProperty){
                            let outcome = createResult(configuration[i], Amount, Customer);
                            result = {...outcome}
                        }
                        if(configuration[i].entityProperty == '*' && Object.keys(result).length === 0){
                            let outcome = createResult(configuration[i], Amount, Customer);
                            result = {...outcome}
                        }
                    }

                }
                  else if( configuration[i].feeLocale == '*' && Object.keys(result).length === 0){                
                    if(configuration[i].feeEntity == PaymentEntity.Type){
                        if(PaymentEntity.Type == 'USSD'){
                            if(PaymentEntity.Issuer == configuration[i].entityProperty){
                                let outcome = createResult(configuration[i], Amount, Customer);
                                result = {...outcome}
                            }
                            if(configuration[i].entityProperty == '*' && Object.keys(result).length === 0){
                                let outcome = createResult(configuration[i], Amount, Customer);
                                result = {...outcome}
                            }
                        }

                    }
                    if(configuration[i].feeEntity == '*' && Object.keys(result).length === 0){
                        if(PaymentEntity.Issuer == configuration[i].entityProperty){
                            let outcome = createResult(configuration[i], Amount, Customer);
                            result = {...outcome}
                        }
                        if(configuration[i].entityProperty == '*' && Object.keys(result).length === 0){
                            let outcome = createResult(configuration[i], Amount, Customer);
                            result = {...outcome}
                        }
                    }
                }

            }
        }

        if(Object.keys(result).length === 0){
            return res.status(400).json({
                "Error": "No fee configuration for USD transactions."
              })
        }else{
            return res.status(200).json(result)
        }
    }catch(err){
        return res.status(400).json({
            error: err
        })
    }

})
app.listen(9000, () =>{
	console.log('Server running')
})
