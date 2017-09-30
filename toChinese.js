function toChinese(num){
    let str = num + '',
    len = str.length;
    str = str.replace(/\d/g,s=>{
        const ar = ['零','一','二','三','四','五','六','七','八','九'];
        return ar[s]; 
    }).replace(/(.)/g,function(...rest){
        // console.log(arguments);
        const ar = ['','十','百','千','万','十','百','千','亿','十','百','千','兆'];
        return rest[1] + ar[len-rest[2]-1];
    }).replace(/零[十百千]/g,'零')
    .replace(/零{2,}/g,'零')
    .replace(/零$/,'')
    .replace(/零万/,'万');
    return str;
}


// console.log(toChinese(123456));
// console.log(toChinese(66478016));
console.log(toChinese(60000006));