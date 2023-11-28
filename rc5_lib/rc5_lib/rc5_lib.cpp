// rc5_lib.cpp: определяет точку входа для приложения.
//

#include "rc5_lib.h"

using namespace std;

rc5UserKey* RC5_Key_Create()
{
	rc5UserKey* pKey;

	pKey = (rc5UserKey*)malloc(sizeof(*pKey));
	if (pKey != ((rc5UserKey*)0))
	{
		pKey->keyLength = 0;
		pKey->keyBytes = (unsigned char*)0;
	}
	return (pKey);
}

void RC5_Key_Destroy(rc5UserKey* pKey)
{
	unsigned char*	to;
	int             count;

	if (pKey == ((rc5UserKey*)0))
		return;
	if (pKey->keyBytes == ((unsigned char*)0))
		return;
	to = pKey->keyBytes;
	for (count = 0; count < pKey->keyLength; count++)
		*to++ = (unsigned char)0;
	free(pKey->keyBytes);
	pKey->keyBytes = (unsigned char*)0;
	pKey->keyLength = 0;
	free(pKey);
}

int RC5_Key_Set(rc5UserKey* pKey,
	int						keyLength,
	unsigned char*			keyBytes
)
{
	unsigned char*	keyBytesCopy;
	unsigned char*	from, * to;
	int				count;

	keyBytesCopy = (unsigned char*)malloc(keyLength);
	if (keyBytesCopy == ((unsigned char*)0))
		return (0);
	from = keyBytes;
	to = keyBytesCopy;
	for (count = 0; count < keyLength; count++)
		*to++ = *from++;
	pKey->keyLength = count;
	pKey->keyBytes = keyBytesCopy;
	return (1);
}