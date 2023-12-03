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
  const [isEncrypted, setIsEncrypted] = useState(false); // Добавлено новое состояние
  const encryptedTextRef = useRef(null);
  const decryptedTextRef = useRef(null);
  const [keyError, setKeyError] = useState(false);
  const [keyPlaceholder, setKeyPlaceholder] = useState('Введите новый ключ');
  const [encryptError, setEncryptError] = useState('Зашифрованный текст')
  const [inputEncryptError, setEncryptInputError] = useState(false);
  const [decryptError, setDecryptError] = useState('Расшифрованный текст')
  const [inputDecryptError, setDecryptInputError] = useState(false);
  

  const focusTextInput = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Установка фокуса на input элемент
    }
  };

    // Функция для анимации "дрожания"
    const shakeInput = () => {
      setKeyError(true);
      setKeyPlaceholder("Не удалось поменять ключ")
      setTimeout(() => {
        setKeyError(false);
      }, 500);
      setTimeout(() => {
        setKeyPlaceholder('Введите новый ключ')
      }, 1500);
    };


    // Обработчики копирования текста
    const copyToClipboard = (ref) => {
      if (ref && ref.current) {
        ref.current.select();
        document.execCommand('copy');
      }
    };

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      setInputError(true);
      setPlaceholder('Пожалуйста, введите текст!');
      setIsEncrypted(false); // Устанавливаем состояние isEncrypted в false
      setTimeout(() => setInputError(false), 500); // Скрываем ошибку через 0.5 секунды
      focusTextInput();
      return;
    }
    else{
      setIsEncrypted(true); // Устанавливаем состояние isEncrypted в true
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
      setDecryptedText(`Не удалось расшифровать`);
       setTimeout(() => {
        setDecryptedText('Расшифрованный текст')
       }, 1500);
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
    if (!newKey.trim()) {
      shakeInput();
      setKeyPlaceholder('Не удалось поменять ключ');
      return;
    } try {
      const response = await EncryptionService.changeKey(newKey);
      if (response.error) {
        shakeInput();
        setKeyPlaceholder('Не удалось поменять ключ');
      } else {
        setKeyText(newKey);
        setNewKey('');
        setIsKeyVisible(true);
        setKeyPlaceholder('Ключ изменен успешно!');
        setTimeout(() => {
          setKeyPlaceholder('Введите новый ключ')}, 1500);
      }
    } catch (error) {
      shakeInput();
      setKeyPlaceholder('Ошибка: ' + (error.message || 'что-то пошло не так'));
    }
  };

  const handleEncryptError = async () =>{
    if (!encryptedText.trim()){
      setEncryptInputError(true);
      setEncryptError('Пустое поле!');
      setTimeout(() => setEncryptInputError(false), 500);
      setTimeout(() => setEncryptError('Зашифрованный текст'), 1500 )
      return;
    }
  };

  const handleDecryptError = async () =>{
    if (!decryptedText.trim()){
      setDecryptInputError(true);
      setDecryptError('Пустое поле!');
      setTimeout(() => setDecryptInputError(false), 500);
      setTimeout(() => setDecryptError('Расшифрованный текст'), 1500 )
      return;
    }
  }

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
      <button id="decryptButton" onClick={handleDecrypt} disabled={!isEncrypted} // Кнопка будет неактивной, если текст не зашифрован
      >Расшифровать</button>
      <button id="toggleKeyButton" onClick={toggleKeyVisibility}
      className={isKeyVisible ? 'keyButtonF' : 'keyButtonT'}>
      </button>
     
      <div id="encryptedTextContainer">
        <input
          ref={encryptedTextRef}
          type="text"
          placeholder={encryptError}
          id="encryptedText"
          value={encryptedText}
          readOnly
          className={inputEncryptError ? 'input-error' : ''}/>
        <button onClick={() => {copyToClipboard(encryptedTextRef); handleEncryptError()}}>Копировать</button>
      </div>

        <div id="decryptedTextContainer">
        <input
          ref={decryptedTextRef}
          type="text"
          placeholder={decryptError}
          id="decryptedText"
          value={decryptedText}
          readOnly
          className={inputDecryptError ? 'input-error' : ''}/>
        <button onClick={() => {copyToClipboard(decryptedTextRef); handleDecryptError()}}>Копировать</button>
      </div>

        {isKeyVisible && (
        <div id="keyContainer">
          <input type="text" id='keyText' placeholder="Ваш ключ" value={key_word} readOnly/>
          <button onClick={() => copyToClipboard(key_word) } id='copyKeyButton'>Копировать</button>
          <input
          type="text"
          placeholder={keyPlaceholder}
          value={newKey}
          id='changeKey'
          onChange={(e) => setNewKey(e.target.value)}
          className={keyError ? 'shake-animation1' : ''}/>
          <button onClick={handleChangeKey} id='changeButton'>Изменить ключ</button>
        </div>
      )}
      </div>
  );
}

export default App;
