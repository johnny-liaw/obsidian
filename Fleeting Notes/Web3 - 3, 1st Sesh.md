# Web3 - 3, 1st Sesh
---

Creation date: 07/09/2021 06:53:02
Last modified: 07/09/2021 06:53:03

---
### Unchecked
```solidity
// before solidity 0.8
// say x = 0; -> uint8
x -= 1

the above would wrap and show x = 255

// after solidity 0.8
// say x = 0; -> uint8
x -= 1

the above would error out. Because the evm has checks for these built in.
```

### EIP's to be familiar with
- 20, 721, 165, 1155
### Jacon's NFT talk
- https://www.youtube.com/watch?v=HpGl1_QVCjA&t=85s&ab_channel=BlockchainAccelerationFoundation
### what does `address payable` do?
- it adds the .send and .transfer functions which are no longer recommended. https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
### Transferring ether
```solidity
// address(this).balance is the balance of the smart contract;
owner.call{ value: address(this).balance }("");

// selling ether
payable(msg.sender).call{ value: balance }("")

```


#### Tags
#unsummarised 

#### References


