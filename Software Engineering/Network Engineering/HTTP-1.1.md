![[Screen Shot 2020-11-07 at 7.53.16 pm.png]]
- Persisted TCP connection
- Low latency
- Inefficient because it has [[HOL Blocking]]
- Chunk streaming
	- data stream (i.e. images) divided into non-overlapping 'chunks'. These are sent out and received independently.
- Pipelining
	- the ability to send successive requests without receiving response from the server.
	- needs responses to arrive in order, or FIFO.
		-  Due to this draw back, pipelining is disabled by default in HTTP1.1 and addressed in [[HTTP-2]].
	- ![[Screen Shot 2020-11-07 at 8.07.11 pm.png]]

---

#networkEng #softwareEng #OSI #HTTP

---