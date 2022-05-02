# Ethereum State
---

Creation date: 02/05/2022 21:26:43
Last modified: 02/05/2022 21:26:43

---
```ad-summary
Ethereum world state is a mapping between [[Ethereum Accounts]] and [[Ethereum Account State]].
```

- The mapping is stored in a data structure called the [[Merkle Patricia Tree]].

---
### Blocks
- The same [[Merkle Patricia Tree]] data structure is used to store state, transactions and receipts in the block header.
 ![[Pasted image 20220502214121.png]]

- We do this so we can store information really efficiently in Ethereum, this is the paradigm of [[Ethereum Light Nodes vs Full Nodes]].


#### Tags
#Blockchain #Ethereum 

#### References

