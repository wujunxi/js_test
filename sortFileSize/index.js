const path = require('path');
const fs = require('fs');

const PATH = 'd:\\Work\\ue_web\\branches\\1.66.0\\src\\images';
const RESULT_JSON_PATH = path.join(__dirname, 'result.json');

main();

function main() {
    let infoList = [];
    handleDir(PATH, infoList).then(function() {
        infoList.sort((a, b) => {
            return b.size - a.size;
        });
        console.log('save to file : start');
        save2File(JSON.stringify(infoList)).then(function() {
            console.log('save to file : finish');
        });
        analyze(infoList);
    });
}

function analyze(list) {
    let maxSize, minSize, total, types = {},
        temp, gt = 0,
        lt = 0;
    const kb = 100, SIZE = kb * 1024;
    total = list.length;
    maxSize = list[0].size;
    minSize = list[total - 1].size;
    list.forEach(function(item) {
        let suffix = item.name.match(/\.\w+$/g);
        suffix = suffix ? suffix[0] : 'unknown';
        if (types[suffix]) {
            types[suffix]++;
        } else {
            types[suffix] = 1;
        }
        item.size > SIZE ? gt++ : lt++;
    });
    console.log(`total:${total}\tmaxSize:${maxSize}\tminSize:${minSize}`);
    temp = '';
    Object.keys(types).forEach(function(k) {
        temp += k + ':' + types[k] + '\t';
    });
    console.log(temp);
    console.log(`>${kb}kb : ${gt}\t<${kb}kb : ${lt}`);
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