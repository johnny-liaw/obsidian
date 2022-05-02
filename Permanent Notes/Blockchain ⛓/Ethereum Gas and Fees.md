# Ethereum Gas and Fees
---

Creation date: 02/05/2022 21:45:34
Last modified: 02/05/2022 21:45:34

---

```ad-summary
Gas price is the price needed to perform a computation in Ethereum. Only needed for state changes.

```

- measured in gwei (10x10^-9 ether).
- gas_limit x gas_price = total_gas_paid_dollars

- The higher the gas fee a sender is willing to pay, the more likely a miner is willing to process the transaction.

### Gas fees for storage
 - Paid propotional to the small multiple of 32 bytes used.

- Because additional state changes are propagated to all nodes, operations that **delete** data have the computation cost waived.

#### Tags
#Blockchain #Ethereum 

#### References

