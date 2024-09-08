// script.js

document.getElementById('findIpButton').addEventListener('click', async () => {
    try {
        // Отримання IP адреси клієнта
        const ipResponse = await fetch('https://api.ipify.org/?format=json');
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;

        // Отримання інформації про місцезнаходження за IP
        const locationResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
        const locationData = await locationResponse.json();

        // Виведення інформації на сторінку
        const infoDiv = document.getElementById('info');
        infoDiv.innerHTML = `
            <p><strong>IP Адреса:</strong> ${ipAddress}</p>
            <p><strong>Континент:</strong> ${locationData.continent}</p>
            <p><strong>Країна:</strong> ${locationData.country}</p>
            <p><strong>Регіон:</strong> ${locationData.regionName}</p>
            <p><strong>Місто:</strong> ${locationData.city}</p>
            <p><strong>Район:</strong> ${locationData.district}</p>
        `;
    } catch (error) {
        console.error('Помилка:', error);
        document.getElementById('info').textContent = 'Не вдалося отримати інформацію. Спробуйте пізніше.';
    }
});
