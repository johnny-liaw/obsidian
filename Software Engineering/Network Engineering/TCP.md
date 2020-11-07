# TCP
#### Pros
- Acknowledgement through [[Transport Layer Sequence Number]]
- Guaranteed delivery
- Connection based
- [[Congestion Control]]
- Guarantees packet order.

#### Cons
- Larger packets, because header contains [[Transport Layer Sequence Number]]
- More bandwidth needed. 
- Slower than [[UDP]], because we're waiting for ack, congestion control.
- Stateful, if server shuts down all connection information is lost, and server no longer knows what it needs to receive next from the client.
	- Needs to allocate memory to store connection details.

---

#networkEng #softwareEng #OSI

---