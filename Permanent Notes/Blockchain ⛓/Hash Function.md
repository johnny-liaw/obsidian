# Hash Function
---

Creation date: 04/05/2022 20:21:49
Last modified: 04/05/2022 20:21:49

---
```ad-summary
A hash function turns plaintext into uniquely identifiable text. Typically a one way function.

```

- hashing and [[Encryption]] are not the same thing.
- hashed data is typically smaller than input.

### Properties of a hash algorithm
- Determinism - different inputs should have a hashed output of the same length. The same input would always produce the same output.
- Pre-Image resistance - impossible to reverse the hashed value to uncover the original value.
- Collision resistance - Unlikely that different inputs will result in the same output hash.
- Avalanche effect - the smallest change in input will result in a big change in the output.
- Hash speed - hashing should operate at a reasonable speed.

### What do hash functions do
- Ensure data integrity
- Secure against unauthorized modifications.


#### Tags
#Blockchain #Cryptography

#### References
https://nakamoto.com/hash-functions/

