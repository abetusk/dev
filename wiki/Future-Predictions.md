Future Predictions
===

These are a set of predictions about what's going to happen in the future.

Each prediction will have conditions that need to be met in order for them to
be considered true as well as conditions that indicate if the prediction was wrong.

Each prediction is meant to be falsifiable to avoid making broad claims that could
be considered having come to pass because of ambiguous assertions.

Artificial Intelligence
---

> Human level artificial intelligence will be a reality by the year 2030

| Conditions for acceptance |
|---|
| Text conversation that is indistinguishable from human text conversation (passing the Turing test) |

| Conditions for failure |
|---|
| Only independent aspects that have been solved without putting them together (image recognition, natural language process, etc. without a complete system that integrates all of them together) |
| Easily fooled chatbots |

The fundamental assumptions for this prediction are:

* Human cognition is the result of simple algorithms working in parallel on massive data sets
* The human brain capacity is roughly 2.3 Pb of information
* Hard disk space is a good proxy for the feasibility of producing human level intelligence
* AI will be achieved when commodity hardware is available, in the form of roughly a $1000 option, that has the compute and storage of the human brain (3.2Pb)

Using [jcmit.net/diskprice](https://jcmit.net/diskprice.htm) as a source, depending on how you count, hard drive prices fall at a rate of 1/2 every 2-3 years.
As of this writing, the prices is about $\$$150/8Tb (.00000000001705302565 $\$$US/byte).

$$
\begin{equation}
\begin{split}
\frac{\$ 1000}{2.3 \text{Pb} \cdot 2^{10} }   & = 2^{-y \alpha}\frac{\$150}{8 \text{Tb}}  \\\\
\to y  &= \frac{ - \lg{\left( \frac{8000}{2.3 \cdot 150 \cdot 2^{10} }\right)} }{\alpha} \\\\
\end{split}
\end{equation}
$$

$y$ is the number of years and 
$\alpha$ is the doubling factor.
If $\alpha \in (\frac{1}{2}, \frac{1}{3})$, this gives a timeline of roughly 10 to 16 years before we'll see a hard drive that has the storage capacity of the human brain for
about $\$$1000 USD.

The 2030 prediction is a bit aggressive and considering Moore's law might be slowing down, the timeline might be closer to 2040.
Regardless, I am staying with my 2030 prediction.

Crypto Currency
---

> A crypto currency, most likely Bitcoin, will be a major global currency, storing at least %20 of the global wealth by 2030

| Conditions for acceptance |
|---|
| Used in day-to-day life for purchases and money transfers |
| By some reasonable estimate, 20% of the worlds wealth is stored in a crypto currency |

| Conditions for failure |
|---|
| Not used for day-to-day purchases |
| Only a select few have crypto currency wallets |
| Crypto currency is treated a stock or bond rather than a currency |

I believe Bitcoin to be the most likely leader as there's so much work and buy in currently, but this could change.
A good rule of thumb of crypto currency not taking over is that if the USD price per coin is not high **or** the
price per coin is very high but is not in widespread usage, signaling that it's being used by the wealthy as a kind
of modern stock market.

The prediction of 2030 is done by using historic USD-BTC price ([src](https://finance.yahoo.com/quote/BTC-USD/history/)) and roughly
fitting an exponential curve (by "eye").
Bitcoin is still in it's infancy so it's highly volatile, so this prediction might be significantly off.

Part of this prediction is the fact that crypto currency solves a lot of problems and opens up new avenues for global trade:

* Online purchases have the potential to be much easier
* Money transfers have the potential to be much more seamless and cheap
* Currency exchanges (for purchases, etc.) are normalized to a de-factor standard (e.g. Bitcoin)
* Non provincial ownership allowing for de-centralized operation and direction

As a side note, total global wealth as of 2019 is estimated to be $\$$360T
($ \$360 \cdot 10^{12} $) ([src](https://www.credit-suisse.com/about-us/en/reports-research/global-wealth-report.html)).
If Bitcoin is capped at 21M coins and establishes itself by storing %20 of the $\$$360T, this gives $ \frac{ \$360T \cdot 0.2 }{ 21M BTC } \approx \$3.4M/BTC $.

Energy Production
---

> Solar, wind and battery technology will account for the majority of the worlds energy production by 2040

| Conditions for acceptance |
|---|
| Over 50% of the world's energy usage will come from solar, wind and stored energy in the form of battery technology |


| Conditions for failure |
|---|
| Fossil fuels (coal), nuclear or other energy sources still being the primary energy provider |

Swanson's law ([w](https://en.wikipedia.org/wiki/Swanson%27s_law)) has photo voltaic cell prices falling at about 10% per year.
This is roughly a price halving every 6-7 years.
Current prices are about $\$$0.75 / W for low volume consumer panels and $\$$0.20 / W for higher volumes.

I guess there's debate on whether batteries follow a Moore's law like price curve ([src](https://longtailpipe.com/2013/04/06/there-is-moores-law-for-batteries-its/) [src](https://longtailpipe.com/2013/04/06/there-is-moores-law-for-batteries-its/)) but prices are falling at about %20 per year ([src](https://about.bnef.com/blog/behind-scenes-take-lithium-ion-battery-prices/)) perhaps due to Wright's law ([w](https://en.wikipedia.org/wiki/Experience_curve_effects)).
Regardless, as of this writing, lead acid batteries are at $\$$0.15/Wh and lithium batteries look to be somewhere in the range of $\$$0.15/Wh to $\$$0.05/Wh.

The average US household consumes 30 kWh per day.
Assuming a 12 hour sunlight window, that's $30 kWh / 12h = 2500 W$ needed.
The average American pays $\$$0.1854/kWh leading to about $\$$1400/year in electricity costs ([src](https://www.eia.gov/tools/faqs/faq.php?id=97&t=3)).

If we assume we want at least a 2.5KW solar panel array and storage for 30kWh, that's $\$$2000 to $\$$6500, which is 2-5 years before the installation pays for itself.
In five years time that changes to about $\$$800 to $\$$2500, which is about 0.5 to 2 years before the installation pays for itself.

Solar and battery technology might have a lot of hidden costs and other factors that might prohibit them from falling in price so drastically over the coming years
but when an installation gets within the cost of a single months electricity payment, it's hard to see how this couldn't become widely adopted.

2040 is a conservative estimate and is made in consideration that I'm no doubt missing a large number of other factors that come into play from creating, deploying and installing energy stations,
on the consumer or business side.


