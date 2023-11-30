document.getElementById('encryptButton').addEventListener('click', function() {
    let inputText = document.getElementById('inputText');
    let encryptedTextContainer = document.getElementById('encryptedText');

    
    // Если строка пуста, добавим анимацию, фокус на поле ввода и замену текста в placeholder
    if(inputText.value.trim() === '') {
        inputText.classList.remove('input-error') // если анимация была проиграна, удалим класс с ней
        inputText.placeholder = 'Пожалуйста, введите текст!'; // замена текста в placeholder, если поле пустое
        void inputText.offsetWidth;   // Лайфхак для обхода ограничения на немедленное повторное воспроизведение CSS анимаций
        inputText.classList.add('input-error'); // добавляем класс, если поле ввода пустое и была нажата кнопка
        inputText.focus(); // фокус на поле ввода
        return; // Выходим из функции
    } else {
        inputText.classList.remove('input-error'); // удалим класс, если пользователь нажал на кнопку с текстом в поле
        inputText.placeholder = 'Введите текст для шифрования'; // Восстанавливаем исходный placeholder
    }
    
    // Осуществляем запрос на сервер для шифрования текста
    fetch('/encrypt', {
        method: 'POST',
        credentials: 'same-origin', // обеспечивает отправку куки сессии
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputText.value }) // отправка данных в формате JSON
    })
    .then(response => {
        if(response.ok) {
            return response.json(); //получаем данные в формате JSON
        } else {
            return response.json().then(data => Promise.reject(data));
        }
    })
    .then(data => {
        encryptedTextContainer.textContent = data.encrypted_message;
    })
    .catch(error => {
        encryptedTextContainer.textContent = 'Ошибка: ' + (error.message || 'что-то пошло не так');
    });
});