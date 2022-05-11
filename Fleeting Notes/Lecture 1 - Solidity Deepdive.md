# Solidity Deep Dive Lecture
the `Environment` runs an EVM in your browser.
- Injected web3 - inject a web3 provider

### Solidity Language
- Variables have default values, i.e. bool is false, addr is 0x00000... and so on.
- `constant` is a variable that cannot be changed, must be instantiated at the top of the contract definition
- `immutable` cannot be be changed, but can be instantiated in the constructor. 32 bytes are reserved always. `constant` will therefore use more gas.

- `storage` -> something that is stored in blockchain state
- `memory` -> in memory variables that will be garbage cleaned up after the execution. 
> [!NOTE]
> 	-  function arguments are always in memory

- `CallData` :
	- immutable

#### Arrays
```solidity
Arrays can be fixed sized or dynamic
uint [] public arr;
uint[10] public arrFixed;
```

Arrays tend to be expensive in solidity.
- has methods like push and pop

#### Error handling
- require -> for validating certain conditions (most common)
- revert -> used when the conditional check is more complex
- assert -> what's the diff b/w this and require?
- `error InsufficientBalance(uint blance)`

#### Modifiers
- Preconditions check
