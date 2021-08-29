# Solidity Syntax
---

Creation date: 29/08/2021 17:22:22
Last modified: 29/08/2021 17:22:22

---
## Variable Types 
#### Fixed size types
```solidity
bool aBoolean;
uint aNumber;
address recipient;
bytes32 data;
```

#### Variable size types
```solidity
string name;
bytes _data;
unint[] amounts;
mapping(uint => string);
```

#### User defined types
```solidity
struct User {
	uint id;
	string name;
}

enum Color {
	RED,
	GREEN,
	BLUE,
}
```


## Functions
```Solidity

function getValue() external view returns(uint) {
  // get teh value
}

function setValue() external {
  // set the value
}

// the `view` of the 1st function means it's readonly
```

###### view
- means readonly function
- uses [[eth_call]]
###### pure
- means only computation
###### no view/pure
- means will alter chain state
- uses [[eth_sendTransaction]]
###### private
- function can only be called within the smart contract
###### internal
- Can only be called within contract, and contract's that inherit the current contract
###### external
- Can only be called by external contracts and accounts
###### public
- Can be called anywhere, inside/outside the contract
- the most permissive function visibility.



## Variable visibility
```
private // a private variable
internal // can be read inside the contract or contract that inheirt from it
external // can only be called by external contracts and 
```

##


#### Tags
#unsummarised 

#### References
- https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/ethereum/eth1.0-apis/assembled-spec/openrpc.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=false&uiSchema%5BappBar%5D%5Bui:input%5D=false&uiSchema%5BappBar%5D%5Bui:examplesDropdown%5D=false

