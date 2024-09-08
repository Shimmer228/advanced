const books = [{
    name: 'Harry Potter',
    author: 'J.K. Rowling'
  }, {
    name: 'Lord of the rings',
    author: 'J.R.R. Tolkien'
  }, {
    name: 'The witcher',
    author: 'Andrzej Sapkowski'
  }];
  
  const bookToAdd = {
    name: 'Game of thrones',
    author: 'George R. R. Martin'
  };
  
  const updatedBooks = [...books, bookToAdd];
  console.log(updatedBooks);
  
  //6

  const employee = {
    name: 'Vitalii',
    surname: 'Klichko'
  };
  
  const newEmployee = {
    ...employee,
    age: 30,
    salary: 5000
  };
  
  console.log(newEmployee);
  
  //7
  const array = ['value', () => 'showValue'];

    const [value, showValue] = array;

    alert(value); // має бути виведено 'value'
    alert(showValue());  // має бути виведено 'showValue'
