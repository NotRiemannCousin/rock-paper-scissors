# Rock Paper Scissors

### Rock Paper Scissors: A Connection to R³ and Anticommutative Operations

The $R^3$ vector space has an operation called the cross product ($\vec{v_{1}} \times \vec{v_{2}}$). This operation is anticommutative, meaning $\vec{v_{1}} \times \vec{v_{2}} \ne \vec{v_{2}} \times \vec{v_{1}}$. More precisely, $\vec{v_{2}} \times \vec{v_{1}} = -\vec{v_{1}} \times \vec{v_{2}}$ for $\vec{v_{1}}$ and $\vec{v_{2}}$ for $\vec{v_{1}}$ and $\vec{v_{1}}$ that are non-zero. Another interesting property is that the cross product of any vector with itself always results in the zero vector ($\vec{v_{2}} \times \vec{v_{1}} = \vec{0}$).

Rock Paper Scissors works in a similar way. Let's denote $P1$ and $P2$ as the choice of each player, and fix $P1$ to always to be evaluated first. ${Rock} \times {Paper} = {P2 \  wins}$ and ${Paper} \times {Rock} = {P1 \  wins}$, the oposite of the first statement. Aditionally, ${Rock} \times {Rock} = {Draw}$. Let's prot a table with these two groups:

The Rock Paper Scissors game behaves similarly. Let's denote $P1$ and $P2$ as the choices of each player, and fix $P1$ to always be evaluated first. For instance, ${Rock} \times {Paper} = {P2 \  wins}$, and ${Paper} \times {Rock} = {P1 \  wins}$, which is the opposite of the first result. Additionally, ${Rock} \times {Rock} = {Draw}$.
Now, let’s look to a table with all possble results to these 2 process:

![table with the results of applying cross product with unitary vector components](<imgs/table vectors.png>)

*All possible results by applying cross product with the unitary vector components*

![table with the results of Rock Paper Scissors](<imgs/table rps.png>)

*All possible results in Rock Paper Scissors*


Notice the similarity? In the first table, where the result is $\vec{0}$, the second table shows a draw. Where the result is $\hat{i}$, $\hat{j}$ or $\hat{k}$, $P2$ wins, and where these vectors are the same from the last result but scaled by $-1$, $P1$ wins.

If we apply cross product with $\vec{u} = (1,1,1)$ to all vectors in the first table, all cells where the result was $\vec{0}$ becomes $0$. Where it was is $\hat{i}$, $\hat{j}$ or $\hat{k}$ it becomes $1$, and these same vectors scalled by $1$ the result is $1$. This way, we mapped all draws to be equals to zero, all times P2 wons to be 1 and all times where P1 wons to be -1.

If we apply the cross product with $\vec{u} = (1,1,1)$ to all vectors in the first table, the cells where the result was $\vec{0}$ become $0$. Where the result was $\hat{i}$, $\hat{j}$ or $\hat{k}$, it becomes $1$, and where these base vectors were scaled by $-1$, the result is $-1$. This way, we map all draws to zero, all instances where $P2$ wins to $1$, and all instances where $P1$ wins to $-1$.

This project includes a simple implementation of Rock Paper Scissors using this approach with a visual representation.

![demo](<imgs\table print.png>)