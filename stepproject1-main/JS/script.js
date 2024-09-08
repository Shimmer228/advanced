// Коментарі щодо роботи: 
// робота Радіона: створив header, вхід, авторизацію, бекенд, створення візиту 
// робота Каті: фільтрація, рендер візиту, додавання методу "Показати більше", "Редагувати" та хрестика для видалення елементу, а також стилізацію. 
class User{
    constructor(login, token) {
        this.login = login; 
        this.token = token;
    }
    getToken(){
        if (this.token!==null) return this.token;
        return null;
        
    }
}
const user = new User();
user.token = null;
const authButton = document.getElementById("authButton");
const authModal = document.getElementById("authModal");
const createVisitModal = document.getElementById("createVisitModal");
const editVisitModal= document.getElementById("editVisitModal");
const closeButtons = document.querySelectorAll(".close, .close-modal");
//const closeButtonEdit= ocument.querySelectorAll(".close-modal-edit");

function closeModal(modal) {
    modal.style.display = "none";
}

async function deleteVisit(visitId) {
    makeAuthenticatedRequest(`https://ajax.test-danit.com/api/v2/cards/${visitId}`, 'DELETE')
    ShowingVisits(user.getToken())
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('#search-title').value = '';
    document.querySelector('#status').value = '';
    document.querySelector('#priority').value = '';
    user.token = null;
    console.log(user.getToken());
    function openModal(modal) {
        modal.style.display = "flex";
    }

  

    // Open auth modal
    authButton.addEventListener("click", function () {
        if (user.getToken() === null) {
            openModal(authModal);
        } else {
            openModal(createVisitModal);
        }
    });


    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            closeModal(authModal);
            closeModal(createVisitModal);
            closeModal(editVisitModal);
        });
    });


 // Submit authentication form
document.getElementById("authForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // AJAX request for authentication
     fetch('https://ajax.test-danit.com/api/v2/cards/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.text())
    .then(token => {
        //при успішній авторизації
        if (token!=="Incorrect username or password") {
           user.login = email;
           user.token = token;
            console.log(user) //дебаг
            closeModal(authModal);
            authButton.textContent = "Створити візит";
            document.getElementById('filter-form').style.display = 'block';
            document.getElementById('visit-block').style.display = 'none';
            alert("Успішна авторизація!");
            ShowingVisits(token);

        } else {
            alert("Невірний email або пароль");
            document.getElementById('filter-form').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during authentication.');
    });
    
});
});

  // Додавання динамічних полів для кожного лікаря
  doctorSelect.addEventListener("change", function () {
    const selectedDoctor = doctorSelect.value;
    additionalFields.innerHTML = "";  // Очищаємо попередні поля

    if (selectedDoctor === "cardiologist") {
        additionalFields.innerHTML = `
            <input type="text" name="bloodPressure" placeholder="Звичайний тиск" required>
            <input type="text" name="bmi" placeholder="Індекс маси тіла" required>
            <input type="text" name="cardioDiseases" placeholder="Перенесені захворювання серцево-судинної системи" required>
            <input type="number" name="age" placeholder="Вік" required>
            `;
        } else if (selectedDoctor === "dentist") {
            additionalFields.innerHTML = `
                <input type="date" name="lastVisitDate" placeholder="Дата останнього відвідування" required>
            `;
        } else if (selectedDoctor === "therapist") {
            additionalFields.innerHTML = `
                <input type="number" name="age" placeholder="Вік" required>
            `;
        }
    });

    // Обробка форми створення візиту
    document.getElementById("createVisitForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const visitData = {};

        formData.forEach((value, key) => {
            visitData[key] = value;
        });
        console.log(formData);

        // AJAX запит на створення нового візиту
        fetch('https://ajax.test-danit.com/api/v2/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.getToken()}`
            },
            body: JSON.stringify(visitData)
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                console.log()
                alert("Візит успішно створено!");
                closeModal(createVisitModal);
                ShowingVisits(user.getToken());
            } else {
                alert("Не вдалося створити візит.");
            }
        })
        .catch(error => {
            console.error("Помилка:", error);
            alert("Помилка при створенні візиту.");
        });
    });

// Метод для завантаження даних візиту та відкриття модального вікна редагування
function openEditModal(visitId) {
    fetch(`https://ajax.test-danit.com/api/v2/cards/${visitId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(visit => {
        // Заповнюємо поля модального вікна отриманими даними
        document.getElementById('doctorSelect').value = visit.doctor;
        document.querySelector('input[name="purpose"]').value = visit.purpose;
        document.querySelector('textarea[name="description"]').value = visit.description;
        document.querySelector('select[name="urgency"]').value = visit.urgency;

        document.querySelector('input[name="fullName"]').value = visit.fullName;
        document.querySelector('select[name="visit-status"]').value = visit.status;
        

        // Додаємо динамічні поля на основі лікаря
        generateDoctorFields(visit.doctor, visit);

        // Відкриваємо модальне вікно
        const modal = document.getElementById("createVisitModal");
        modal.style.display = "block";

        // Додаємо логіку для збереження редагованого візиту
        document.getElementById('createVisitForm').onsubmit = function (e) {
            e.preventDefault();
            updateVisit(visitId);
        };
    })
    .catch(error => {
        console.error("Помилка при завантаженні візиту для редагування:", error);
        alert("Не вдалося завантажити дані візиту.");
    });
}
// Метод для збереження змін у візиті після редагування
function updateVisit(visitId) {
    const formData = new FormData(document.getElementById('createVisitForm'));
    const updatedVisitData = {};

    formData.forEach((value, key) => {
        updatedVisitData[key] = value;
    });

    fetch(`https://ajax.test-danit.com/api/v2/cards/${visitId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedVisitData)
    })
    .then(response => response.json())
    .then(updatedVisit => {
        alert("Візит успішно оновлено!");
        closeModal(document.getElementById("createVisitModal"));
        updateVisitInList(updatedVisit);
    })
    .catch(error => {
        console.error("Помилка при оновленні візиту:", error);
        alert("Не вдалося оновити візит.");
    });
}
function openModal(modal) {
    modal.style.display = 'flex';
    
}

// }
// Функція для оновлення візиту в списку на сторінці
function updateVisitInList(updatedVisit, visitItem) {
    const visitCard = document.querySelector(`.visit-item[data-id="${updatedVisit.id}"]`);
    if (visitCard) {
        visitCard.querySelector('.visit-purpose').textContent = `Мета: ${updatedVisit.purpose}`;
        visitCard.querySelector('.visit-description').textContent = `Опис: ${updatedVisit.description}`;
        visitCard.querySelector('.visit-urgency').textContent = `Терміновість: ${updatedVisit.urgency}`;
        visitCard.querySelector('.visit-status').textContent = `Статус: ${updatedVisit.status || 'Open'}`;
        visitItem=updatedVisit

    }}






    async function ShowingVisits(token) {
        const visits = await fetchVisits(token);
        updateVisitList(visits);
    }






//7d3ff97d-09ed-42f0-ab53-1ba14d83f64e


class Visit {
    constructor({id, purpose, description, urgency, status, bloodPressure, bmi, cardioDiseases, lastVisitDate, age, fullName, doctorSelect}) {
        this.id = id; 
        this.purpose = purpose;
        this.description = description;
        this.urgency = urgency;
        this.status = status;
        this.bloodPressure = bloodPressure; 
        this.bmi = bmi; 
        this.cardioDiseases = cardioDiseases; 
        this.lastVisitDate = lastVisitDate; 
        this.age = age; 
        this.fullName = fullName;
        this.doctorSelect = doctorSelect;
    }
    
    render() {
        const visitItem = document.createElement('div');
        visitItem.classList.add('visit-item');
        visitItem.setAttribute('data-id', this.id);
        
        visitItem.innerHTML = `
            <h3 class="visit-purpose">Мета: ${this.purpose}</h3>
            <p class="visit-description">Опис: ${this.description}</p>
            <p class="visit-urgency">Терміновість: ${this.urgency}</p>
            <p class="visit-status">Статус: ${this.status}</p>
            <button class="btn show-more">Показати більше</button>
            <button class="btn edit-visit">Редагувати</button>
            <span class="delete-visit">&times;</span>
        `;
        
        visitItem.querySelector('.show-more').addEventListener('click', () => this.showMore(visitItem));
        visitItem.querySelector('.edit-visit').addEventListener('click', () => this.openEditModal(visitItem)); // Викликаємо редагування
        
        // Додавання обробника для видалення візиту
        visitItem.querySelector('.delete-visit').addEventListener('click', () => this.deleteVisit(visitItem));
    
        return visitItem;
    }

    openEditModal(visitItem) {
        const modal = document.getElementById('editVisitModal'); // Отримуємо модальне вікно
        const form = document.getElementById('editVisitForm');
        
        // Заповнюємо поля форми даними
        form.elements['doctorSelectEdit'].value = this.doctorSelect;
        form.elements['purpose'].value = this.purpose;
        form.elements['description'].value = this.description;
        form.elements['urgency'].value = this.urgency;
        form.elements['fullName'].value = this.fullName;
        form.elements['visit-status'].value = this.status;
        
        // Додаємо динамічні поля в залежності від лікаря
        this.generateDoctorFields(this.doctorSelect, this);
        document.getElementById('doctorSelectEdit').addEventListener('change', (event) => {
            const selectedDoctor = event.target.value;
            console.log(event.target.value);
            this.generateDoctorFields(selectedDoctor, {}); // Очищаємо поля при виборі нового лікаря
        });
        console.log(this.doctorSelect)

        // Показуємо модальне вікно
        modal.style.display = 'block';

        // Збереження змін
        form.onsubmit = (e) => {
            e.preventDefault();
            console.log('Submitting form...');
            this.editVisit(visitItem); // Оновлюємо візит
        };
    }

    editVisit(visitItem) {
        const form = document.getElementById('editVisitForm');
        const updatedVisitData = {
            doctorSelect: form.elements['doctorSelectEdit'].value,
            purpose: form.elements['purpose'].value,
            description: form.elements['description'].value,
            urgency: form.elements['urgency'].value,
            fullName: form.elements['fullName'].value,
            status: form.elements['visit-status'].value,
            bloodPressure: form.elements['bloodPressure'] ? form.elements['bloodPressure'].value : null,
            bmi: form.elements['bmi'] ? form.elements['bmi'].value : null,
            cardioDiseases: form.elements['cardioDiseases'] ? form.elements['cardioDiseases'].value : null,
            lastVisitDate: form.elements['lastVisitDate'] ? form.elements['lastVisitDate'].value : null,
            age: form.elements['age'] ? form.elements['age'].value : null
        };

        fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.getToken()}` // Використання токену для автентифікації
            },
            body: JSON.stringify(updatedVisitData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Помилка сервера');
                });
            }
            return response.json();
        })
        .then(updatedVisit => {
            alert("Візит успішно оновлено!");
            closeModal(document.getElementById("editVisitModal"));
            updateVisitInList(updatedVisit);
        })
        .catch(error => {
            console.error("Помилка при оновленні візиту:", error);
            alert("Не вдалося оновити візит. " + error.message);
        });
        
    }

    generateDoctorFields(doctor, visit) {
        const additionalFieldss = document.getElementById('additionalFieldss');
        additionalFieldss.innerHTML = ''; // Очищаємо попередні поля

        if (doctor === "Кардіолог"|| doctor === "cardiologist") {
            additionalFieldss.innerHTML = `
              <label>Тиск:</label>
                <input type="text" name="bloodPressure" value="${visit.bloodPressure || ''}" placeholder="Тиск">
                <label>Індекс маси тіла:</label>
                <input type="text" name="bmi" value="${visit.bmi || ''}" placeholder="Індекс маси тіла">
                 <label>Захворювання серця:</label>
                <input type="text" name="cardioDiseases" value="${visit.cardioDiseases || ''}" placeholder="Захворювання">
                <label>Вік:</label>
                <input type="number" name="age" value="${visit.age || ''}" placeholder="Вік">
            `;
        } else if (doctor === "Стоматолог"|| doctor==="dentist" ) {
            additionalFieldss.innerHTML = `
            <label>Дата останнього візиту:</label>
                <input type="date" name="lastVisitDate" value="${visit.lastVisitDate || ''}" placeholder="Дата останнього візиту">
            `;
        } else if (doctor === "Терапевт"|| doctor === "therapist") {
            additionalFieldss.innerHTML = `
            <label>Вік:</label>
                <input type="number" name="age" value="${visit.age || ''}" placeholder="Вік">
            `;
        }
    }

        showMore(visitItem) {
            if (!this.infoDiv) {
                this.infoDiv = document.createElement('div');
                // Перевіряємо тип лікаря і формуємо відповідний HTML
                let infoHtml = `
                    <p>Ім'я: ${this.fullName}</p>
                    <p>Лікар: ${this.doctorSelect}</p>
                `;
                if (this.doctorSelect === 'Кардіолог') {
                    infoHtml += `
                        <p>Тиск: ${this.bloodPressure}</p>
                        <p>Індекс маси тіла: ${this.bmi}</p>
                        <p>Серцево-судинні захворювання: ${this.cardioDiseases}</p>
                        <p>Вік: ${this.age}</p>
                    `;
                } else if (this.doctorSelect === 'Стоматолог') {
                    infoHtml += `
                        <p>Дата останнього відвідування: ${this.lastVisitDate}</p>
                    `;   
                }  else if (this.doctorSelect === 'Терапевт') {
                    infoHtml += `
                        <p>Вік: ${this.age}</p>
                    `;
                }

        
                this.infoDiv.innerHTML = infoHtml;
                this.infoDiv.style.display = 'none';
                visitItem.insertBefore(this.infoDiv, visitItem.querySelector('.show-more'));
            }
        
            // Перемикання відображення інформації та зміна тексту кнопки
            if (this.infoDiv.style.display === 'none') {
                this.infoDiv.style.display = 'block';
                visitItem.querySelector('.show-more').textContent = 'Показати менше';
            } else {
                this.infoDiv.style.display = 'none';
                visitItem.querySelector('.show-more').textContent = 'Показати більше';
            }
        }
        
        

        
        
        
        
        
        
        deleteVisit(visitItem) {
            // AJAX запит для видалення візиту
            fetch(`https://ajax.test-danit.com/api/v2/cards/${this.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.getToken()}`
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("Візит успішно видалено!");
                    visitItem.remove();  // Видалення елемента з DOM
                } else {
                    alert("Не вдалося видалити візит.");
                }
            })
            .catch(error => {
                console.error("Помилка при видаленні візиту:", error);
                alert("Не вдалося видалити візит.");
            });
        }
        
      }
      



      // fetch 


      let visits = [];
      async function fetchVisits(token) {
          try {
              const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              });
      
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
      
              const data = await response.json();
              console.log(data);
              visits = data.map(item => {
                  // Визначення типу лікаря залежно від наявних параметрів
                  let doctorType = 'Терапевт';  // Значення за замовчуванням
                  if (item.bloodPressure) {
                      doctorType = 'Кардіолог';
                  } else if (item.lastVisitDate) {
                      doctorType = 'Стоматолог';
                  }
      
                  return new Visit({
                      ...item,
                      status: item['visit-status'], // Присвоюємо статус
                      doctorSelect: doctorType      // Присвоюємо тип лікаря
                  });
              });
      
              console.log(visits);
              return visits;
          } catch (error) {
              console.error('There was a problem with the fetch operation:', error);
          }
      }
      
  // пишу функцію для фільтрації 

  const btn = document.querySelector('#btn');

  btn.addEventListener('click', (e) => {
    e.preventDefault(e);

    filterVisits();

    document.querySelector('#search-title').value = '';
    document.querySelector('#status').value = '';
    document.querySelector('#priority').value = '';
  })


  function filterVisits() {
    const searchTitle = document.querySelector('#search-title').value.toLowerCase();
    const status = document.querySelector('#status').value.toLowerCase();
    const priority = document.querySelector('#priority').value.toLowerCase();


    const filteredVisits = visits.filter(visit => {
        const matchTitle =!searchTitle || visit.purpose.toLowerCase().includes(searchTitle) || visit.description.toLowerCase().includes(searchTitle);
        const matchStatus = !status || visit.status.toLowerCase() === status;
        const matchPriority = !priority || visit.urgency.toLowerCase() === priority;

        console.log(visit.status)

        return matchTitle && matchStatus && matchPriority;
    })

    updateVisitList(filteredVisits);

  };

 function updateVisitList(filteredVisits) {
    const visitList =  document.getElementById('visit-list');
    visitList.innerHTML = ''; 

    if(filteredVisits.length === 0) {
        visitList.innerHTML = 'Нічого не знайдено'
    } else {
        filteredVisits.forEach(visit => {
            visitList.append(visit.render())
        });
    }

}
