/*
const numbers = flatten2([1, [[2], 3, 4], 5])
numbers.next().value // => 1
numbers.next().value // => 2
numbers.next().value // => 3
numbers.next().value // => 4
numbers.next().value // => 5
*/

function* flatten2(arr) {
    /* TODO */
    let ar = arr.length ? JSON.stringify(arr).replace(/\[|\]/g, '').split(',') : [];
    for (let i of ar) {
        yield parseInt(i)
    }
}

const numbers = flatten2([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [6, [7, [8, 9, 10, [11], 12], 13], 14, [15, [16],
        [17]
    ]]
])
for (let i = 0; i < 35; i++) {
    console.log(numbers.next().value) // => 1
}