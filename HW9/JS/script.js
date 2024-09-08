// script.js

// Клас для створення картки публікації
class Card {
    constructor(post, user) {
        this.post = post;
        this.user = user;
        this.cardElement = this.createCard();
    }

    createCard() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `
            <h2>${this.post.title}</h2>
            <p>${this.post.body}</p>
            <p><strong>${this.user.name}</strong> (${this.user.email})</p>
            <button class="delete-button">Delete</button>
        `;

        const deleteButton = cardDiv.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => this.deletePost(cardDiv));

        return cardDiv;
    }

    // Метод для видалення публікації
    async deletePost(cardElement) {
        try {
            const response = await fetch(`https://ajax.test-danit.com/api/json/posts/${this.post.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                cardElement.remove();
                console.log(`Post ${this.post.id} deleted successfully`);
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Метод для додавання картки в DOM
    addToDOM(parentElement) {
        parentElement.appendChild(this.cardElement);
    }
}

// Функція для отримання даних з API
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
}

// Основна функція для завантаження даних та відображення карток
async function loadFeed() {
    try {
        const [users, posts] = await Promise.all([
            fetchData('https://ajax.test-danit.com/api/json/users'),
            fetchData('https://ajax.test-danit.com/api/json/posts')
        ]);

        const rootElement = document.getElementById('root');
        posts.forEach(post => {
            const user = users.find(user => user.id === post.userId);
            if (user) {
                const card = new Card(post, user);
                card.addToDOM(rootElement);
            }
        });
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

// Виклик основної функції для завантаження даних
loadFeed();
