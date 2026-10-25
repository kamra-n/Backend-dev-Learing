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

let arr = [2, -9, 17, 0, 1, -10, -4, 8];

let counter = 0;

const countNegativeNumbers = (arr) => {
    for (var i = 0; i < arr.length; i++) {

        if (arr[i] < 0) {
            counter++;
        }
    }

    return counter;
}


const result = countNegativeNumbers(arr);
console.log('result', result);
