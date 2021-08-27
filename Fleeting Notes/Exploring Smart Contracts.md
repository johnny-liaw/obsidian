# Exploring Smart Contracts
---

Creation date: 27/08/2021 19:55:30
Last modified: 27/08/2021 19:55:30

---
- You can implement currencies on top of ethereum.
- There are many ==token standards== on ethereu.
	- [[ERC20 Fungible Tokens]]
	- [[ERC721 NFTs]]

## Fungibility
> 💡 Fungibility basically means interchangeable.

- Fungible assets means that replacing the asset with another exactly the same will result in the same value.
	- $1 for another $1 note.
- Non fungible tokens are tokens that cannot be interchanged, they are unique.

## ERC-20 Fungible tokens
- Smart contract maintains collection of addresses and associated balances.
- Provides a set of ops you can perform on the balance.
	- `name` - returns name of the contract's token
	- `totalSupply` - total supply of token in contract
	- `transfer` - trasnfer token to said address
	- `balanceOf` - balance of tokens for said address

## ERC-721 NFTs
- Smart contract that maintains a collection of unique tokens and their associated owner address.
- Public interface looks soemthing like:
	- `transferFrom` - transfer token from eth address.
	- `ownerOf` - gets the owenr of a unique token.


#### Tags
#unsummarised

#### References


