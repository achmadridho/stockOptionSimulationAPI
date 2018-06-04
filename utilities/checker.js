
checkBody = (params, body) => {
    for(let i = 0; i < params.length; i++){
        if(!(params[i] in body)) return false
    }
    return true
};
isNumeric=(Num)=>{return !isNaN(Num)};

checkDate = (date) => {
    if (new Date().getDate() <= new Date(date).getDate())return false;
    return true
};
module.exports={checkBody,isNumeric,checkDate};