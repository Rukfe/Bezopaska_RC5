// App.js
import React, { useState, useRef } from 'react';
import './App.css';
import EncryptionService from './EncryptionService';

function App() {
  const [inputText, setInputText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [placeholder, setPlaceholder] = useState('Введите текст');
  const [inputError, setInputError] = useState(false);
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
      setTimeout(() => setInputError(false), 500); // Скрываем ошибку через 1 секунду
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
      setTimeout(() => setInputError(false), 500); // Скрываем ошибку через 1 секунду
      focusTextInput();
      return;
    }
    try {
      const data = await EncryptionService.decrypt(inputText);
      setDecryptedText(data.decrypted_message);
      setPlaceholder('Введите текст'); // Сбрасываем placeholder обратно
    } catch (error) {
      setDecryptedText('Ошибка: ' + (error.message || 'что-то пошло не так'));
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
      <div id="encryptedTextContainer">
        <p>Зашифрованный текст: <span id="encryptedText">{encryptedText}</span></p>
        <p>Расшифрованный текст: <span id="decryptedText">{decryptedText}</span></p>
      </div>
    </div>
  );
}

export default App;
