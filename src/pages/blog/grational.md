---
layout: ../../layouts/MarkdownPosts.astro
title: "Some Tough Application Problems"
publishDate: "2024-10-18"
author: "Ashiful Bhuiyan"
description: "Found in the Nelson Grade 12 Math textbook."
---

# Nelson Chapter 5.4
It's funny. I remember doing these problems when I was 17 years old, and they were a struggle for me too back then. I spent hours trying to figure these out, but the time I spent it was fun for me. I got to talk to my friends and see how they attempted the difficult problems, and I got to teach how to solve the problems to my classmates that did not fully understand how to solve the problem. 

## Question 10
The Turtledove Chocolate factory has two chocolate machines. Machine A takes s minutes to fill a case with chocolates, and machine B takes s + 10 minutes to fill a case. Working together, the two machines take 15 minutes to fill a case. Approximately how long does each machine take to fill a case?

## The wrong solution
Saying s+10 + s = 15 is the wrong method of solving this. If we continue to solve this way, we find that s = 2.5 meaning that in the time it takes machine B to make 1 box in 12.5 min, machine A would have made 5 boxes since it takes 2.5 minutes to make a single box. But this is a contradiction because then how can it take 15 minutes to make a single box working together?

## Solution
To arrive at the correct solution
We will use this formula which we can derive using "common sense"

$$
\text{Time} \times \text{Productivity} = \text{Total amount of work done},
$$
where *Productivity* is the amount of work done during a unit of time.

1. Find the amount of work each machine does in 1 minute.
Dividing the total amount of work (1 case) by time, we get 1/s and 1/(s+10). Together, the two machines fill 1/15 of the case in one minute.

$$
\frac{1}{15} = \frac{1}{s} + \frac{1}{s+10}
$$

2. We can now solve for $s$.

First, bring the right-hand side over a common denominator:
$$
\frac{1}{15} = \frac{s + 10 + s}{s(s + 10)} = \frac{2s + 10}{s(s + 10)}
$$

Now cross-multiply:
$$
s(s + 10) = 15(2s + 10)
$$
$$
s^2 + 10s = 30s + 150
$$
$$
s^2 - 20s - 150 = 0
$$

 Using the quadratic formula to solve for the unknowns:
$$
s = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} = \frac{20 \pm \sqrt{20^2 + 4 \times 150}}{2} = \frac{20 \pm \sqrt{1000}}{2} = \frac{20 \pm 10\sqrt{10}}{2}
$$
$$
s = 10 \pm 5\sqrt{10}
$$

Since $s$ must be positive, we reject the negative zero. Therefore:
$$
s = 10 + 5\sqrt{10} \approx 10 + 5 \times 3.16 = 25.8
$$

Machine A takes approximately 26 minutes to fill a case, and machine B takes:
$$
s + 10 \approx 25.8 + 10 = 35.8
$$

## Answer:
 Machine A fills the case in approximately 26 minutes, and machine B fills the case in approximately 36 minutes.

## Question 11
Tayla purchased a large box of comic books for \$300. She gave 15 of the comic books to her brother and then sold the rest on an Internet website for \$330, making a profit of \$1.50 on each one. How many comic books were in the box? What was the original price of each comic book?

## Solution:

Let $x$ be the number of comic books in the box.

The number of sold comic books is $x - 15$.

The original cost of each comic book is:
$$
\frac{300}{x}
$$

The total cost of the books Tayla gave to her brother is:
$$
15 \times \frac{300}{x}
$$

The original cost of all the books sold on the internet is:
$$
300 - 15 \times \frac{300}{x}
$$

The profit equation from economics we know is: $$Revenue - Cost = Profit$$
$$
330 - \left(300 - 15 \times \frac{300}{x}\right) = 30 + \frac{4500}{x}
$$

Now, according to the problem, Tayla makes a profit of \$1.50 per sold comic book:
$$
30 + \frac{4500}{x} = (x - 15) \times 1.5
$$
Simplifying the equation:
$$
30 + \frac{4500}{x} = 1.5(x - 15)
$$
$$
20 + \frac{3000}{x} = x - 15
$$

Multiplying through by $x$ and simplifying:
$$
x^2 - 35x - 3000 = 0
$$

Using the quadratic formula to solve for $x$:
$$
x = \frac{-(-35) \pm \sqrt{(-35)^2 - 4(1)(-3000)}}{2(1)}
$$
$$
x = \frac{35 \pm \sqrt{1225 + 12000}}{2} = \frac{35 \pm \sqrt{13225}}{2}
$$
$$
x = \frac{35 \pm 115}{2}
$$
$$
x_1 = -40 \quad \text{(not valid)}
$$
$$
x_2 = 75
$$

Thus, the number of comic books is 75.

The original price of each comic book is:
$$
\frac{300}{75} = 4 \text{ dollars}.
$$

## Answer:
 The number of comic books is 75, and the original price of each comic book is \$4.
