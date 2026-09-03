#!/usr/bin/python3

import matplotlib.pyplot as plt
import matplotlib.colors as colors
import numpy as np

# Generate coordinate ranges
#tau = np.linspace(0.01, 100, 1000)
tau = np.logspace(-0.5, -0.125, 1000)
#c = np.linspace(0.01, 10, 500)
c = np.logspace(0.5, 4, 1000)

# Create coordinate matrices
TAU, C = np.meshgrid(tau, c)

# Evaluate an example function z = f(x,y)
Z = (np.log(TAU) + np.log(C)) / TAU

fig, ax = plt.subplots(figsize=(6, 5))

# Plot the matrix grid mapping Z intensity to a LogNorm color scale
#im = ax.pcolormesh(TAU, C, Z, cmap='viridis', norm=colors.LogNorm(), shading='auto')
im = ax.pcolormesh(TAU, C, Z, cmap='viridis', shading='auto')

# Transform the physical axes into log scale
ax.set_xscale('log')
ax.set_yscale('log')

# Labeling and colorbar setup
fig.colorbar(im, label='$\\frac{\\ln \\tau  + \\ln C}{\\tau}$')
ax.set_xlabel('$\\tau$ ')
ax.set_ylabel('C')
plt.show()

## Create the figure
#plt.figure(figsize=(5, 5))
#
## Plot as an image array
##plt.imshow(Z, extent=[-5, 5, -5, 5], origin='lower', cmap='magma', interpolation='bilinear')
#plt.imshow(Z, extent=[0.01, 10, 1, 10], origin='lower', cmap='viridis',
#           norm=colors.LogNorm(vmin=0.1, vmax=5.0), interpolation='bilinear')
#
#
## Include a reference color bar key
#plt.colorbar(label='...')
#plt.title('...')
#plt.show()
