# Why does it exist?
- Translates public to private addresses. Allowing devices in a **public** network able to communicate with **private** IP's via [[Port Forwarding]].
- Can perform [[L4 Load Balancing]].

# What does it do?
![[Screen Shot 2020-11-07 at 4.43.30 pm.png]]
- When sending data from private subnet to another device, NAT transforms the src IP and port of the packet to the public IP and a random port number of the NAT. **This is saved in a table**


![[Screen Shot 2020-11-07 at 4.49.51 pm.png]]
- When data is returned from server outside of the subnet. It uses the network address translator table saved to perform [[Port Forwarding]], and send the data to the right receiver.

---

#networkEng #softwareEng #OSI

---
