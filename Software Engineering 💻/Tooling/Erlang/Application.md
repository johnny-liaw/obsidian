# What is Application?
- A program that can be started and stopped.

```elixir
# in mix.es
def application do
	[mod: {MyApp, []}]
end
```
- MyApp is the application callback module -> the module that gets called when the application starts
- It also takes a list of start parameters. 

```elixir
defmodule MyApp do
	use Application
	
	def start(_type, _args) do
		children = []
		Supervisor.start_link(children, strategy: :one_for_one)
	end
end
```
- Callback module must implemente the `Application` functional interface
- Starts the supervisor process.