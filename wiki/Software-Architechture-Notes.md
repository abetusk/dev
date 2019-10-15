Software Architecture Notes
===

Microservices
---

[Microservervice Anti-Patterns](https://www.youtube.com/watch?v=I56HzTKvZKc)

The advice is as follows:

* Use boring technology
  - Greedily create micro-service architecture instead of starting with one when not necessary
  - Monolithic architecture is fine to start out
* Use proxy schemas
  - Use a proxy server to a DB, say, to keep the API consistent
* Use queues
  - Create a queue service which buffers messages to then be ferried to the destination
  - Smooths out spikes
  - Allows to work around shortcomings of end service (DB, say?)
* Use discovery tools
  - Don't hard code addresses in code
  - Use a service to discover the end point
* Use rate limitation
  - Probably good to have both client side and server side detection to rate limit
* Use debugging tools early
  - Monitoring of the architecture is necessary for smooth operation
  - Issue becomes sifting through the data but better to have the data to sift through
    in the first place than not at all



