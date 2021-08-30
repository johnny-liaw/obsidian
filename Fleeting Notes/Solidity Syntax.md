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
external // can only be called by external contracts and accounts
public // can be called from anywhere
```
[^1]

## Built-in variables
```solidity
// tx
tx.origin // the transaction origin, irregardless of how many chained contracts there are

//msg
msg.value // in wei
msg.sender

// block
block/timeStamp // time block was mined
```

## Arrays
```solidity
// 1. Storage arrays -> saved on chain
uint[] myArray;
bool[3] boolArray; // fixed sized array of 3 elements
- bool.push(..)
- delete bool[0]

// 2. Memory arrays -> not saved on chain
// has to declare size

function bar() external {
	// memory arrays have to be declared inside a function
	// below is memory array if size 10
	uint[] memory newArray = new uint[](10);
	// .push fn doesn't exist for memory array
	
	// example of instantiating values
	newArray[0] = some value...
	
	// delete element from array
	delete newArray[0]
}

// 3. Arrays as fn params
function fooBar(uint[] calldata myArg) external { ... }
```


## Mappings
```solidity
mapping(address => uint) balances;

// nested mapping
mapping(address => mapping(address => bool)) balances;

// array mapping
mapping(address => uint[]) scores;
// for the above the array is alr instantiated.
```

## Structs
```solidity
struct User {
	address addr;
	uint score;
	string name;
}

// usage
User memory user = User(msg.sender, 2, name);
User memory user2 = User({name: _name: score: 0, addr: msg.sender});

// reading
user2.addr;
// update
user2.score = 20;
```
## Enums
```solidity
enum COLOR {
	GREEN,
	BLUE,
}
```
## Memory vs Storage
```solidity
// 1. Storage
- persistent on the blockchain
- i.e. contracdt properties
- acts as a pointer

// 2. Memory
- not persistent on chain
- just a short term copy

// 3. Stack
- every simple variable declared in a function.

// 4. calldata
- Only aval for fn's that are `external` or `public`
- b/c it refers to fn call data.
- often used to interact with an ABI

```
## Events
![[Pasted image 20210830195437.png]]
```solidity
// 1. declare event
event NewTrade (
	uint date,
 	address from,
	address to,
	uint amount,
);

// 2. emitting event
emit NewTrade(now, msg.sender, to, amount);
// a consumer of the event will receive the event


```
## Payable keyword
```solidity
// 
function invest() external payable {
	
}
```


## 
## 
## 
#### Tags
#unsummarised 

#### References
- https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/ethereum/eth1.0-apis/assembled-spec/openrpc.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=false&uiSchema%5BappBar%5D%5Bui:input%5D=false&uiSchema%5BappBar%5D%5Bui:examplesDropdown%5D=false

[^1]: https://solidity-by-example.org/visibility/
