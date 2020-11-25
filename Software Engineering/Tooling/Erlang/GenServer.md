# What is GenServer?
- Creates a  uniform way to view/mutate state

```elixir
defmodule Bucket do
	use GenServer
	
	def start_link do
		GenServer.start_link(__MODULE__, initial_state)
	end
end
```
- `use Genserver` is required.
- GenServer.start_link star