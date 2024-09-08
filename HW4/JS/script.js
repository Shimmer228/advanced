const books = [
    { 
      author: "Люсі Фолі",
      name: "Список запрошених",
      price: 70 
    }, 
    {
      author: "Сюзанна Кларк",
      name: "Джонатан Стрейндж і м-р Норрелл",
    }, 
    { 
      name: "Дизайн. Книга для недизайнерів.",
      price: 70
    }, 
    { 
      author: "Алан Мур",
      name: "Неономікон",
      price: 70
    }, 
    {
      author: "Террі Пратчетт",
      name: "Рухомі картинки",
      price: 40
    },
    {
      author: "Анґус Гайленд",
      name: "Коти в мистецтві",
    }
  ];
  
  const root = document.getElementById('root'); 
  const ul = document.createElement('ul'); 
  
  books.forEach((book, index) => {
    try {
      if (!book.author) throw new Error(`Missing property 'author' in book at index ${index}`);
      if (!book.name) throw new Error(`Missing property 'name' in book at index ${index}`);
      if (book.price === undefined) throw new Error(`Missing property 'price' in book at index ${index}`);
      
      const li = document.createElement('li');
      li.textContent = `${book.name} - ${book.author} (Ціна: ${book.price} грн)`;
      ul.appendChild(li);
    } catch (error) {
      // Помилка
      console.error(error.message);
    }
  });
  
  root.appendChild(ul);
  