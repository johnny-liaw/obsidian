# Web 3, 2nd Sesh
---

Creation date: 07/09/2021 21:32:00
Last modified: 07/09/2021 21:32:00

---
### Receive keyword
```solidity
receive() external payable

// a fallback fn when ether is sent to a contract with no calldata.
// if `receive` fn does not exist, the `fallback` fn is called.
// https://blog.soliditylang.org/2020/03/26/fallback-receive-split/
```

- in what situations would a contract receive ether but no calldata? #Questions/Blockchain

### Cross contract calls
```solidity
// At the top of the file
import "./InconspicuousToken.sol";

// Elsewhere in your contract...
InconspicuousToken it = InconspicuousToken(contractAddress);
it.buy{ value: /* ... */ }();
it.sell();
```

### Re-entrancy attack
- an attack that relies on calling a contract when it's in the middle of an operation at an intermediate state.
- https://solidity-by-example.org/hacks/re-entrancy/
#### Mitigation
- checks-effects-interactions
- check and validate input
- perform alls tate modifications
- send calls to other contracts

### General Learnings
1.
```solidity
address.call{ value: x }("")
// the above calls with evm values.
```

2.
Read lots of documentation 
- https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
- https://eips.ethereum.org/EIPS/eip-20

3.
Jacob alr has the youtube playlist here:
 - https://www.youtube.com/playlist?list=PL0cPWYDSqQ2_F9QRvm1mynTw5yyPWn_s3

#### Tags
#unsummarised 

#### References


