const router = require('koa-router')();
const {requestResponse}=require('../setup');
const {checkBody}=require('../utilities/checker');
const {isNumeric}=require('../utilities/checker');
const {checkDate}=require('../utilities/checker');
const {maximumProfitCalculateSugestion}=require('../utilities/calculate');
const {readFileJSON}=require('../utilities/files');
const {writeFileJSON}=require('../utilities/files');


router.get('/stocks/option', async (ctx, next) => {
    try {
        let stockOptions=await readFileJSON(__dirname+'/resultfile.json');
        let conclusion="";
        [stockOptions,conclusion]=await maximumProfitCalculateSugestion(stockOptions);
        let respMsg=Object.assign(requestResponse.common_success);
        respMsg.results=stockOptions;
        respMsg.conclusion=conclusion;
        ctx.body=respMsg;
    } catch (error) {
        console.log("Error : ", error);
        ctx.body = requestResponse.common_error
    }
});
router.post('/stocks/option/submit', async (ctx, next) => {
    if (checkBody(['date', 'open','high', 'low', 'close','volume_trade'],  Object.assign(ctx.request.body, ctx.request.header))) {
        try {
            let query={}
            query.date=ctx.request.body.date;
            query.open=ctx.request.body.open;
            query.high=ctx.request.body.high;
            query.low=ctx.request.body.low;
            query.close=ctx.request.body.close;
            query.volume_trade=ctx.request.body.volume_trade;
            console.log(query)
            let gotError=false;
            let errList=[];
            if (checkDate(query.date)){
                gotError=true;
                errList.push("Date Error : The Date must be Bigger or Equal to today date")
            }
            if (!isNumeric(query.open)){
                gotError=true;
                errList.push("Open Error : "+query.open+" Is Not a Valid Number")
            }
            if (!isNumeric(query.high)){
                gotError=true;
                errList.push("High Error : "+query.high+" Is Not a Valid Number")
            }
            if (!isNumeric(query.low)){
                gotError=true;
                errList.push("Low Error : "+query.low+" Is Not a Valid Number")
            }
            if (!isNumeric(query.close)){
                gotError=true;
                errList.push("Close Error : "+query.close+" Is Not a Valid Number")
            }
            if(gotError){
                let respMsg = Object.assign(requestResponse.submit_error);
                respMsg.error=errList;
                ctx.body = respMsg;
            }else {
                let stockOptions=await readFileJSON(__dirname+'/resultfile.json');
                if(stockOptions.length>0){
                    let checkSameDate=false;
                    let arrayMap=stockOptions.map(async stock=>{
                        if(new Date(stock.date).getDate()===new Date(query.date).getDate()){
                            stock.open=query.open;
                            stock.high=query.high;
                            stock.low=query.low;
                            stock.close=query.close;
                            checkSameDate=true
                        }
                        return stock;
                    });
                    stockOptions=await Promise.all(arrayMap);
                    if(!checkSameDate){
                     stockOptions.push(query);
                    }
                }else stockOptions.push(query);
                await writeFileJSON(stockOptions,__dirname+'/resultfile.json');
                let conclusion="";
                [stockOptions,conclusion]=await maximumProfitCalculateSugestion(stockOptions);
                let respMsg = Object.assign(requestResponse.common_success);
                respMsg.results=stockOptions;
                respMsg.conclusion=conclusion;

                ctx.body = respMsg;

            }

        } catch (error) {
            console.log("Error : ", error);
            ctx.body = requestResponse.common_error
        }
    }
});
module.exports = router;