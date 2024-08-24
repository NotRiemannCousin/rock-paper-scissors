# Rock Paper Scissors

### A simple Rock Paper Scissors game that explores a cool link between the classical game and the $R^3$ linear space: rotative anticommutative operations.

The $R^3$ linear space has an operation called cross product ($\vec{v_{1}} \times \vec{v_{2}}$). This operation is anticommutative, i.e., $\vec{v_{1}} \times \vec{v_{2}} \ne \vec{v_{2}} \times \vec{v_{1}}$. To be cleaner, $\vec{v_{2}} \times \vec{v_{1}} = -\vec{v_{1}} \times \vec{v_{2}}$ for $\vec{v_{1}}$ and $\vec{v_{2}}$ different than $\vec{0}$. Other cool property is 
the self cross product of a vector, that always result in $\vec{0}$.

Rock Paper Scissors works in a similar way. Let's denote $P1$ and $P2$ as the choice of each player, and fix $P1$ to always to be evaluated first. ${Rock} \times {Paper} = {P2 \  wins}$ and ${Paper} \times {Rock} = {P1 \  wins}$, the oposite of the first statement. Aditionally, ${Rock} \times {Rock} = {Draw}$. Let's prot a table with these two groups:

![table with the results of applying cross product with unitary vector components](<imgs/table vectors.png>)

*All possible results by applying cross product with the unitary vector components*

![table with the results of Rock Paper Scissors](<imgs/table rps.png>)

*All possible results in Rock Paper Scissors*


Can you see? In the fist table, where the result is $\vec{0}$, in the second table there is a draw. Where it is $\hat{i}$, $\hat{j}$ or $\hat{k}$ P2 wins and where it these same vectors scalled by $-1$ P1 wins.

If we apply cross product with $\vec{u} = (1,1,1)$ to all vectors in the first table, all cells where the result was $\vec{0}$ becomes $0$. Where it was is $\hat{i}$, $\hat{j}$ or $\hat{k}$ it becomes $1$, and these same vectors scalled by $-1$ the result is $-1$. This way, we mapped all draws to be equals to zero, all times P1 wons to be -1 and all times where p2 wons to be 1.

This project has a simple implementation of rock paper scissors using this approuch.
