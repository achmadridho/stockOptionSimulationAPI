
maximumProfitCalculateSugestion = (opts) => {
    return new Promise(async (resolve, reject) => {
        try {
            let i=0;
            let conclusion="";
            let buy=true;
            if (i>=opts.length-1)resolve([opts,"Not Enough Data to make conclusion"]);
            while (i !== opts.length-1){
                opts[i].action="-";
                if(opts[i].open < opts[i+1].open){
                    if(buy){
                        conclusion+="Buy on day "+(i+1);
                        opts[i].action="BUY";
                        buy=false;
                    }
                }else {
                    if(!buy){
                        conclusion+=" Sell on day "+(i+1)+", ";
                        opts[i].action="SELL";
                        buy = true;
                    }
                }
                i++;
            }
            if(!buy)
            {
                conclusion+=" Sell on day "+(i+1);
                opts[i].action="SELL";
            }
            resolve([opts,conclusion])
        } catch (error) {
            reject(error)
        }
    })
};


module.exports = { maximumProfitCalculateSugestion };