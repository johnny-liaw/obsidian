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
- Has data that is public for anyone to see.
- Can send/receive ether.
- Has code logic associated with it that is public.
	- Code execution is triggered by transactions or message calls from other contracts.
	
> 💡 Contract to contract communication are called ==message calls==[^2]

> 💡 There are a 4 main types of message calls in Ethereum. Contract to contract communication is specifically ==DELEGATECALL==.[^3]

## Turing completeness
- A concept that describes a programming language's ability to perform tasks.
- If the program can complete tasks ran by the ==universal turing machine==, then it is considered _turing complete_.

## Smart contract usecase:
- Decentrlized Finance (DeFi)
- Non fungible tokens (NFTs)
- Auctions
- Elections
- Trading
- Resource sharing
- Donations.
- Multiparty decision making

## Ethereum Computation Requirements
The point of blockchain is that it is fair, verifiable and ==deterministic==. In order for that to happen every node must produce the same result given the same resutls. (A very functional nature at that). As such blockchain computations have the following requirements:
- No network requests
	- The blockchain itself should have everything it needs to verify it self.
	- > 💡 Gathering off chain data and pasting in the chain is called working with an ==oracle==[^4]
- No randomness
- No asynchronicity
	- ❓ I haven't figured this out yet #Questions/Blockchain
- No node specific logic (timezone, Ip addr, etc).

## How are contracts executed
- A contract is executed by every node attempting to mine a block containing the transaction to that contract.
	- ❓ So do transacteions only exist on specific blocks?
	- How many nodes are there mining a block?
		- What if 50% of the nodes mining a block illegitimize and illegitimate transaction? #Questions/Blockchain 

## Blocktime
The time taken for a new block to be added to the blockchain.
- A block can be added to the chain when it's ==hash== is found.
	- The hash problem is variable by the network based on the average hash solve time at that instant.
- A hash is generated from the data within a block + the hash of the previous block in the chain.
- This is for security reasons, need to explore more why.
	- The longer it takes to mint a block, the less likely a fradudulent actor would be able to produce the longer chain that fools everybody else[^5].
	- Lets say a block is added once every second vs 10 minutes, it's a lot less likely that a single fraudulent actor is able to create the longest chain of blocks with the 10 min blocktime whilst competing with the rest of the nodes in the world who are also adding blocks to the chain.
	- Also, the longer the blocktime, the less wastage there is.
		- Say latency is 1 minute.
		- For a blocktime of 2 minutes, the wastage is 50%. B/c at the 1 minute mark a miner discovered the block was already solved.
		- For a blocktime of 10 minutes, the wastage is 10%. B/c at 1/10th mark of it's operation, the miner discovers that the block was already solved. [^6]
		- ❓ I would like to disagree with the literature in regards to the above:
			- Lets say that an average computer is capable of computing 10k ops/min. Irregardless of the block time, the number of ops wasted would be the same, as it's dependent on the network latency. How does an increased blocktime decrease wastage? #Questions/Blockchain 


[^1]: https://kobl.one/blog/create-full-ethereum-keypair-and-address/
[^2]: https://ethereum.stackexchange.com/questions/12065/what-is-the-difference-between-a-call-message-call-and-a-message
[^3]: https://www.badykov.com/ethereum/2018/06/17/message-calls-in-ethereum/
[^4]: https://ethereum.stackexchange.com/questions/301/why-cant-contracts-make-api-calls
[^5]: https://youtu.be/bBC-nXj3Ng4?t=1199
[^6]: https://medium.facilelogin.com/the-mystery-behind-block-time-63351e35603a#:~:text=Block%20time%20defines%20the%20time%20it%20takes%20to%20mine%20a,between%2010%20to%2019%20seconds.