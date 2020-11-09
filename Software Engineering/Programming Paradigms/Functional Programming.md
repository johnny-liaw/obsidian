# Features of Func Programming
#### Pros
- Immutability
	- Transformations on data will always be stored in a new location.
		- In other words, already existing data will never be mutated in memory.
	- Begets predictability.
- Great for multithreaded systems, as threads can access the same location in memory and expect the same result no matter what.

#### Cons
- Performance is often slower, as lots of copying and pasting of data?
- IO relies on functions with side effects.


---

#softwareEng #programmingParadigms