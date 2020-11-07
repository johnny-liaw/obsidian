# UDP
#### Pros
- Smaller packets as no [[Transport Layer Sequence Number]]
	- Less bandwidth as packets are smaller.
- Faster than TCP as no [[Congestion Control]]
- Stateless connection. If server shuts/client shuts down, on startup can immediately continue to send data.

#### Cons
- No acknowledgement
- No guaranteed delivery
- Connectionless: does not acquaint with client beforehand.
	- No congestion control
	- Lack of security, as no confirmation of client is made beforehand.
- Packet order not guaranteed as there is no [[Transport Layer Sequence Number]].

---

#networkEng #softwareEng #OSI

---