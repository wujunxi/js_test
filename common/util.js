const fs = require('fs');
const path = require('path');

/**
 * 是否所有的属性都是数组中的值
 * 
 * @param {any} obj 
 * @param {any} ar 
 * @returns 
 */
function isPropInArry(obj, ar) {
    return Object.keys(obj)
        .every(k => ar.includes(k));
}

/**
 * 是否存在属性是数组中的值
 * 
 * @param {any} obj 
 * @param {any} ar 
 * @returns 
 */
function hasPropInArray(obj, ar) {
    return Object.keys(obj)
        .some(k => ar.includes(k));
}

/**
 * 判断是否空对象
 * 
 * @param {any} obj 
 * @returns 
 */
function isEmptyObj(obj) {
    return Object.keys(obj).length == 0;
}


/**
 * 清理文件夹
 * 
 * @param {any} p 
 * @returns 
 */
async function clearDir(p) {
    let files = await readdir(p);
    for (let i = 0, file, len = files.length; i < len; i++) {
        file = files[i];
        let filePath = path.join(p, file);
        let st = await stat(filePath);
        if (st.isDirectory()) {
            await clearDir(filePath);
        } else if (st.isFile()) {
            await unlink(filePath);
        }
    }
}

function unlink(p) {
    return new Promise(function(resolve, reject) {
        fs.unlink(p,function(err){
            if(err){
                reject(err);
                return ;
            }
            resolve();
        });
    });
}

function mkdir(p) {
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

function readdir(p) {
    return new Promise(function(resolve, reject) {
        fs.readdir(p, function(err, files) {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });
}


function stat(p) {
    return new Promise(function(resolve, reject) {
        fs.stat(p, function(err, s) {
            if (err) {
                reject(err);
                return;
            }
            resolve(s);
        })
    });
}


/**
 * fs.rmdir(Promise)
 * 
 * @param {any} p 
 * @returns 
 */
function rmdir(p) {
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

// exports.clearDir = clearDir;
export default {
    clearDir
};