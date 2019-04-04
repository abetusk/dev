CO2 and Water Food Usage
===

| Type | Per Capita Yearly Consumption (kg) | Per Capita Yearly CO2 Emission ($\frac{kg}{(cap)(yr)}$) | Per Capita Yearly Water Consumption ($\frac{kg}{(cap)(yr)}$) 
|---|---|---|---|
| Meat (beef) | 25.85 | 742.67 | 324.68 | 
| Meat (pork) | 23.04 | 134.78 | 102.76 |
| Meat (poultry) | 109.6 | 451.55 | 261.94 |
| Milk (cow) | 67.59 | 93.95 | 67.59 |



| Diet | Per Capita Yearly CO2 Emission ($\frac{kg}{(cap)(yr)}$) | Per Capita Yearly Water Consumption ($\frac{kg}{(cap)(yr)}$) | Notes |
|---|---|---|
| American Omnivore | 1422.96 | 756.97 | Meat and milk consumption taken from the National Chicken Council and the USDA |
| American Vegetarian | 515.53 | 275.21 | Meat, pork and poultry replaced with soybean (by weight, assumed 158.49kg of soybean) for CO2 emission. Meat, pork and poultry replaced with rice (by weight, assumed 158.49kg of rice) for water consumption. Cow milk still used (67.59kg) |
| American Vegan (estimate 0) | 449.97 | 491.80 | Meat, pork and poultry replaced with soybean (by weight, assumed 158.49kg of soybean) for CO2 emission. Meat, pork and poultry replaced with rice (by weight, assumed 158.49kg of rice) for water consumption. Almond milk used with 225g of almonds per litre of almond milk (assuming 67.59 L of almond milk consumed per capita per year)  |
| American Vegan (estimate 1) | 449.97 |  231.60 | Meat, pork and poultry replaced with soybean (by weight, assumed 158.49kg of soybean) for CO2 emission. Meat, pork and poultry replaced with rice (by weight, assumed 158.49kg of rice) for water consumption. Almond milk used with 20g of almonds per litre of almond milk (assuming 67.59 L of almond milk consumed per capita per year)  | |


Worked calculations:

```
w = 25.85 + 23.04 + 109.6 = 158.49
milk = 67.59

omni_co2 = (25.85*28.73) + (23.04*5.85) + (109.6*4.12) + (milk*1.39)
omni_h2o = (25.85*12.56) + (23.04*4.46) + (109.6*2.39) + (milk*1)

veg_co2 = w*2.66 + milk*1.39
veg_h2o = w*1.31 + milk*1

vegan_co2_0 = w*2.66 + milk*0.42
vegan_h2o_0 = w*1.31 + milk*(17.74*.237)

vegan_co2_1 = w*2.66 + milk*0.42
vegan_h2o_1 = w*1.31 + milk*(17.74*.02)

```

The following additional notes should be considered:

* I've found conflicting reports for the number of almonds in almond milk. If it's assumed that there are 225g of almonds per gallon of almond milk, this is `estimate 0` above (.237kg almonds per litre). If it's assumed the almond milk is 2% (by weight), then this is `estimate 1` above (.02kg almonds per litre).
* The `American Omnivore` diet estimates does not include rice, wheat, maize, vegetables or other non-animal products so can be considered a 'lower bound' on per capita CO2 and water consumption.
* The non `American Omnivore` entries use soybeans as a proxy for the meat (by weight) for CO2 emission and rice as a proxy for meat (by weight) for water consumption to give a conservative estimate of the CO2 emissions and water usage.

References
---

### ["Per Capita Consumption of Poultry and Livestock, 1965 to Estimated 2019, in Pounds"](https://www.nationalchickencouncil.org/about-the-industry/statistics/per-capita-consumption-of-poultry-and-livestock-1965-to-estimated-2012-in-pounds/)

| Year | Beef (lbs) | Pork (lbs) | Total Poultry (lbs) |
|------|------------|------------|---------------------|
| 208  | 57.0 | 50.8 | 109.6 |

This implies `25.85kg` of beef, `23.04kg` of pork and `49.71kg` of poultry for the average American.

### ["Dairy Data"](https://www.ers.usda.gov/data-products/dairy-data/)

The [per capita consumption of dairy for Americans](https://www.ers.usda.gov/webdocs/DataFiles/48685/pcconsp_1_.xlsx?v=2065.5):

| Year | Milk Consumption (lbs) |
|---|---|
| 2017 | 149 |

149 pounds per person per year is about `67.59kg`per person per year.

### ["Food consumption patterns and their effect on water requirement in China" by  J. Liu and H. H. G. Savenije](https://www.hydrol-earth-syst-sci.net/12/887/2008/hess-12-887-2008.pdf)

| Food | Water footprint ($\frac{m^3}{kg}$) | Per capita annual food consumption (2003) ($\frac{kg}{(cap)(yr)}$) |
|---|---|---|
| Rice | 1.31 | 79 |
| Wheat | 0.98 | 61 |
| Maize | 0.84 | 15 |
| Soybeans | 3.20 | 7 |
| Vegetables | 0.19 | 270 |
| Fruits | 0.50 | 50 |
| Beef | 12.56 | 5 |
| Pork | 4.46 | 35 |
| Poultry | 2.39 | 11 |
| Milk | 1.00 | 17 |

### ["Systematic review of greenhouse gas emissions for different fresh food categories" by Stephen Clune, Enda Crossin, Karli Verghese](https://sci-hub.tw/https://doi.org/10.1016/j.jclepro.2016.04.082)

| Food | Mean $\frac{(kg) (CO2\ eq)}{kg}$ (2015?) |
|---|---|
| Rice | 2.66 |
| Wheat | 0.51 |
| Maize | 0.63 |
| Soybeans | 0.58 |
| Vegetables | 0.47 |
| Fruits | 0.50 |
| Beef | 28.73 |
| Pork | 5.85 |
| Chicken | 4.12 |
| Milk | 1.39 |
| Almond/coconut milk | 0.42 |

### ["The green, blue and grey water footprint of crops and derived crop products" by M. M. Mekonnen and A. Y. Hoekstra](https://waterfootprint.org/media/downloads/Mekonnen-Hoekstra-2011-WaterFootprintCrops.pdf)

| Food | Global average water footprint ($\frac{m^3}{ton}$) (1996-2005) | Global average water footprint ($\frac{m^3}{kg}$ (1996-2005)) |
|---|---|---|
| Almonds | 16095 | 17.74 |

### [How many ounces of almonds go into making each half-gallon of almond milk (example: Silk or Almond Breeze brand)?](https://www.quora.com/How-many-ounces-of-almonds-go-into-making-each-half-gallon-of-almond-milk-example-Silk-or-Almond-Breeze-brand)

As a conservative estimate of the almonds used in almond milk:

* Around 2 cups of almonds for a half gallon.
* Around [225 g per cup of ground almonds](http://www.veg-world.com/articles/cups.htm).
* 2 cups almonds = 450 g almonds.
* 1 gallon = 3.79 kg (water).
* 1/2 gallon = 1.90 kg
* 450 g almonds per 1.90 kg of almond milk
* .237 kg of almonds per 1 kg of almond milk

As a potentially more realistic estimate of the number of almonds used in almond milk:

* If almond milk has 2% of almonds, by weight, then for every litre of almond milk, there are approximately 20g of almonds
* .02 kg of almonds per 1kg of almond milk



### ["Almond milk: quite good for you – very bad for the planet" by Emine Saner](https://www.theguardian.com/lifeandstyle/shortcuts/2015/oct/21/almond-milk-quite-good-for-you-very-bad-for-the-planet)

### ["Your Almond Habit Is Sucking California Dry" by Tom Philpott](https://www.motherjones.com/food/2014/07/your-almond-habit-sucking-califoirnia-dry/)

### ["Lay Off the Almond Milk, You Ignorant Hipsters" by Tom Philpott](https://www.motherjones.com/food/2014/07/lay-off-almond-milk-ignorant-hipsters/)

### ["Almond Milk is Taking a Toll on the Environment"](https://sustainability.ucsf.edu/1.713)

###### 2019-04-02
