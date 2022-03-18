const express = require('express')
const fs = require('fs')
const cors = require('cors')

const app = express();


app.post('/fees', (req, res) => {
    // console.log("Hi")
    const FeeConfigurationSpec = "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55";

    // Helping to save the FeeConfigurationSpec into the Json file
    fs.writeFileSync("./database.json", FeeConfigurationSpec);
    res.status(200).json(FeeConfigurationSpec.split('\n'))
})

app.post('/read', (req,res)=>{
    try{
        const FeeConfigurationSpec = fs.readFileSync('./database.json',
            {encoding:'utf8', flag:'r'});
    const result = FeeConfigurationSpec.split('\n')
    console.log(result[0])
    if(result[3] === "LNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100")
        console.log(3*4)
    else
        console.log(result)
    
    res
        .json({
        message: result
    })
    }catch(err){
        res.err()
    }

})
app.listen(9000, () =>{
	console.log('Server running')
})
