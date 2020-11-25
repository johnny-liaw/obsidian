# What is GenServer?
- Creates a  uniform way to view/mutate state


## GenServer.start_link

```elixir
defmodule Bucket do
	use GenServer
	
	def start_link do
		GenServer.start_link(__MODULE__, initial_state)
	end
end
```
- `use Genserver` is required.
- GenServer.start_link wraps the module passed in, and the takes the initial state of the server.


## GenServer.init
```elixir
defmodule Bucket do
	use GenServer
	
	def start_link do
		GenServer.start_link(__MODULE__, initial_state)
	end
	
	def init(initial_data) do
		{:ok, initial_data}
	end
end
```
- `GenServer.start_link` will call init()
- `init()` must return a tuple with :ok and initial data you want to set the GenServer initial state as.

```elixir
defmodule Bucket do
	use GenServer
	
	def start_link do
		GenServer.start_link(__MODULE__, initial_state)
	end
	
	def init(initial_data) do
		{:ok, %{:greeting => initial_data}}
	end
end
```
- 

### Cast vs Call
- Call = Synchronous = Requires an answer
- Cast = Asynchronous = Doesn't requre an answer