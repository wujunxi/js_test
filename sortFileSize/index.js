const path = require('path');
const fs = require('fs');

const PATH = 'd:\\Work\\ue_web\\branches\\1.66.0\\src\\images';
const RESULT_JSON_PATH = path.join(__dirname, 'result.json');
const MAP_JSON_PATH = path.join(__dirname, 'map.json');
const TEMP_DIR = path.join(__dirname, 'temp');

// main();
cpBack();

function main() {
    let infoList = [];
    handleDir(PATH, infoList).then(function() {
        infoList.sort((a, b) => {
            return b.size - a.size;
        });
        // console.log('save to file : start');
        // save2File(JSON.stringify(infoList), RESULT_JSON_PATH).then(function() {
        //     console.log('save to file : finish');
        // });
        // analyze(infoList, [
        //     // 过滤文件类型
        //     function(item) {
        //         if (!/\.(jpg|png|gif|swf)$/.test(item.name)) {
        //             console.log(item.path);
        //         }
        //     }
        // ]);
        // clearDir(TEMP_DIR);
        // mkDir(TEMP_DIR);
        // cp2NewDir(infoList);
    });
}

function cpBack(){
    let promise, promises = [];
    const map = require(MAP_JSON_PATH);
    // console.log(map);
    map.forEach(function(item){
        promise = new Promise(function(resolve, reject) {
            fs.copyFile(item.dist, item.src, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        promises.push(promise);
    });
    console.log('cpBack -- start');
    Promise.all(promises).then(function() {
        console.log('cpBack -- finish');
    });
}

function cp2NewDir(list) {
    let suffex, dist, promise, promises = [],
        map = [];
    list.forEach(function(item, i) {
        if (/\.(jpg|png)$/.test(item.name)) {
            suffex = item.name.match(/\.\w+$/g)[0];
            dist = path.join(TEMP_DIR, i + suffex);
            map.push({ src: item.path, dist: dist });
            promise = new Promise(function(resolve, reject) {
                fs.copyFile(item.path, dist, function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            promises.push(promise);
        }
    });
    console.log('cp2NewDir -- start');
    Promise.all(promises).then(function() {
        console.log('cp2NewDir -- finish');
    });
    save2File(JSON.stringify(map), MAP_JSON_PATH);
}

function mkDir(p) {
    return new Promise(function(resolve, reject) {
        fs.mkdir(p, function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function clearDir(p) {
    return new Promise(function(resolve, reject) {
        fs.rmdir(p, function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function analyze(list, tasks = []) {
    let maxSize, minSize, total, types = {},
        temp, gt = 0,
        lt = 0;
    const kb = 100,
        SIZE = kb * 1024;
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
        tasks.forEach(function(t, i) {
            t(item, i);
        });
    });
    console.log(`total:${total}\tmaxSize:${maxSize}\tminSize:${minSize}`);
    temp = '';
    Object.keys(types).forEach(function(k) {
        temp += k + ':' + types[k] + '\t';
    });
    console.log(temp);
    console.log(`>${kb}kb : ${gt}\t<${kb}kb : ${lt}`);
}

function save2File(data, dist) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(dist, data, 'utf-8', function(err) {
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