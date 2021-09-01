# Blocktime
---

Creation date: 01/09/2021 16:38:44
Last modified: 01/09/2021 16:38:44

---
> 💡 The time taken to calculate a block for the blockchain and add it to the chain.

- Bitcoin: 10 mins
- Ethereum: 14 secs

- A block consists of several key pieces of information:
	- previous block's hash
	- current transactions in block
- From the above each block will have a unique hash number, which must be calculated.
	- The difficulty of a hash depends on the average hash completion time at the time. Blockchain networks will vary this to match their desires average blocktime.

- From literature, the longer the blocktime, the less hasing is wasted.
	- Lets say latency is 1 min.
	- For a blocktime of 2 mins, the wastage is 50%
	- For a blockmtime of 10 mins, the wastage is 10%.
	- ❗ however i disagree with the above, let say a node has a computation cacpacity of 10k ops/sec, the latency is remains the same and thus the same amount of computation is wasted.




#### Tags
#Blockchain

#### References
[[Literature Notes/Intro to Blockchain & Smart contracts]]
