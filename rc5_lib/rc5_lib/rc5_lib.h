// rc5_lib.h : включаемый файл для стандартных системных включаемых файлов
// или включаемые файлы для конкретного проекта.

#pragma once

#include <iostream>
#include "../../extern/pybind11/include/pybind11/pybind11.h"

namespace py = pybind11;

// TODO: установите здесь ссылки на дополнительные заголовки, требующиеся для программы.

/* Definition of RC5 user key object. */
typedef struct rc5UserKey
{
	int				keyLength; /* In Bytes. */
	unsigned char*	keyBytes;
}	rc5UserKey;

/*
	Allocate and initialize an RC5 user key.
	Return 0 if problems.
 */
rc5UserKey* RC5_Key_Create();

/*
	Zero and free an RC5 user key.
 */
void RC5_Key_Destroy(rc5UserKey* pKey);

/*
	Set the value of an RC5 user key.
	Copy the key bytes so the caller can zero and
	free the original.
	Return zero if problems
 */
int RC5_Key_Set(rc5UserKey* pKey,
	int						keyLength,
	unsigned char*			keyBytes
);

/*	
	Definitions for RC5 as a 64 bit block cipher.
	The "unsigned int" will be 32 bits on all but
	the oldest compilers, which will make it 16 bits.
	On a DEC Alpha "unsigned long" is 64 bits, not 32. 
 */
#define RC5_WORD     unsigned int
#define W            (32)
#define WW           (W / 8)
#define ROT_MASK     (W - 1)
#define BB           ((2 * W) / 8) /* Bytes per block */

/*	
	Define macros used in multiple procedures.
	These macros assumes ">>" is an unsigned operation,
	and that x and s are of type RC5_WORD. 
 */
#define SHL(x,s)    ((RC5_WORD)((x)<<((s)&ROT_MASK)))
#define SHR(x,s,w)  ((RC5_WORD)((x)>>((w)-((s)&ROT_MASK))))
#define ROTL(x,s,w) ((RC5_WORD)(SHL((x),(s))|SHR((x),(s),(w))))

#if W == 16
#define P16  0xb7e1
#define Q16  0x9e37
#define Pw   P16 /* Select 16 bit word size */
#define Qw   Q16
#endif

#if W == 32
#define P32  0xb7e15163
#define Q32  0x9e3779b9
#define Pw   P32 /* Select 32 bit word size */
#define Qw   Q32
#endif

#if W == 64
#define P64  0xb7e151628aed2a6b
#define Q64  0x9e3779b97f4a7c15
#define Pw   P64 /* Select 64 bit word size */
#define Qw   Q64
#endif