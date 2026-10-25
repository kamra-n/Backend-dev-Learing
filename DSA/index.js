// write a function that searches for an element in an array and returns the index , if the element is not present then just return -1


// const elementArray = [1, 2, 3, 46, 7, 9, 0]

// const searchElement = (userInput, elemenlettArray) => {
//   for (let i = 0; i < elemenlettArray.length; i++) {
//     if (userInput == elemenlettArray[i]) {
//       return i;
//     }

//   }

//   return -1;


// }

// const result = searchElement(1, elementArray);
// console.log('result', result);


// write a function that returns the number of negative number in an array

// let arr = [2, -9, 17, 0, 1, -10, -4, 8];

// let counter = 0;

// const countNegativeNumbers = (arr) => {
//     for (var i = 0; i < arr.length; i++) {

//         if (arr[i] < 0) {
//             counter++;
//         }
//     }

//     return counter;
// }


// const result = countNegativeNumbers(arr);
// console.log('result', result);



// write a function that returns the largest number in an array


// let arr = [5, 0, 80, 8, 170, 1];

// function findLargest(arr) {
//     let largestNumber = 0;

//     for (var i = 0; i < arr.length; i++) {
//         if (arr[i] > largestNumber) {
//             largestNumber = arr[i]
//         }
//     }

//     return largestNumber;
// }


// const result = findLargest(arr);
// console.log(result);


// write a function that returns the lowest number in an array



/// use Infinity to find lowest number because Infinity is greater than any poosible integar
/// use -Infinity to find largest number because -Infinity is lower than any poosible integar


const arr = [1, 0, 3, 90, 7, 5, 89];
const findTheLowest = (arr) => {
    let lowestNumber = Infinity;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < lowestNumber) {

            lowestNumber = arr[i];
        }
    }
    return lowestNumber;

}




const result = findTheLowest(arr);

console.log(result);