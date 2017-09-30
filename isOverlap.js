// const rect1 = { x: 100, y: 100, width: 100, height: 100 }
// const rect2 = { x: 150, y: 150, width: 100, height: 100 }

const rect1 = { "x": 100, "y": 100, "width": 100, "height": 100 }
const rect2 = { "x": 201, "y": 201, "width": 100, "height": 100 }


const result = isOverlap(rect1, rect2) // => true
console.log(result);

function isOverlap(rect1, rect2) {
    const rect3 = Object.assign({}, rect1);
    f(rect3, rect2.width, rect2.height);
    f(rect2);
    console.log(JSON.stringify(rect3));
    console.log(JSON.stringify(rect2));
    if (rect2.xx >= rect3.xMin && rect2.xx <= rect3.xMax && rect2.yy >= rect3.yMin && rect2.yy <= rect3.yMax) {
        console.log(1);
        return true;
    }
    return false;

}

function f(rect, w, h) {
    rect.xx = rect.x + rect.width / 2;
    rect.yy = rect.y + rect.height / 2;
    if (w) {
        rect.xMin = rect.x - w / 2;
        rect.xMax = rect.x + rect.width + w / 2;
    }
    if (h) {
        rect.yMin = rect.y - h / 2;
        rect.yMax = rect.y + rect.height + h / 2;
    }
}

// {"x":45.43265640025349,"y":66.11110394790254,"width":86.47371196651031,"height":147.28912397891602},
// {"x":561.4001613790565,"y":233.31766769692214,"width":135.80798223309952,"height":537.6337087318153} 

// {"x":100,"y":100,"width":100,"height":100}, {"x":201,"y":201,"width":100,"height":100}  // false