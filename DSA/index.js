// write a function that searches for an element in an array and returns the index , if the element is not present then just return -1


const elementArray = [1, 2, 3, 46, 7, 9, 0]

const searchElement = (userInput, elemenlettArray) => {
  for (let i = 0; i < elemenlettArray.length; i++) {
    if (userInput == elemenlettArray[i]) {
      return i;
    }

    // console.log(elemenlettArray[i]);
  }

  return -1;

  //todo

}

const result = searchElement(1, elementArray);
console.log('result', result);