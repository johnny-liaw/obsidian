# What is Erlang?
A language designed to provide fault tolerance, concurrency, scalability, responsiveness for telecom applications initially. 

# How does it run?
![[Screen Shot 2020-11-08 at 8.31.19 pm.png]]
- The erlang VM is called BEAM. It's a single process in the OS. 
	- BEAM uses multiple schedulers.
		- Each scheduler is an OS thread.
			- Each scheduler is responsible for multiple [[Erlang Processes]].

# Features of Erlang
- [[Erlang Fault Tolerance]]
- [[Erlang Scalability]]
- [[Erlang Distribution]]
- [[Erlang Responsiveness]]