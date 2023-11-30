// See https://aka.ms/new-console-template for more information
using System.Text;
using RC5Lib;

string key = RC5.KeyGen();
Console.WriteLine("Ключ: " + key + '\n');


string message = "Блять";
string encrypted, decrypted;

encrypted = RC5.Encrypt(message, key);
Console.WriteLine("Зашифрованное сообщение: " + encrypted);

decrypted = RC5.Decrypt(encrypted, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted + "\n");

encrypted = RC5.Encrypt(message, key);
Console.WriteLine("Зашифрованное сообщение: " + encrypted);

decrypted = RC5.Decrypt(encrypted, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted);