const addClass = (dom, name) => {
    let str = dom.className;
    let ar = str.split(' ');
    if(!ar.includes(name)){
        ar.push(name);
    }
    dom.className = ar.join(' ');
}
const removeClass = (dom, name) => {
    let str = dom.className;
    let ar = str.split(' ');
    ar = ar.filter(i=>i!=name);
    dom.className = ar.join(' ');
}
const hasClass = (dom, name) => {
    let str = dom.className;
    let ar = str.split(' ');
    return ar.includes(name)
}

const dom = {
    className:'a b c d'
}

addClass(dom,'e')
console.log(dom);
removeClass(dom,'a');
console.log(dom)
console.log(hasClass(dom,'b'));