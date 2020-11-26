# What is Supervisor?
- Overwatches child processes/child supervisors to restart them if they shutdown.
	- Can specify how you want to restart child processes.

```elixir
defmodule MyApp.Supervisor do
  # Automatically defines child_spec/1
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    children = [
      {Stack, [:hello]}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
```
- children is a list of children processes
	- 2 arguments: the GenServer module, and the argument passed into the start_link of the GenServer module.
		- In this case `:hello` is being passed to the start_link method.

## Supervisor process restart strategies
