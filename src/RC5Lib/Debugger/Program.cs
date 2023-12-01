// See https://aka.ms/new-console-template for more information
using System.Text;
using System.Diagnostics;
using RC5Lib;

Stopwatch stopwatch = new Stopwatch();

string key = "А адвокат известно что: адвокат — нанятая совесть.";
Console.WriteLine("Ключ: " + key + '\n');

String message = "Сострадание есть высочайшая форма человеческого существования.";
string encrypted, decrypted;

stopwatch.Start();

encrypted = RC5.Encrypt(message, key);
Console.WriteLine("Зашифрованное сообщение: " + encrypted);

stopwatch.Stop();
Console.WriteLine("Время шифрования: " + stopwatch.ElapsedMilliseconds + " мс\n");

stopwatch.Reset();
stopwatch.Start();

decrypted = RC5.Decrypt(encrypted, key);
Console.WriteLine("Расшифрованное сообщение: " + decrypted);

stopwatch.Stop();
Console.WriteLine("Время расшифрования: " + stopwatch.ElapsedMilliseconds + " мс\n");
