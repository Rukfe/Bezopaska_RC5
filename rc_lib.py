import os
from pythonnet import load
load("coreclr")
import clr

# Указание пути к DLL
pathDLL = os.path.join(os.getcwd(), "src", "RC5Lib", "RC5Lib", "bin", "Release", "net6.0", "RC5Lib.dll")
clr.AddReference(pathDLL)

# Импорт RC5 из библиотеки
from RC5Lib import RC5

def key_gen():
    return RC5.KeyGen()

def encrypt(message, key):
    return RC5.Encrypt(message, key)

def decrypt(encrypted_message, key):
    return RC5.Decrypt(encrypted_message, key)