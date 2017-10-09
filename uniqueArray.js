const unique = (arr) => /*TODO*/
{
  return Array.from(new Set(arr));
}

let r1 = unique([0, 1, 2, 2, 3, 3, 4]) // => [0, 1, 2, 3, 4]
let r2  =unique([0, 1, '1', '1', 2]) // => [0, 1, '1', 2]

console.log(r1);
console.log(r2);