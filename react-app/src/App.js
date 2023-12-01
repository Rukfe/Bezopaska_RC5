// App.js
import React, { useState, useRef } from 'react';
import './App.css';
import EncryptionService from './EncryptionService';

function App() {
  const [inputText, setInputText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [key_word, setKeyText] = useState('')
  const [placeholder, setPlaceholder] = useState('Введите текст');
  const [inputError, setInputError] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false); // Добавляем useState для отслеживания видимости ключа
  const [newKey, setNewKey] = useState(''); // Для ввода нового ключа
  const inputRef = useRef(null); // Создание ref для текстового поля


  const focusTextInput = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Установка фокуса на input элемент
    }
  };

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setInputError(true);
      setPlaceholder('Пожалуйста, введите текст!');
      setTimeout(() => setInputError(false), 500); // Скрываем ошибку через 0.5 секунды
      focusTextInput();
      return;
    }
    try {
      const data = await EncryptionService.encrypt(inputText);
      setEncryptedText(data.encrypted_message);
      setPlaceholder('Введите текст'); // Сбрасываем placeholder обратно
    } catch (error) {
      setEncryptedText('Ошибка: ' + (error.message || 'что-то пошло не так'));
    }
  };

  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      setInputError(true);
      setPlaceholder('Пожалуйста, введите текст!');
      setTimeout(() => setInputError(false), 500); // Скрываем ошибку через 0.5 секунды
      focusTextInput();
      return;
    }
    try {
      const data = await EncryptionService.decrypt(inputText);
      setDecryptedText(data.decrypted_message);
      setPlaceholder('Введите текст'); // Сбрасываем placeholder обратно
    } catch (error) {
      setDecryptedText(`Ошибка: ${error.message}`);
    }
  };

// функция для переключения видимости ключа
const toggleKeyVisibility = async () => {
  if (!isKeyVisible) {
    try {
      const data = await EncryptionService.getKey();
      setKeyText(data.encryption_key);
    } catch (error) {
      setKeyText('Ошибка: ' + (error.message || 'что-то пошло не так'));
    }
  }
  setIsKeyVisible(!isKeyVisible); // Переключаем видимость ключа
}

// Обработчик для изменения ключа
const handleChangeKey = async () => {
  const response = await EncryptionService.changeKey(newKey);
  if (response.error) {
    alert(response.error);
  } else {
    setKeyText(newKey); // Обновление отображаемого ключа
    setNewKey(''); // Очищение поля ввода
    setIsKeyVisible(true);
    alert('Ключ успешно изменен');
  }
};

  return (
    <div id="app">
      <input
        ref={inputRef}
        type="text"
        id="inputText"
        placeholder={placeholder}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className={inputError ? 'input-error' : ''}
      />
      <button id="encryptButton" onClick={handleEncrypt}>Зашифровать</button>
      <button id="decryptButton" onClick={handleDecrypt}>Расшифровать</button>
      <button id="toggleKeyButton" onClick={toggleKeyVisibility}>
        {isKeyVisible ? 'Скрыть ключ' : 'Показать ключ'}
      </button>
      <div id="encryptedTextContainer">
        <p>Зашифрованный текст: <span id="encryptedText">{encryptedText}</span></p>
        <p>Расшифрованный текст: <span id="decryptedText">{decryptedText}</span></p>
        {isKeyVisible && (
        <div id="keyContainer">
          <p>Ваш ключ: <span id="key_word">{key_word}</span></p>
          <input
            type="text"
            placeholder="Введите новый ключ"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <button onClick={handleChangeKey}>Изменить ключ</button>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
