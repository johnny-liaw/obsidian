# Erlang Responsiveness
- Erlang Processes are preemptive, meaning a very small window of time is given to each process.
	- each job gets time, so extremely responsive. Similar to the [[React Fiber]] architecutre.
- IO jobs are delegated to spearate threads/kernel-poll services.
	- Processes that wait for IO won't block other proceses.
- Each Erlang Process has its own memory, they take care of their own GC.
	- GC is much quicker in Erlang and don't block the rest of the system.


---
#softwareEng #tooling #erlang

