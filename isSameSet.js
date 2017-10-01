// 判断两个 Set 是否相同

const isSameSet = (s1, s2) => /* TODO */
{
    if(s1.size != s2.size) return false;
    // let jsonS1 = new Set(),
    // jsonS2 = new Set();
    // s1.forEach(i => jsonS1.push(JSON.stringify(i)));
    // s2.forEach(i => jsonS2.push(JSON.stringify(i)));
    let s3 = new Set();
    s1.forEach(i => s3.add(i));
    s2.forEach(i => s3.add(i));
    return s3.size == s1.size;
}

// console.log(JSON.stringify({}));

const a = {}
const b = 1
const c = 'ScriptOJ'

const set1 = new Set([a, b, c])
const set2 = new Set([a, c, b])

console.log(isSameSet(set1, set2)) // => true