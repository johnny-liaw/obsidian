# Ethereum Computation Requirements
---

Creation date: 01/09/2021 16:05:53
Last modified: 01/09/2021 16:05:53

---
> 💡 Ethereum computations must be ==deterministic==. The same inputs must always yield the same outputs.

- This reminds me of the [[Functional Programming]] paradigm.

As such ethereum computations must have the following conditions:
- no network requests.
	- The chain should have everything it needs to perform the computation.
	- Gathering data off chain is called using an oracle.
- No randomness
- No asyncness
- No node specific logic (timezone, IP, etc),



#### Tags
#Blockchain/Ethereum

#### References
[[Literature Notes/Intro to Blockchain & Smart contracts]]

