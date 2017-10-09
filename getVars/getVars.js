const fs = require('fs');
const path = require('path');
const cssConfig = require('./config');

const root = 'D:\\Work\\ue_web\\branches\\1.66.0\\src\\views';
const loadJs = 'D:\\Work\\ue_web\\branches\\1.66.0\\src\\js\\load.js';

let filesCount = 0;


// <c:set var="projectName" value="activity" />

function main() {
    const dirs = fs.readdirSync(root);
    // console.log(dirs);
    // 读取文件夹
    dirs.forEach(function(dir, i) {
        let dirPath = path.join(root, dir);
        // console.log(dirPath);
        let p = path.resolve(dirPath, 'common/base.jsp');
        // console.log(p);
        // 读取文件夹下的 base.jsp 文件，获取模块名
        fs.readFile(p, 'utf8', function(err, data) {
            if (err) {
                console.log(`${p} not exists.`);
                return
            }
            // 匹配模块变量名
            let result = data.match(/var\="projectName"\s+value\="(\w+)"/);
            if (result.length) {
                processFolder(dirPath, result[1]);
            } else {
                console.log(`${dir}'s module name not found`);
            }
        });
    });
}

// <script type="text/javascript" src="${staticScriptPath}/js/load.js?v=${staticVersion}"></script>
// <script type="text/javascript" src="${staticPath}/js/load.js?v=${timestamp}"></script>

// 1.遍历文件夹下文件，根据模块名获取配置文件中css文件路径，生成 
// <link rel="stylesheet" href="${staticPath}/bonus/winner/css/style.css?v=${staticVersion}" />
// 标签替换掉 
// <script type="text/javascript">var ctx = "${staticPath}"; var projectName = "${projectName}"; var cssUrl = 'index';</script>

// 2. 同时，将改文件中的 
// <script type="text/javascript" src="${staticPath}/js/load.js?v=${timestamp}"></script> 
// 替换为
// <%@ include file="/WEB-INF/common/pageConfig.jsp"%>

function processFolder(dirPath, moduleName) {
    // console.log(`module --> ${moduleName}`);
    fs.readdirSync(dirPath).forEach(function(name) {
        // console.log(name);
        let p = path.resolve(dirPath, name);
        let stat = fs.statSync(p);
        if (stat.isDirectory()) {
            processFolder(p, moduleName);
        } else if (name.endsWith('.jsp')) {
            findScriptsInFile(p, { moduleName, fileName: name });
        }
    });
}

main();
// findScriptsInFile('D:\\Work\\ue_web\\branches\\1.66.0\\src\\views\\account\\flexible-invest-detail.jsp');
// findScriptsInFile('D:\\Work\\ue_web\\branches\\1.66.0\\src\\views\\account\\autoInvest-detail.jsp', { isShowObj: true, isShowMatch: true });

const VAR_REG = /<script(\s+type\="text\/javascript")?>([\S\s]+?)<\/script\>/;
const VAR_REG_STR = '<script(\\s+type\="text\\/javascript")?>([\\S\\s]+?)<\\/script\>';
const PROPS = ['projectName', 'cssUrl', 'ctx', 'contentPath', 'siteroot', 'path_wdate'];
const LOAD_JS_REG = /<script(\s+type="text\/javascript")?\s+src="(.+?)\/js\/load\.js(\?.+?)?"(\s+type="text\/javascript")?\s*><\/script>/g;

function findScriptsInFile(p, { isShowObj = false, isShowMatch = false, isShowIllegal = false, moduleName, fileName }) {
    fs.readFile(p, 'utf-8', function(err, data) {
        if (err) {
            console.err(err);
            return;
        }
        // const cssLink = '<link rel="stylesheet" href="${staticPath}/bonus/winner/css/style.css?v=${staticVersion}" />';
        // 匹配<script>定义
        let matchResults = data.match(new RegExp(VAR_REG_STR, 'g'));
        // 匹配 load.js
        let matchResults2 = data.match(LOAD_JS_REG);
        let hasLoadScript = !!matchResults2;
        if (matchResults) {
            matchResults.forEach(matchResult => {
                if (isShowMatch) {
                    console.log(matchResult);
                }
                // 匹配变量定义
                let scripts = matchResult.match(new RegExp(VAR_REG_STR))[2];
                let obj = matchVar2Obj(scripts);
                if (isShowObj) {
                    console.log(obj);
                }
                // 忽略空对象
                if (isEmptyObj(obj)) {
                    return;
                }
                // 筛选所有变量是否符合要求
                let isAllVarMatch = isPropInArry(obj, PROPS);
                if (isAllVarMatch) {
                    // console.log(`${p}\n\t${scripts}`);
                    // 检查是否有load.js
                    if (hasLoadScript) {
                        if (matchResults2.length > 1) {
                            console.log(`warn:has more than one load.js ${p}`);
                            return;
                        }
                        // console.log(matchResult);
                        let temp = cssConfig[moduleName][obj.cssUrl];
                        if (temp) {
                            let cssLink = '<link rel="stylesheet" href="${staticPath}' + temp + '?v=${staticVersion}" />';
                            // console.log(cssLink);
                            let loadScriptText = matchResults2[0];
                            let varScriptText = matchResult;
                            // console.log(matchResult);
                            // <%@ include file="/WEB-INF/common/pageConfig.jsp"%>
                            let replaceResult = data.replace(varScriptText,cssLink)
                                .replace(loadScriptText,'<%@ include file="/WEB-INF/common/pageConfig.jsp"%>');
                            fs.writeFileSync(p,replaceResult);
                        } else {
                            console.log(`no found css info: ${p} \n\t\t${moduleName} ${JSON.stringify(obj)} `);
                        }
                    }else{
                        console.log(`not found load.js : ${p}`);
                    }
                } else {
                    // 找出不是标准定义的变量，打印出该文件路径
                    if (isShowIllegal && hasPropInArray(obj, PROPS)) {
                        console.log(`${p}\n\t${scripts}`);
                    }
                }
            });
        }
    });
}

function isEmptyObj(obj) {
    return Object.keys(obj).length == 0;
}

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

function matchVar2Obj(scripts, isShowWarn = false) {
    let matchResult = scripts.match(/[\s|,]\w+\s*=\s*['"](.+?)['"]/g);
    // console.log(matchResult);
    let obj = {},
        k, v, matchResult2;
    if (matchResult) {
        for (let i of matchResult) {
            matchResult2 = i.trim().match(/(\w+)\s*=\s*['"](.+?)['"]/);
            if (matchResult2) {
                k = matchResult2[1];
                v = matchResult2[2];
                obj[k] = v;
            }
        }
    } else {
        if (isShowWarn) {
            // 把不符合的脚本打印出来，人工筛选
            console.log(`warn:${scripts}`);
        }
    }
    return obj;
}

// console.log(/(\w+)\s*=\s*['"](.+)['"]/.test("var flexInvestDetailStatus = '${flexInvestDetail.investStatus}'"))