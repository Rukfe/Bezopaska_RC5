// See https://aka.ms/new-console-template for more information
using System.Text;
using RC5Lib;

string key = RC5.KeyGen();
Console.WriteLine("Ключ: " + key + '\n');

<<<<<<< Updated upstream

string message = "Блять";
string encrypted, decrypted;

encrypted = RC5.Encrypt(message, key);
=======
string encrypted = RC5.Encrypt("Я ебал в рот (В рот) тех, кто не ебал в рот тех, кто ебал в жопу", key);
>>>>>>> Stashed changes
Console.WriteLine("Зашифрованное сообщение: " + encrypted);

decrypted = RC5.Decrypt(encrypted, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted + "\n");

<<<<<<< Updated upstream
=======

string message = "Я ебал в рот (В рот) тех, кто не ебал в рот тех, кто ебал в жопу";
Console.WriteLine("Оригинальное сообщение: " + message);

>>>>>>> Stashed changes
encrypted = RC5.Encrypt(message, key);
Console.WriteLine("Зашифрованное сообщение: " + encrypted);

decrypted = RC5.Decrypt(encrypted, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted);