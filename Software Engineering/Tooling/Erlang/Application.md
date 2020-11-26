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
# in mix.es
def application do
	[mod: {MyApp, []}]
end
```