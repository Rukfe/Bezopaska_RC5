using System.Security.Cryptography;
using System.Text;

namespace RC5Lib
{
    public static class RC5
    {
        private const int W = 64; //половина длины слова в битах
        private const int R = 128; //количество раундов

        private const int BB = W >> 3; //количество байтов в одном машинном слове

        /*
         * Этап 1. Генерация констант
         * Для заданного параметра W генерируются две псевдослучайные величины,
         * используя две математические константы: e (экспонента) и f (Golden ratio).
         * Qw = Odd((e - 2) * 2^W;
         * Pw = Odd((f - 1) * 2^W;
         * где Odd() - это округление до ближайшего нечетного целого.
         * Для оптимизации алгоритмы эти 2 величины определены заранее.
         */
        private const UInt64 PW = 0xB7E151628AED2A6B;
        private const UInt64 QW = 0x9E3779B97F4A7C15;

        private static UInt64[] L; //слова для секретного ключа
        private static UInt64[] S; //таблица расширенных ключей

        private static int b; //длина ключа в байтах
        private static int t; //размер таблицы S
        private static int c; //размер массива слов L

        /*
         * Перед непосредственно шифрованием или расшифровкой данных выполняется процедура расширения ключа.
         * Процедура генерации ключа состоит из четырех этапов:
         * 1.Генерация констант
         * 2.Разбиение ключа на слова
         * 3.Построение таблицы расширенных ключей
         * 4.Перемешивание
         */
        private static void Extend(byte[] key)
        {
            // основные переменные
            UInt64 x, y;
            int i, j, n;
            /*
             * Этап 2. Разбиение ключа на слова
             * На этом этапе происходит копирование ключа K[0]..K[255] в массив слов L[0]..L[c-1], где
             * c = b/BB, а BB = W/8. Если b не кратен W/8, то L[i] дополняется нулевыми битами до ближайшего
             * большего размера c, при котором длина ключа b будет кратна W/8.
             */
            b = key.Length;
            c = b % BB > 0 ? b / BB + 1 : b / BB;
            L = new UInt64[c];

            for (i = b - 1; i >= 0; i--)
            {
                L[i / BB] = ROTL(L[i / BB], 8) + key[i];
            }

            /* Этап 3. Построение таблицы расширенных ключей
             * На этом этапе происходит построение таблицы расширенных ключей S[0]..S[2(R + 1)],
             * которая выполняется следующим образом:
             */
            t = 2 * (R + 1);
            S = new UInt64[t];
            S[0] = PW;
            for (i = 1; i < t; i++)
            {
                S[i] = S[i - 1] + QW;
            }

            /* Этап 4. Перемешивание
             * Циклически выполняются следующие действия:
             */
            x = y = 0;
            i = j = 0;
            n = 3 * Math.Max(t, c);

            for (int k = 0; k < n; k++)
            {
                x = S[i] = ROTL((S[i] + x + y), 3);
                y = L[j] = ROTL((L[j] + x + y), (int)(x + y));
                i = (i + 1) % t;
                j = (j + 1) % c;
            }
        }

        //вращение битов влево
        private static UInt64 ROTL(UInt64 a, int offset)
        {
            UInt64 r1, r2;
            r1 = a << offset;
            r2 = a >> (W - offset);
            return (r1 | r2);

        }

        //вращение битов вправо
        private static UInt64 ROTR(UInt64 a, int offset)
        {
            UInt64 r1, r2;
            r1 = a >> offset;
            r2 = a << (W - offset);
            return (r1 | r2);
        }

        private static UInt64 BytesToUInt64(byte[] b, int p)
        {
            UInt64 r = 0;
            for (int i = p + 7; i > p; i--)
            {
                r |= (UInt64)b[i];
                r <<= 8;
            }
            r |= (UInt64)b[p];
            return r;
        }

        private static void UInt64ToBytes(UInt64 a, byte[] b, int p)
        {
            for (int i = 0; i < 7; i++)
            {
                b[p + i] = (byte)(a & 0xFF);
                a >>= 8;
            }
            b[p + 7] = (byte)(a & 0xFF);
        }

        private static void Cipher(byte[] inBuf, byte[] outBuf)
        {
            UInt64 a = BytesToUInt64(inBuf, 0);
            UInt64 b = BytesToUInt64(inBuf, 8);

            a = a + S[0];
            b = b + S[1];

            for (int i = 1; i < R + 1; i++)
            {
                a = ROTL((a ^ b), (int)b) + S[2 * i];
                b = ROTL((b ^ a), (int)a) + S[2 * i + 1];
            }

            UInt64ToBytes(a, outBuf, 0);
            UInt64ToBytes(b, outBuf, 8);
        }

        private static void Decipher(byte[] inBuf, byte[] outBuf)
        {
            UInt64 a = BytesToUInt64(inBuf, 0);
            UInt64 b = BytesToUInt64(inBuf, 8);

            for (int i = R; i > 0; i--)
            {
                b = ROTR((b - S[2 * i + 1]), (int)a) ^ a;
                a = ROTR((a - S[2 * i]), (int)b) ^ b;
            }

            b = b - S[1];
            a = a - S[0];

            UInt64ToBytes(a, outBuf, 0);
            UInt64ToBytes(b, outBuf, 8);
        }

        //возвращает строку в UTF8
        public static string KeyGen()
        {
            var rng = RandomNumberGenerator.Create();
            byte[] randombytes = new byte[128];
            rng.GetBytes(randombytes);

            const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            char[] result = new char[128];
            for (int i = 0; i < 128; i++)
            {
                result[i] = validChars[randombytes[i] % validChars.Length];
            }
            byte[] utf8bytes = Encoding.UTF8.GetBytes(result);

            return Encoding.UTF8.GetString(utf8bytes);
        }

        //принимает строку в UTF8, возвращает строку в Base64
        public static string Encrypt(string text, string key)
        {
            byte[] tempkey = Encoding.UTF8.GetBytes(key);
            Extend(tempkey);
            byte[] buf;
            using (var mstream = new MemoryStream())
            using (var writer = new BinaryWriter(mstream))
            {
                byte[] temp = Encoding.UTF8.GetBytes(text);
                writer.Write(temp.Length);
                writer.Write(temp);

                int padding = (int)(mstream.Length % 16);
                if (padding != 0)
                {
                    padding = 16 - padding;
                    var rng = RandomNumberGenerator.Create();
                    byte[] paddingBuf = new byte[padding];
                    rng.GetNonZeroBytes(paddingBuf);
                    writer.Write(paddingBuf);
                }
                buf = mstream.ToArray();
            }

            byte[] result = new byte[buf.Length];
            byte[] input = new byte[16];
            byte[] output = new byte[16];
            for (int i = 0; i < buf.Length / 16; i++)
            {
                Array.Copy(buf, i * 16, input, 0, 16);
                Cipher(input, output);
                Array.Copy(output, 0, result, i * 16, 16);
            }
            return Convert.ToBase64String(result);
        }

        //принимает строку в Base64, возвращает строку в UTF8
        public static string Decrypt(string data, string key)
        {
            byte[] tempkey = Encoding.UTF8.GetBytes(key);
            Extend(tempkey);
            byte[] tempdata = Convert.FromBase64String(data);
            byte[] result = new byte[tempdata.Length];
            byte[] input = new byte[16];
            byte[] output = new byte[16];
            for (int i = 0; i < tempdata.Length / 16; i++)
            {
                Array.Copy(tempdata, i * 16, input, 0, 16);
                Decipher(input, output);
                Array.Copy(output, 0, result, i * 16, 16);
            }

            int bytes = BitConverter.ToInt32(result, 0);
            return Encoding.UTF8.GetString(result, 4, bytes-4);
        }
    }
}