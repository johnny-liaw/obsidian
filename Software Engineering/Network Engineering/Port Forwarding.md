# What is port forwarding?
The process of mapping a IP and port pair to another Ip and port pair.

**i.e.**

| Form  | To  |
| ------------- | ----------------- |
| 44.33.22.11:8080          | 192.168.0.1:7900    |
| 66.55.44.33:8081          | 192.168.0.2:6800 |

## Example use case
1. Lets say I'm in a private subnet hosting a CS game on my IP and port: 192.168.0.1:8080. My ISP issued modem has a public IP 44.33.22.11.
2. There are other players that want to join this game.They can't connect to 192.168.0.1:8080 directly.
3. So you set up a port forwarding service for 44.33.22.11:8081 -> 192.168.0.1:8080 so everyone can play together.

---

#networkEng #softwareEng #OSI

---