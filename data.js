/* Curated cost evidence, checked 2026-10-29. Values retain their published date and basis. */
const REAGENTS = [
  {
    "id": "h2-grey",
    "name": "Hydrogen · grey, production cost",
    "price": 1.5,
    "mass": 2,
    "n": 2,
    "type": "Reducing agent",
    "note": "H₂ → 2 H⁺ + 2 e⁻. Rounded workbook molar mass retained (2 g/mol).",
    "reference": "IRENA (2021), Green hydrogen supply, p. 16",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2021/May/IRENA_Green_Hydrogen_Supply_2021#page=16",
    "reported": "1–2 USD/kg",
    "period": "2021 report; 2020 cost context",
    "region": "Global indicative range",
    "basis": "Production cost",
    "conversion": "(1 + 2) / 2 = 1.5 USD/kg; illustrative midpoint, not a reported mean.",
    "references": [
      {
        "label": "IRENA (2021), Green hydrogen supply, p. 16",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2021/May/IRENA_Green_Hydrogen_Supply_2021#page=16"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "h2-green",
    "name": "Hydrogen · green, production cost",
    "price": 5,
    "mass": 2,
    "n": 2,
    "type": "Reducing agent",
    "note": "H₂ → 2 H⁺ + 2 e⁻. Rounded workbook molar mass retained (2 g/mol).",
    "reference": "IRENA (2021), Green hydrogen supply, p. 16",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2021/May/IRENA_Green_Hydrogen_Supply_2021#page=16",
    "reported": "4–6 USD/kg",
    "period": "2021 report; 2020 cost context",
    "region": "Global indicative range",
    "basis": "Production cost",
    "conversion": "(4 + 6) / 2 = 5 USD/kg; illustrative midpoint, not a reported mean.",
    "references": [
      {
        "label": "IRENA (2021), Green hydrogen supply, p. 16",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2021/May/IRENA_Green_Hydrogen_Supply_2021#page=16"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "o2",
    "name": "Oxygen · literature cost assumption",
    "price": 0.1,
    "mass": 31.9988,
    "n": 4,
    "type": "Oxidizing agent",
    "note": "O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O. A peroxide pathway uses 2 e⁻ instead.",
    "reference": "Cooper et al. (2025), Technoeconomic analysis of low-emission steelmaking using hydrogen thermal plasma, Table 1",
    "source": "https://doi.org/10.1016/j.jclepro.2025.144896",
    "reported": "0.10 USD/kg",
    "period": "2023 USD; paper published 2025",
    "region": "Australian steelmaking study",
    "basis": "Study input assumption",
    "conversion": "Used directly. Paper attributes this commodity input to Cavaliere et al. (2022); it is not an observed supplier quotation.",
    "references": [
      {
        "label": "Cooper et al. (2025), Technoeconomic analysis of low-emission steelmaking using hydrogen thermal plasma, Table 1",
        "url": "https://doi.org/10.1016/j.jclepro.2025.144896"
      }
    ],
    "checked": "2026-10-29",
    "legacyMass": 16
  },
  {
    "id": "bh4-lab",
    "name": "Sodium borohydride · laboratory catalogue",
    "price": 530,
    "mass": 37.83,
    "n": 8,
    "type": "Reducing agent",
    "note": "NaBH₄ mass basis; 8 electron equivalents assumes complete utilization. Adjust utilization for purity and reaction yield.",
    "reference": "Thermo Scientific Chemicals, catalogue 035788.36",
    "source": "https://www.thermofisher.com/order/catalog/product/035788.36",
    "reported": "265 USD / 500 g",
    "period": "Catalogue accessed 2026-10-29",
    "region": "US catalogue; 97+%, granular",
    "basis": "Supplier catalogue price",
    "conversion": "265 / 0.5 = 530 USD/kg. Package price; purity losses are not automatically corrected.",
    "references": [
      {
        "label": "Thermo Scientific Chemicals, catalogue 035788.36",
        "url": "https://www.thermofisher.com/order/catalog/product/035788.36"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "li",
    "name": "Lithium · laboratory catalogue",
    "price": 4060,
    "mass": 6.94,
    "n": 1,
    "type": "Reducing agent",
    "note": "Li → Li⁺ + e⁻. Package price; adjust utilization for purity.",
    "reference": "Fisher Scientific, catalogue AC211440250",
    "source": "https://www.fishersci.com/shop/products/lithium-99-granular-dry-thermo-scientific/AC211440250",
    "reported": "101.50 USD / 25 g (list price)",
    "period": "Catalogue accessed 2026-10-29",
    "region": "US catalogue; 99+%, granular, dry",
    "basis": "Supplier catalogue price",
    "conversion": "101.50 / 0.025 = 4060 USD/kg. Uses the list price, not the temporary promotional price.",
    "references": [
      {
        "label": "Fisher Scientific, catalogue AC211440250",
        "url": "https://www.fishersci.com/shop/products/lithium-99-granular-dry-thermo-scientific/AC211440250"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "nh3-green",
    "name": "Ammonia · renewable, production cost",
    "price": 1.06,
    "mass": 17.03,
    "n": 3,
    "type": "Reducing agent",
    "note": "2 NH₃ → N₂ + 6 H⁺ + 6 e⁻: 3 e⁻ per NH₃.",
    "reference": "IRENA & AEA (2022), Innovation Outlook: Renewable Ammonia, executive summary and Table 14",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2022/May/IRENA_Innovation_Outlook_Ammonia_2022.pdf",
    "reported": "720–1400 USD/tonne",
    "period": "2020 estimate; 2022 report",
    "region": "Global indicative range",
    "basis": "Production cost",
    "conversion": "(720 + 1400) / 2 / 1000 = 1.06 USD/kg; illustrative midpoint.",
    "references": [
      {
        "label": "IRENA & AEA (2022), Innovation Outlook: Renewable Ammonia, executive summary and Table 14",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2022/May/IRENA_Innovation_Outlook_Ammonia_2022.pdf"
      }
    ],
    "checked": "2026-10-29",
    "legacyN": 6
  },
  {
    "id": "nh3-us",
    "name": "Ammonia · fossil, production cost",
    "price": 0.225,
    "mass": 17.03,
    "n": 3,
    "type": "Reducing agent",
    "note": "2 NH₃ → N₂ + 6 H⁺ + 6 e⁻: 3 e⁻ per NH₃.",
    "reference": "IRENA & AEA (2022), Innovation Outlook: Renewable Ammonia, executive summary and Table 14",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2022/May/IRENA_Innovation_Outlook_Ammonia_2022.pdf",
    "reported": "110–340 USD/tonne",
    "period": "2022 report; historical cost context",
    "region": "Global indicative range",
    "basis": "Production cost",
    "conversion": "(110 + 340) / 2 / 1000 = 0.225 USD/kg; illustrative midpoint. Replaces the unsupported USA-specific workbook quote.",
    "references": [
      {
        "label": "IRENA & AEA (2022), Innovation Outlook: Renewable Ammonia, executive summary and Table 14",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2022/May/IRENA_Innovation_Outlook_Ammonia_2022.pdf"
      }
    ],
    "checked": "2026-10-29",
    "legacyN": 6
  },
  {
    "id": "custom",
    "name": "Custom reagent",
    "type": "User-defined reaction",
    "price": 1,
    "mass": 100,
    "n": 2,
    "note": "Enter your purchase price, molar mass and reaction-specific electron equivalents. Starting values are unsourced placeholders."
  }
];
const ENERGY = [
  {
    "id": "eu",
    "name": "EU households · tariff",
    "tariff": 0.31075040000000004,
    "reference": "Eurostat (6 May 2025), Household electricity prices in the EU stable in 2024",
    "source": "https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250506-2",
    "reported": "28.72 EUR / 100 kWh",
    "period": "2024 H2",
    "region": "European Union households, including taxes",
    "basis": "Delivered tariff",
    "conversion": "28.72 / 100 × 1.0820 = 0.3107504 USD/kWh. FX: 2024 annual average USD/EUR (approximate conversion).",
    "references": [
      {
        "label": "Eurostat (6 May 2025), Household electricity prices in the EU stable in 2024",
        "url": "https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250506-2"
      },
      {
        "label": "Federal Reserve G.5A, 2024 annual average, EMU members",
        "url": "https://www.federalreserve.gov/releases/g5a/20250106/"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "us",
    "name": "US all sectors · tariff",
    "tariff": 0.1356,
    "reference": "EIA Electric Power Annual, Table 2.4, total electric industry",
    "source": "https://www.eia.gov/electricity/Annual/table.php?t=epa_02_04.html",
    "reported": "13.56 US cents/kWh",
    "period": "2025; release 2026-10-21",
    "region": "United States, all sectors",
    "basis": "Delivered tariff",
    "conversion": "13.56 / 100 = 0.1356 USD/kWh. National annual average.",
    "references": [
      {
        "label": "EIA Electric Power Annual, Table 2.4, total electric industry",
        "url": "https://www.eia.gov/electricity/Annual/table.php?t=epa_02_04.html"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "us-industry",
    "name": "US industry · tariff",
    "tariff": 0.0851,
    "reference": "EIA Electric Power Annual, Table 2.4, total electric industry",
    "source": "https://www.eia.gov/electricity/Annual/table.php?t=epa_02_04.html",
    "reported": "8.51 US cents/kWh",
    "period": "2025; release 2026-10-21",
    "region": "United States, industrial sector",
    "basis": "Delivered tariff",
    "conversion": "8.51 / 100 = 0.0851 USD/kWh. National annual average.",
    "references": [
      {
        "label": "EIA Electric Power Annual, Table 2.4, total electric industry",
        "url": "https://www.eia.gov/electricity/Annual/table.php?t=epa_02_04.html"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "solar",
    "name": "Solar PV · global LCOE",
    "tariff": 0.043,
    "reference": "IRENA (2025), Renewable power generation costs in 2024, executive summary",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf",
    "reported": "0.043 USD/kWh",
    "period": "2024 (2024 USD); report 2025",
    "region": "Global; newly commissioned utility-scale solar",
    "basis": "Generation cost (LCOE)",
    "conversion": "Used directly: capacity-weighted global mean, without a delivered-tariff markup.",
    "references": [
      {
        "label": "IRENA (2025), Renewable power generation costs in 2024, executive summary",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "wind",
    "name": "Onshore wind · global LCOE",
    "tariff": 0.034,
    "reference": "IRENA (2025), Renewable power generation costs in 2024, executive summary",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf",
    "reported": "0.034 USD/kWh",
    "period": "2024 (2024 USD); report 2025",
    "region": "Global; newly commissioned onshore wind",
    "basis": "Generation cost (LCOE)",
    "conversion": "Used directly: capacity-weighted global mean, without a delivered-tariff markup.",
    "references": [
      {
        "label": "IRENA (2025), Renewable power generation costs in 2024, executive summary",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "gas",
    "name": "Gas combined cycle · US LCOE",
    "tariff": 0.0785,
    "reference": "Lazard (June 2025), Levelized Cost of Energy+ v18, p. 8, unsubsidized comparison",
    "source": "https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf#page=8",
    "reported": "48–109 USD/MWh",
    "period": "2025",
    "region": "United States; new build",
    "basis": "Generation cost (LCOE)",
    "conversion": "(48 + 109) / 2 / 1000 = 0.0785 USD/kWh; illustrative midpoint, not a reported mean.",
    "references": [
      {
        "label": "Lazard (June 2025), Levelized Cost of Energy+ v18, p. 8, unsubsidized comparison",
        "url": "https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf#page=8"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "coal",
    "name": "Coal · US LCOE",
    "tariff": 0.122,
    "reference": "Lazard (June 2025), Levelized Cost of Energy+ v18, p. 8, unsubsidized comparison",
    "source": "https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf#page=8",
    "reported": "71–173 USD/MWh",
    "period": "2025",
    "region": "United States; new build",
    "basis": "Generation cost (LCOE)",
    "conversion": "(71 + 173) / 2 / 1000 = 0.122 USD/kWh; illustrative midpoint, not a reported mean.",
    "references": [
      {
        "label": "Lazard (June 2025), Levelized Cost of Energy+ v18, p. 8, unsubsidized comparison",
        "url": "https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf#page=8"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "nuclear-new",
    "name": "New nuclear · US LCOE",
    "tariff": 0.1805,
    "reference": "Lazard (June 2025), Levelized Cost of Energy+ v18, p. 8, unsubsidized comparison",
    "source": "https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf#page=8",
    "reported": "141–220 USD/MWh",
    "period": "2025",
    "region": "United States; new build",
    "basis": "Generation cost (LCOE)",
    "conversion": "(141 + 220) / 2 / 1000 = 0.1805 USD/kWh; illustrative midpoint, not a reported mean.",
    "references": [
      {
        "label": "Lazard (June 2025), Levelized Cost of Energy+ v18, p. 8, unsubsidized comparison",
        "url": "https://www.lazard.com/media/uounhon4/lazards-lcoeplus-june-2025.pdf#page=8"
      }
    ],
    "checked": "2026-10-29"
  },
  {
    "id": "custom",
    "name": "Custom electricity tariff",
    "tariff": 0.1
  }
];
