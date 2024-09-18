let x = 10;
const p = new Promise(function(resolve, reject) {
    setTimeout(() => {
        x = 20
       if(x > 15) {
        resolve(x)
       } else {
        reject('X is not valie')
       }
    }, 1099);
})

console.log('X ',x);

// p.then(function(result) {
// console.log('Good.. ',result);

// }).catch(function(err){
//     console.log('Err ',err);
    
// })
myfn()
async function myfn() {
    try {
        const val =  await p;
        console.log(val)
    } catch (error) {
        console.log('Err ',error);
        
    }
}
console.log('This cll');
