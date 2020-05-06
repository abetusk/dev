My Favorite Logic Puzzles
===

Solutions at the bottom.

Monty Hall
---

A game is played in the following order:

* The game host shows 3 doors, one of which has a prize behind it while the others do not
* The host secretly places the prize at random behind 1 of the 3 doors
* You pick a door
* After you pick a door, the host opens one door other than the one you picked to show
  no prize behind it
* The host then asks you whether you would like to switch or stay

Note: The prize's location stays fixed initial placement.

**Q: What is the tactic (to switch or stay) that maximized probability of winning the prize?**

### Alternate version

* With probability $\frac{1}{2}$, a red or green ball is secretly placed in a bag
* A red ball is then placed in the bag
* A ball is chosen at random from the two balls in the bag and is discovered to be red

**Q: What is the probability that the other ball in the bag is red?**

Truthsayers and Liars
---

You come to a fork in the road where one path leads to riches and
the other to doom.

A person stands at the crossroads who either always tells the truth or
always lies.

**Q: What is one question that can be asked to make sure you go on the path
to the prize?**

Prisoner's in a Line
---

* $N$ prisoners are placed in a line, all facing front
* A red or green hat is placed on each prisoner's head
* Prisoner at position $p$ ($0 \le p < N$) can see all prisoners
  at positions $p+1$ to $N-1$ (that is, they can see all prisoners in front of them)
* Prisoner at position $p$ cannot see prisoners hat at positions $0$ to $p$
  (that is, they cannot see their own hat or any prisoner's hat behind them)
* The warden starts at position $0$ and asks what the prisoner's hat is
* When asked about their hat color, prisoners can only respond "red" or "green"
* All prisoners in front can hear answers to the hat questions from prisoner's
  behind them
* Prisoners who guess their hat color correctly are freed while an incorrect guess
  leads to life imprisonment

Note: prisoners are allowed to collude on a solution before the game starts but
the warden is assumed to be listening in and can change the prisoner order or hat
color placement depending on the prisoner's strategy.

**Q: What tactic should be employed by the prisoners to save the maximum number of people?**

Dominoes on a Mutilated Chessboard
---

A chessboard has 64 squares on it (8 rows by 8 columns).
A domino takes up 2 squares on a chessboard.

If two squares are removed from the chessboard, one from the upper left corner and the other from the lower right corner,
Can 31 dominoes be put on a chessboard to completely cover it?

Green Eyed Islanders and the Outsider
---

* $N$ people on an island
* $0 < M \le N$ have green eyes (that is, at least one islander has green eyes) while all others have red eyes
* Initially, no islander knows their own eye color
* If an islander figures out their eye color anytime during the day, they leave the island that night
* One morning, an outsider comes in and announces "At least one of you has green eyes"

Note: islanders consider it rude to tell each other their eye color and do not look in mirrors.

**Q: How many islanders are left on the island after $N$ days?**

Numbered Boxes
---

* $N$ people have a unique number from $0$ to $(N-1)$ assigned to them
* $N$ boxes are labeled uniquely from $0$ to $(N-1)$
* $N$ slips of paper have a unique number from $0$ to $(N-1)$ written on them
  and placed in a box, one slip of paper per box, randomly
* Each of the $N$ people is brought in and allowed to look at $\lfloor N/2 \rfloor$ boxes
* Once the game starts, no communication is allowed between players

**Q: What strategy maximizes each player finding their own number in a box?**

Drunk Passengers on a Plane
---

* There are $N$ seats on a plane
* There are $N$ passengers, each uniquely assigned one of the $N$ seats
* Each passenger will take their assigned seat if available, otherwise they will pick a seat at random
* Each passenger boards one by one
* The first passenger is drunk and sits in the incorrect seat

**Q: What is the probability that the last passenger will sit in their assigned seat?**

Duplicates in a List
---

* An array of length $N+1$
* Elements are only drawn from $[1,N]$

Note: there is at least one duplicate entry in the array.

**Q: In $O(\lg N)$ space and $O(N)$ time, find any duplicated entry**


Cat in a Box
---

* $N$ adjacent rooms (that is, an array of rooms where all but the ends rooms have access to the left and right room next to them)
* A cat exists in a room, initially placed at random
* Each round, the cat moves to an adjacent room and does not stay in a room that it is currently in
* Each round, you are allowed to open the door to a room

**Q: What is the strategy to maximize the chance of finding the cat?**

Prisoners and the Coin
---

* $N$ prisoners are separated and not allowed to communicate
* At the warden's prerogative, a prisoner is brought in and fed
* While the prisoner is eating, the prisoner is allowed to observe and flip a coin,
  if they so choose
* The coin is initially in a random state at the warden's whim
* No prisoner is allowed to starve
* At any point, any prisoner is allowed to say "We've all been here", at which
  point they will all be let go if correct or sentenced to life without parole
  if wrong

Note: prisoners are allowed to collude on a solution before the game starts.

**Q: What strategy can the prisoners employ to maximize the chances for their freedom?**

The Devil and Coins on a Chessboard
---

* An $8x8$ chessboard has $64$ coins placed in each square
* The Devil chooses the initial configuration of coins
* You are brought and the following chain of events take place:
  - The Devil points to one position on the chessboard
  - You must flip **any** one coin, in any position on the chessboard
  - You are escorted out
* Your partner is escorted in to observe the chessboard
* Your partner guesses which position the Devil pointed to

Note: you and your partner are allowed to collude beforehand but no communication
is allowed while playing.
The Devil is assumed to be listening in while you and your partner collude.

**Q: What strategy can be employed to maximize the chances of your partner guessing the pointed to position correctly?**



Solutions
===

Monty Hall
---

Switching gives a $\frac{2}{3}$ chance of winning whereas staying gives $\frac{1}{3}$.

One way to see this is to play with $N$ doors.
After the initial pick by the player, the game show host will reveal $(N-2)$ doors, in effect giving you
$(N-1)$ door reveals if you switch but only $1$ if you stay.

From personal experience, only when people experience the loss do they recant on their initial $\frac{1}{2}$ estimate.

Here is a program to convince yourself should you be adamant about staying as a solution:

```
#!/usr/bin/python3

import re,sys,random
N = 100
total_wins=0
total_losses=0
while True:

  guess=-1
  prize_door = int(float(N)*random.random())
  closed_door = prize_door

  print("\n---\nThere are", N, "doors.")
  sys.stdout.write("Door guess [0-" + str(N-1) + "] ('q' to quit): ")
  sys.stdout.flush()
  line = sys.stdin.readline()

  if re.match('\d+', line): guess = int(line.strip())
  else: break

  if (guess<0) or (guess>=N):
    guess = int(float(N)*random.random())

  if guess == prize_door:
    closed_door = int(float(N)*random.random())
    if closed_door >= guess:
      closed_door = (closed_door + 1) % N

  open_door = []
  for idx in range(N):
    if (idx!=guess) and (idx!=closed_door): open_door.append(str(idx))

  print("You picked", guess)
  print("Doors", ",".join(open_door), "are opened.")
  print("Doors", guess, closed_door, "remain closed")
  sys.stdout.write("Would you like to switch [y/n]? ")
  sys.stdout.flush()

  line = sys.stdin.readline()
  if (len(line) > 0) and ((line[0] =='y') or line[0] == 'Y'):
    guess = closed_door

  print("Your door is now", guess)

  if guess == prize_door:
    total_wins+=1
    print("Congratulations! You won!")
  else:
    total_losses+=1
    print("Sorry, the prize was behind door", prize_door, "(you guessed", guess,")")

  print("\nYour total wins are now:", total_wins, "and total losses are:", total_losses)
```

Truthsayers and Liars
---

> If I were to ask you which path is the road to the prize, what would you say?

Prisoner's in a Line
---

$(N-1)$ can be saved by having prisoner $0$ call out the parity of hat colors (suitably encoded as "red" or "green")
of the $(N-1)$ prisoners in front of them.

Each subsequent prisoner will have full information to guess their own hat color correctly.

Dominoes on a Mutilated Chessboard
---

No, by a parity argument.

The 62 squares now have 30 white squares and 32 black squares.
Since a domino must cover both a white and black square, a domino must cover two black squares, which
is an impossibility.

Green Eyed Islanders and the Outsider
---

A proof by induction will show that no islanders will be left.

For $M$ green eyed islanders, from the perspective of a red eyed islander, they should all leave after $M$ nights. If the green eyed
islanders leave after $M$ nights, that means $N-M$ red eyed islanders remain, forcing them to leave the subsequent night.

For $M$ green eyed islanders, from the perspective of a green eyed islander, if they don't leave after $(M-1)$ nights, that means
they must have green eyes, forcing them to leave on the $M$'th night, then causing the red eyed islander to leave on the $(M+1)$st night.

Numbered Boxes
---

Each participant opens the box with their own label.
They then jump to the box of the number that is written on the piece of paper.

This becomes the probability that the maximum cycle in a random permutation is less than $\frac{N}{2}$


Drunk Passengers on a Plane
---

One "quick and dirty" way is to approximate by asking what the probability is of "drawing"
a number from a dwindling pool of seats.

$$
\prod_{k=0}^{N-1} (1 - \frac{1}{n-k}) \approx 
\prod_{k=0}^{N-1} (1 - \frac{1}{n}) = (1 - \frac{1}{n})^n \to \frac{1}{e}
$$

Giving $1-e^{-1}$.

This assumes independence and a lot of hand waiving.

The more rigorous analysis...


Duplicates in a List
---

hmm...

Cat in a Box
---

Start from the left most room, then increment to the right by one at each round.
Wait an extra round at the right most door, then start going from right to left by an increment of 1 at each round.

Starting from the left and then moving right forces the cat's position to the left of the current position into box positions
of the same parity.
Once the right has been reached, moving back towards the left with the cat's position forced into room positions of the
same parity ensures the cat can't "skip" over the current position.

Prisoners and the Coin
---

A designated prisoner is chosen to flip the coin from tails to heads should they see it in a tails state and
count the number of times they do so.

All other prisoners will flip the coin from heads to tails a maximum of two times, doing so every chance they get.

Once the designated prisoner sees the coin flip $(2N-3)$ times, they can announce that they've all been in the room.

If the initial state of the coin is known, the count can be reduced to $(N-1)$.

The Devil and Coins on a Chessboard
---

Unknown


###### 2020-04-30
