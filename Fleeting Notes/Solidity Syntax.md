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

## Some Stuff


#### Tags
#unsummarised 

#### References


