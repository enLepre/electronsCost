# Electron Cost

A small, dependency-free HTML tool comparing chemical reagent costs with electrical energy costs per mole of useful electron equivalents. Visual styling follows enLepre's personal website and CitationNetwork: Source Serif 4 (with a Georgia fallback), warm paper, ink, fine rules, and restrained teal/plum chart accents.

Open `index.html` directly for offline calculations, or serve this directory over HTTP. No build, account or API keys are required. The Assumptions page loads pinned KaTeX 0.19.1 scripts, styles and fonts from jsDelivr for LaTeX-style typesetting; scripts and styles use integrity checks. Readable equation fallbacks remain if that service is unavailable. The calculator logic has no external dependencies; Source Serif 4 loads from Google Fonts, with a local serif fallback when offline. Shared links work for anyone who can access the same hosted page. The URL fragment stores the scenario; inputs are not uploaded. CSV export includes the complete input basis and outputs.

## Features

The website has four pages, linked by the top navigation:

- **Compare:** starts with green hydrogen versus solar PV, with both headline costs in USD per mole of useful electron equivalents and the electricity tariff underneath. Shows a numerical cost ratio, labelled break-even voltage, visible source labels, price-basis caveat, and an editable maximum voltage beside the slider. The shared responsive chart uses round mUSD ticks and direct line labels. Selectors stack below 600 px. The graph marker can also be dragged directly.
- **Details:** two equal input columns for reagent and electricity, followed by full-width results and the final electricity comparison table; editable assumptions, efficiencies, plot range, full numerical results, electricity rankings, share links and CSV export. Choosing a custom source opens this editor.
- **Assumptions:** equations, chemistry basis, original workbook notes, limitations and reference links.
- The derivation uses LaTeX syntax, defines symbols at first use, and ends with a compact Symbol–Quantity–Unit reference table.
- **Sources:** searchable evidence table with category filters, original reported values, units, periods, regions, cost basis, linked references and explicit conversions. Reads directly from calculator data.

The GitHub repository link sits in the footer of every page. A moon/sun icon toggles the theme, with an accessible action label and a saved preference.

Valid scenarios carry between pages via URL fragments and tab-local session storage. A new Compare tab without a shared scenario starts with green H₂ and solar PV at 1 V. A direct Details load starts with grey H₂ and EU household tariff presets. Valid saved or shared scenarios take precedence. The slider starts with a 5 V maximum; reducing max V clamps the selected voltage to the new range.

- Fourteen referenced reagent scenarios and twenty-three referenced electricity scenarios, plus custom inputs. Unsupported workbook entries are removed from the public dataset.
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

Unsupported workbook records are removed from the public dataset. Old shared scenarios retain explicit inputs; retired IDs become custom. Existing saved or edited numbers are not automatically replaced. Select a preset again to load its new default. The workbook remains only the historical origin of the interface and rounded chemistry inputs.

Corrections are explicit in the interface:

- O₂ molar mass: 31.9988 g/mol, replacing 16 g/mol with the four-electron water pathway. [NIST molecular data](https://webbook.nist.gov/cgi/cbook.cgi?ID=C7782447).
- NH₃ to N₂: 3 e⁻ per NH₃ (2 NH₃ → N₂ + 6 H⁺ + 6 e⁻), replacing the workbook's 6 per molecule. Other nitrogen products require their own stoichiometry.
- Borohydride is labelled sodium borohydride because the workbook's 37.83 g/mol corresponds to NaBH₄. Eight equivalents is an ideal complete-utilization basis.
- Adiponitrile is excluded from new presets because its reaction and price are unverified.
- “Original workbook chemistry” restores oxygen/ammonia inputs. It does not reproduce lookup errors, drifting kWh conversions, or the rounded Faraday constant.
- Every kWh is exactly 3,600,000 J; [NIST constants](https://physics.nist.gov/cuu/Constants/) provide the Faraday basis.

Selecting another reagent or switching chemistry mode reloads that preset's price, molar mass, and electron count. Efficiencies stay unchanged. Ranking uses referenced default costs; an edited tariff is used in the main comparison.

## Verification

Run `node --test model.test.cjs interface.test.cjs`. Tests cover independently calculated hydrogen costs, break-even inversion, efficiency and scale factors, zero-price cases, invalid inputs, and oxygen/ammonia corrections. A DOM-free interaction harness checks the populated initial state and direct Details initialization (including form named-property collisions), matching units, max-voltage edits and zero-cost verdicts,, source selection, slider updates, scenario persistence, shared custom inputs, invalid links and multi-page deployment assets.

All 20 numerical and interaction tests pass. Browser QA checked direct Details loading, populated results and rankings, Compare at desktop and 390 px iframe width, readable chart labels, dark mode, and max-voltage editing. Clipboard/download behaviour and physical mobile devices were not tested.

## GitHub Pages

The included GitHub Actions workflow tests and deploys the static site on pushes to `main`. In repository **Settings → Pages**, select **GitHub Actions** as the source. Expected project URL after successful deployment: `https://enlepre.github.io/electronsCost/`.

All assets use relative paths, so the application works under the repository subpath. To preview locally, run any static file server from this directory.

## Electricity catalogue additions (16 November 2026)

Added hydropower (0.057 USD/kWh), geothermal (0.060), offshore wind (0.079), bioenergy (0.087), and concentrated solar power (0.092). These are global weighted-average LCOEs from IRENA’s 2024 dataset, executive-summary Table S1, matching the existing solar PV and onshore-wind basis. They are dated benchmarks, not current electricity offers. Compare, Details, rankings, sharing and Sources use the same records. Existing preset IDs and saved custom values remain unchanged.

## VALCOE additions (16 November 2026)

Five separate EU 2030 Stated Policies Scenario VALCOE presets use IEA World Energy Outlook 2021, Table B.4a (p. 333): solar PV 0.070, onshore wind 0.060, offshore wind 0.050, gas combined cycle 0.115 and coal 0.165 USD/kWh. Matching scenario LCOEs appear on Assumptions and in each source record. These historical model indicators are not electricity tariffs or adjustments to the 2024 global LCOEs. No verified VALCOE is supplied for hydro, geothermal, bioenergy or CSP. Nuclear choices retain their existing separate provenance.

## Electricity metric control

Compare and Details have a Use VALCOE checkbox beside Electricity. Unchecked shows the LCOE presets and separately labelled delivered grid tariffs; checked shows only verified VALCOE sources plus custom input. The rankings follow the selected metric. Source names omit metric labels, while Sources retains each record’s cost basis. Switching reloads the corresponding preset price; unsupported VALCOE sources switch to Solar PV with an explicit notice. Shared links preserve the selected source, metric and edited tariff. Existing nuclear lifetime-extension IDs remain valid.

## EU and China industrial tariffs (16 November 2026)

Added EU large industry (approximately 0.11 USD/kWh) and China large industry (approximately 0.07 USD/kWh), using the 2025 bars in IEA Electricity 2026, p. 114. These are visual estimates rounded to 10 USD/MWh, not exact tabulated values. The report labels 2025 data preliminary. The EU series concerns energy-intensive users above 150 GWh/year and assumes eligible EU-ETS price compensation; the China estimate is indicative and varies by location and consumption. Both are delivered-price estimates, not LCOE or VALCOE, and appear with the grid tariffs only when Use VALCOE is unchecked.

Compare includes a Start over button above the voltage controls. It removes the saved comparison and reloads the current page without query parameters or a scenario fragment, restoring the initial selections. The price-basis sentence beneath the selectors has been removed; source details remain on Sources and Assumptions.

## Link preview

All four pages include Open Graph and large-image Twitter metadata pointing to the committed 1200 × 630 PNG. The preview uses the same Libre Baskerville font, cream background, centred layout and rendering function as the personal blog notes, with the Compare page title and subtitle. The image filename contains a content hash to distinguish future revisions. Regenerate the image and update the metadata when changing that wording.
