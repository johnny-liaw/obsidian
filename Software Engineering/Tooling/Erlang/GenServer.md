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
- Also able to do transformations on the initial server data via the init method.

## GenServer.handle_call
```elixir
defmodule Bucket do
	use GenServer
	
	def start_link do
		GenServer.start_link(__MODULE__, initial_state)
	end
	
	def init(initial_data) do
		{:ok, initial_data}
	end
	
	# client interface code
	def get_state(pid) do
		# server interface code
		GenServer.call(pid, {:get_state})
	end
	
	def handle_call({:get_state}, _from, my_state) do
		{:reply, my_state, %{}}
	end
end
```
- `get_state` calls the `GenServer.call` method directly
- `handle_call` implements the `GenServer.call` method previously referenced.
	- receives 3 params: { param_from_caller, pid_of_caller, state_of_server }
	- must return: { :reply, response_val, new_server_state } / { :noreply, new_server_state }

## GenServer.handle_info
- handles all messages not sent to  `handle_call` and `handle_cast` calls. 
	- Used for monitoring processes through `Process.monitor` and scheduling jobs with `Process.send_after`

### Cast vs Call
- Call = Synchronous = Requires an answer
- Cast = Asynchronous = Doesn't requre an answer