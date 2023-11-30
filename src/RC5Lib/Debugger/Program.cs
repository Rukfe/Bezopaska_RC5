// See https://aka.ms/new-console-template for more information
using System.Text;
using RC5Lib;

string key = RC5.KeyGen();
Console.WriteLine("Ключ: " + key + '\n');

string message = "Пизда";
string encrypted1, encrypted2, encrypted3, decrypted;

encrypted1 = RC5.Encrypt(message, key);
encrypted2 = RC5.Encrypt(message, key);
encrypted3 = RC5.Encrypt(message, key);

Console.WriteLine("Зашифрованное сообщение: " + encrypted1 + '\n');

decrypted = RC5.Decrypt(encrypted1, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted + '\n');

Console.WriteLine("Зашифрованное сообщение: " + encrypted2 + '\n');

decrypted = RC5.Decrypt(encrypted2, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted + '\n');

Console.WriteLine("Зашифрованное сообщение: " + encrypted3 + '\n');

decrypted = RC5.Decrypt(encrypted3, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted + '\n');






