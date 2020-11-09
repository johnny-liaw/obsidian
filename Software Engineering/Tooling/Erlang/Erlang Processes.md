# What is an Erlang process?
An Erlang process is not to be confused with OS process / OS thread. It is even more lightweight than those.
- Can have thousands and millions of proceses running in Erlang at any time.
- Each Erlang process is assigned it's own memory.
	- no two Erlang processes share memory.