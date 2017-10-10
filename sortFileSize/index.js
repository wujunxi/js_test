const path = require('path');
const fs = require('fs');

const PATH = 'd:\\Work\\ue_web\\branches\\1.66.0\\src\\images';
const RESULT_JSON_PATH = path.join(__dirname, 'result.json');

main();

function main() {
    let infoList = [];
    handleDir(PATH, infoList).then(function() {
        let result = `total:${infoList.length}`;
        console.log(result);
        infoList.sort((a, b) => {
            return b.size - a.size;
        });
        save2File(JSON.stringify(infoList)).then(function(){
            console.log('finish');
        });
    });
}

function save2File(data) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(RESULT_JSON_PATH, data, 'utf-8', function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function handleDir(dirPath, list) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirPath, function(err, files) {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    }).then(function(files) {
        let promiseList = [];
        files.forEach(f => {
            let p = path.join(dirPath, f);
            let promise = new Promise(function(resolve, reject) {
                fs.stat(p, function(err, stat) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (stat.isFile()) {
                        list.push({ path: p, name: f, size: stat.size });
                        resolve();
                    } else if (stat.isDirectory()) {
                        handleDir(p, list).then(resolve);
                    }
                });
            });
            promiseList.push(promise);
        });
        return Promise.all(promiseList);
    });
}