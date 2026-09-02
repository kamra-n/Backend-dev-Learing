// const throwError = () => {

//     try {
//         console.log('read try');
//         // throw new Error('Error from catch');
//         // console.log('errpr')
//     }

//     catch (error) {

//         console.log(error)
//     }
// }

// throwError()

function addTwoNums(a, b) {
    try {
        if (typeof (a) != 'number') {
            throw new ReferenceError('the first argument is not a number')
        } else if (typeof (b) != 'number') {
            throw new ReferenceError('the second argument is not a number')
        } else {
            console.log(a + b)
        }
    } catch (err) {
        console.log(err)
    }
}


addTwoNums(1,
    '1'
)