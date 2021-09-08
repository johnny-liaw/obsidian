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
// the above calls with evm values 
```


#### Tags
#unsummarised 

#### References


