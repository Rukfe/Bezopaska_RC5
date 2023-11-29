// See https://aka.ms/new-console-template for more information
using System.Text;
using RC5Lib;

string key = RC5.KeyGen();
Console.WriteLine("Ключ: " + key);

string encrypted = RC5.Encrypt("I am a storm that is approaching...", key);
Console.WriteLine("Зашифрованное сообщение: " + encrypted);

string decrypted = RC5.Decrypt(encrypted, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted + "\n");


string message = "Я ебал в рот (В рот) тех, кто не ебал в рот тех, кто ебал в жопу";
key = "Я на седьмом этаже, это как шестой, но на один повыше";
Console.WriteLine("Оригинальное сообщение: " + message);

encrypted = RC5.Encrypt(message, key);
Console.WriteLine("Зашифрованное сообщение: " + encrypted);

decrypted = RC5.Decrypt(encrypted, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted);