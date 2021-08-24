# Intro to Blockchain & Smart Contracts
## Ethereum Keypairs
- The public key is typically 64 bytes long.
- The address of a wallet is the last 20 bytes (last 40 hex chars) of the public key [^1].
- The private key is 32 bytes long.

> 💡 During research I came across EAOs (externally owned accounts) and _contract accounts_. The above are for EOAs.

## EOA vs Contract Accounts
There are 2 main types of accounts in Ethereum:
- Contract accounts AND
- Externally owned accounts

Externally Owned Accounts:
- Can send/receive either
- Controleld by private key.
- Has no code logic associated with it.

Contract accounts:
- Can send/receive ether
- Has code logic associated with it.
	- Code execution is triggered by transactions or message calls from other contracts.
> 💡 Contract to contract communication are called ==message calls==






---
### References
[^1]: https://kobl.one/blog/create-full-ethereum-keypair-and-address/
