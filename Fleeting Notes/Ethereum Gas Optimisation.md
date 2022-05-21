# Ethereum Gas Optimisation
---

Creation date: 22/05/2022 00:03:01
Last modified: 22/05/2022 00:03:01

---

# Gas Optimisations
1. Initialising a variable to a default value is unnecessary

2. Packing variables
```solidity
contract Contract {
	// the first 2 variables will be packed into the first slot of 256 bytes
	uint8 public var1;
	uint16 public var1;

	// the last variables will be packed into the first slot of 256 bytes
	uint256 public var1;
}
```


3. Modifier redundancy

When contracts are compiled, modifiers are 'inlined'. So if a modifier is used more than once, the same modifier will be inlined more than once. So a function would be better.

4. use `calldata` and not `memory` for public functions.

However, a caveat for this is that if it's only called by external functions / contracts than it can be marked as 'external' and it will give you access to the calldata property

5. Accessing local variable is much cheaper than accessing the value in storage

6. use localised variables vs repeated array/map accesses

7. `++i` is better than `i++` because the former returns the incremented value immediately, whereas the latter stored the previous value, before returning the incremented value.

8. using `unchecked` to avoid unnecessary overflow/underflow checks



#### Tags


#### References
https://blog.polymath.network/solidity-tips-and-tricks-to-save-gas-and-reduce-bytecode-size-c44580b218e6

