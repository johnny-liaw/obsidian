# Pros
1. Multiplexing 
- Non error prone concurrent requests are able to be made.
- ![[Screen Shot 2020-11-08 at 3.34.40 pm.png]]
	- each request assigned with a unique [[Stream ID]]
	- fixes [[HOL Blocking]] issue because concurrent requests can be made and processed when received.
2. Server Push
- server can push resources to client without client requesting them. 
	- can be used for loading resources preemptively
	- notifications

3. [[Protocol Negotiation]] during TLS
4. Compression (headers + data)
5. Secure by default as communication must be through port 443.
