const fs = require('fs');
const path = require('path');

const root = 'D:\\Work\\ue_web\\branches\\1.66.0\\src\\views';

main();

// <c:set var="projectName" value="activity" />

function main(){
    const dirs = fs.readdirSync(root);
    // console.log(dirs);
    dirs.forEach(function(dir,i){
        let p = path.resolve(root,dir+'/common/base.jsp');
        // console.log(p);
        fs.readFile(p,'utf8',function(err,data){
            if(err){
                console.log(`${p} not exists.`);
                return
            }
            let result = data.match(/var\="projectName"\s+value\="(\w+)"/);
            console.log(result.length ? result[1] : 'not found');
        });
    });
}