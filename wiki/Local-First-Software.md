Local First Software
===

* Speed
* Synchronized
* Detachable
* Collaborative
* Access
* Secure
* Control

[Blog post](https://blog.acolyer.org/2019/11/20/local-first-software/)
and [original paper](https://martin.kleppmann.com/papers/local-first.pdf).

Description
---

### Speed

Operations should be done on local data as much as possible.
Synchronization to off-device storage should be done in the background.

### Synchronized

Data should be synchronized across applications that use it.

### Detachable

The application should be available for use, as much as possible, even when
the network isn't present.
If local peers are available, data should be synchronizable between the local
peers or local network.

### Collaborative

When possible, the application should be able to be used in collaboration with
others.

### Access

Data should always be accessible and exportable at all times.

### Secure

End-to-end encryption should be used.
Central server storage should have data encrypted at rest.

### Control

The end user is in control of their data and should have full writes over it
without synthetic or unwanted restrictions.

Implementation
---

#### Distributed Data Structure

Conflict Free Replicated Data Types ([CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)) are an option
for data synchronization.
Operation-based (Commutative Replicated Data Types (CmRDT)) and state-based (Convergent Replicated Data Type (CvRDT))
are two options:

| Approach | Advantages | Disadvantages | Constraints |
|----------|------------|---------------|-------------|
| CmRDT | Delta updates | Required Communication Guarantees | Commutative |
| CvRDT | Simplicity | Full State Update | Commutative, Associative, Idempotent |

#### Access

Text centric file formats should be preferred such as JSON or CSV.

#### Secure

Here are some thoughts on providing secure access options to the application on a device:

* Last Use Timeout - provide password after a preset time of last use
* Periodic Timeout - provide password after preset time, regardless of last use
* Password on Session Start - enter password when entering into a new session or after a session sign off

#### Control

It's hard to talk about control without some sort of underlying free software assumption.

References
---

* Local-First Software: You Own Your Data, in spite of the Cloud by Martin Kleppmann, Adam Wiggins, Peter van Hardenberg and Mark McGranaghan ([link](https://martin.kleppmann.com/papers/local-first.pdf)).

###### 2019-11-20
