# Intro to Blockchain & Smart Contracts

- Ethereum accounts consist of keypair. -> Is the address of the recipient of a transaction.
- Smart contracts can be activated by sending them special transacstions called ==message calls==
	- These message calls _operate_ on the saved state of the smart contracts.

- Ethereum's smart contracts are quasi-Turing-complete
	- usecases include:
		- Decentrlized Finance (DeFi)
		- Non fungible tokens (NFTs)
		- Auctions
		- Elections
		- Trading
		- Resource sharing
		- Donations.
		- Multiparty decision making


- Smart contract instruction are public.
- Smart contracdt data is public
- Small amount of storage can be _very expensive_ ❌ not true after research. Cost is dependent on gas and that depends on the computation needed to store such data.
- A contract state cannot change once it is deployed.

- Every computation on the blockchain must be _determininistic_:
	- no network requests
	- no randomness
	- no asynchronicity
	- no node specific logic (what is ur timezone, IP addr, etc)

- A contract is executed by every node attempting to mine a block containing transaction to that contract. ❓

- State of smart contract deployed to ethereum can update at most once every 14 seconds. ❓


---
