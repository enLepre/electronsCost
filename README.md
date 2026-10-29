# Electron Cost

A small, dependency-free HTML tool comparing chemical reagent costs with electrical energy costs per mole of useful electron equivalents. Visual styling follows enLepre's personal website and CitationNetwork: Georgia, warm paper, ink, fine rules, and restrained teal/plum chart accents.

Open `index.html` directly for offline calculations, or serve this directory over HTTP. No build, account or API keys are required. The Assumptions page loads pinned KaTeX 0.19.1 scripts, styles and fonts from jsDelivr for LaTeX-style typesetting; scripts and styles use integrity checks. Readable equation fallbacks remain if that service is unavailable. The calculator itself has no external dependencies. Shared links work for anyone who can access the same hosted page. The URL fragment stores the scenario; inputs are not uploaded. CSV export includes the complete input basis and outputs.

## Features

The website has four pages, linked by the top navigation:

- **Compare:** a centered question, two initially empty source selectors, one price per selected source, and a voltage slider linked to the graph. Reagent prices and graph values are shown in USD per individual electron equivalent (per-mole costs divided by the exact Avogadro constant, 6.02214076 × 10²³ mol⁻¹). Electricity source prices are shown in USD/kWh. The graph marker can also be dragged directly.
- **Details:** editable assumptions, efficiencies, plot range, full numerical results, electricity rankings, share links and CSV export. Choosing a custom source opens this editor.
- **Assumptions:** equations, chemistry basis, original workbook notes, limitations and reference links.
- The derivation uses LaTeX syntax, defines symbols at first use, and ends with a compact Symbol–Quantity–Unit reference table.
- **Sources:** searchable evidence table with category/status filters, original reported values, units, periods, regions, cost basis, linked references and explicit conversions. Reads directly from calculator data.

The GitHub repository link sits in the footer of every page. A moon/sun icon toggles the theme, with an accessible action label and a saved preference.

Valid scenarios carry between pages via URL fragments and tab-local session storage. A new tab without a shared scenario starts with empty selectors. The slider uses the voltage range from Details (5 V initially), extended if needed to include the selected voltage.

- Seven referenced reagent scenarios and eight referenced electricity scenarios, plus custom inputs. Nine unsupported workbook entries are listed as unavailable and excluded from new selections.
- Editable full cell voltage, mass price, molar mass, electron equivalents, reagent utilization, Faradaic efficiency, and power supply efficiency.
- Live winner, relative cost, break-even voltage, voltage plot, source ranking, and batch totals.
- Scenario sharing, CSV download, responsive layout, keyboard controls, and light/dark themes.

## Calculation basis

`C_chemical = price_USD_per_kg * molar_mass_g_per_mol / (1000 * electron_equivalents * utilization)`

`C_electrical = tariff_USD_per_kWh * F * full_cell_voltage / (3600000 * faradaic_efficiency * power_supply_efficiency)`

Efficiencies are fractions in these equations. F = 96485.33212 C/mol. The break-even voltage sets these two costs equal. Use actual operating cell voltage, not mains voltage or a single electrode potential versus a reference. Zero tariff has no unique crossing. Zero reagent cost makes the electrical/chemical ratio undefined. Negative prices and voltages are outside this simple consumption model.

This does not assess reaction feasibility, kinetics, paired electrode reactions, or full process economics. Reagents are comparable only for a defined transformation and useful electron basis. Extra reagents, capital costs, separation, waste, and labor are excluded. Efficiencies are assumed constant over the voltage plot.

## Workbook provenance

Prices were replaced on 2026-10-29 with dated IRENA, EIA, Eurostat, Lazard, research-paper and supplier-catalogue evidence. `data.js` contains reported values, normalization, price basis, dates and direct references. Published ranges use an explicitly derived arithmetic midpoint, not a claimed observed mean. Production costs, LCOE, delivered tariffs and catalogue prices are distinct; no inflation harmonization is applied. EU currency conversion uses the Federal Reserve 2024 annual USD/EUR average. Supplier prices are snapshots, not literature findings or live quotes.

Unsupported workbook costs are not used in new calculations. Old shared scenarios retain explicit inputs; retired IDs become custom. Existing saved or edited numbers are not automatically replaced. Select a preset again to load its new default. The workbook remains only the historical origin of the interface and rounded chemistry inputs.

Corrections are explicit in the interface:

- O₂ molar mass: 31.9988 g/mol, replacing 16 g/mol with the four-electron water pathway. [NIST molecular data](https://webbook.nist.gov/cgi/cbook.cgi?ID=C7782447).
- NH₃ to N₂: 3 e⁻ per NH₃ (2 NH₃ → N₂ + 6 H⁺ + 6 e⁻), replacing the workbook's 6 per molecule. Other nitrogen products require their own stoichiometry.
- Borohydride is labelled sodium borohydride because the workbook's 37.83 g/mol corresponds to NaBH₄. Eight equivalents is an ideal complete-utilization basis.
- Adiponitrile is excluded from new presets because its reaction and price are unverified.
- “Original workbook chemistry” restores oxygen/ammonia inputs. It does not reproduce lookup errors, drifting kWh conversions, or the rounded Faraday constant.
- Every kWh is exactly 3,600,000 J; [NIST constants](https://physics.nist.gov/cuu/Constants/) provide the Faraday basis.

Selecting another reagent or switching chemistry mode reloads that preset's price, molar mass, and electron count. Efficiencies stay unchanged. Ranking uses referenced default costs; an edited tariff is used in the main comparison.

## Verification

Run `node --test model.test.cjs interface.test.cjs`. Tests cover independently calculated hydrogen costs, break-even inversion, efficiency and scale factors, zero-price cases, invalid inputs, and oxygen/ammonia corrections. A DOM-free interaction harness checks the empty initial state, source selection, slider updates, scenario persistence, shared custom inputs, invalid links and multi-page deployment assets.

The interface passes the numerical and interaction-state checks, including source coverage and theme switching. Browser preview was blocked by the development environment's security policy, so visual layout, direct graph dragging and clipboard/download behaviour have not been verified in a browser. The interaction harness does not replace browser rendering checks.

## GitHub Pages

The included GitHub Actions workflow tests and deploys the static site on pushes to `main`. In repository **Settings → Pages**, select **GitHub Actions** as the source. Expected project URL after successful deployment: `https://enlepre.github.io/electronsCost/`.

All assets use relative paths, so the application works under the repository subpath. To preview locally, run any static file server from this directory.
