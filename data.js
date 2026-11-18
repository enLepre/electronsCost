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
    "id": "zn",
    "name": "Zinc · bulk metal benchmark",
    "price": 2.7778245035294575,
    "mass": 65.38,
    "n": 2,
    "type": "Reducing agent",
    "note": "Zn → Zn²⁺ + 2 e⁻.",
    "reference": "USGS (2025), Mineral Commodity Summaries — Zinc",
    "source": "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025_ver.1.0.pdf",
    "reported": "126 US cents/lb",
    "period": "2024 annual average; report 2025",
    "region": "London Metal Exchange cash benchmark",
    "basis": "Commodity metal price",
    "conversion": "1.26 / 0.45359237 = 2.7778 USD/kg. Refined metal benchmark, not a zinc powder quotation; particle preparation may add cost.",
    "references": [
      {
        "label": "USGS (2025), Mineral Commodity Summaries — Zinc",
        "url": "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025_ver.1.0.pdf"
      }
    ],
    "checked": "2026-11-14"
  },
  {
    "id": "fe",
    "name": "Iron powder · bulk supplier offer",
    "price": 1.314,
    "mass": 55.845,
    "n": 2,
    "type": "Reducing agent",
    "note": "Fe → Fe²⁺ + 2 e⁻. Assumes approximately pure Fe; adjust utilization for actual assay.",
    "reference": "Zhonghe, atomized iron powder supplier listing",
    "source": "https://www.made-in-china.com/video-channel/zhonghekuangye_VTmRsWUAIprM_Premium-Atomized-Iron-Powder-CAS-7439-89-6-for-Industrial-Applications.html",
    "reported": "1,287–1,341 USD/tonne",
    "period": "Undated offer; accessed 2026-11-14",
    "region": "China supplier; minimum 1 tonne",
    "basis": "Indicative supplier offer",
    "conversion": "(1287 + 1341) / 2 / 1000 = 1.314 USD/kg; illustrative midpoint, not a reported mean. Approximately pure Fe assumed; assay is unverified. Not an observed transaction average.",
    "references": [
      {
        "label": "Zhonghe, atomized iron powder supplier listing",
        "url": "https://www.made-in-china.com/video-channel/zhonghekuangye_VTmRsWUAIprM_Premium-Atomized-Iron-Powder-CAS-7439-89-6-for-Industrial-Applications.html"
      }
    ],
    "checked": "2026-11-14"
  },
  {
    "id": "formic-acid",
    "name": "Formic acid · bulk, active basis",
    "price": 0.4117647058823529,
    "mass": 46.025,
    "n": 2,
    "type": "Reducing agent",
    "note": "HCOOH → CO₂ + 2 H⁺ + 2 e⁻. Price already corrected from 85 wt% solution to active acid.",
    "reference": "Tradeasia, China Formic Acid Price Index 2026",
    "source": "https://www.chemtradeasia.com/market-insights/china-formic-acid-price-index-2026-drivers",
    "reported": "340–360 USD/tonne of 85% solution",
    "period": "Q1 2026",
    "region": "China, ex-works",
    "basis": "Bulk market benchmark (active basis)",
    "conversion": "(340 + 360) / 2 / 1000 / 0.85 = 0.411765 USD/kg active HCOOH. Illustrative midpoint of the distributor's market-summary range. Do not apply the 85% concentration correction again through utilization.",
    "references": [
      {
        "label": "Tradeasia, China Formic Acid Price Index 2026",
        "url": "https://www.chemtradeasia.com/market-insights/china-formic-acid-price-index-2026-drivers"
      }
    ],
    "checked": "2026-11-14"
  },
  {
    "id": "isopropanol",
    "name": "Isopropanol · bulk market benchmark",
    "price": 1.461,
    "mass": 60.096,
    "n": 2,
    "type": "Reducing agent",
    "note": "(CH₃)₂CHOH → (CH₃)₂CO + 2 H⁺ + 2 e⁻. Approximately pure IPA assumed; actual assay is not specified.",
    "reference": "IMARC, Isopropyl Alcohol pricing report — March 2026, France",
    "source": "https://www.imarcgroup.com/isopropyl-alcohol-pricing-report",
    "reported": "1,461 USD/tonne",
    "period": "March 2026",
    "region": "France",
    "basis": "Bulk market benchmark",
    "conversion": "1461 / 1000 = 1.461 USD/kg. Public summary does not specify assay; approximately pure material assumed. Adjust utilization if the purchased product is diluted.",
    "references": [
      {
        "label": "IMARC, Isopropyl Alcohol pricing report — March 2026, France",
        "url": "https://www.imarcgroup.com/isopropyl-alcohol-pricing-report"
      }
    ],
    "checked": "2026-11-14"
  },
  {
    "id": "hydrogen-peroxide",
    "name": "Hydrogen peroxide · bulk, active basis",
    "price": 1.2341477437109445,
    "mass": 34.0147,
    "n": 2,
    "type": "Oxidizing agent",
    "note": "H₂O₂ + 2 H⁺ + 2 e⁻ → 2 H₂O. Price already corrected from 50 wt% solution to active peroxide.",
    "reference": "Miami-Dade County (2025), legislative item 250620, contract EVN0006686",
    "source": "https://www.miamidade.gov/govaction/matter.asp?file=true&matter=250620",
    "reported": "0.2799 USD/lb of 50 wt% solution",
    "period": "2025 procurement proposal",
    "region": "Miami-Dade County, USA; tanker delivery",
    "basis": "Negotiated procurement price (active basis)",
    "conversion": "0.2799 / 0.45359237 / 0.50 = 1.23414 USD/kg active H₂O₂. Negotiated price in the proposed contract. Do not apply the 50% concentration correction again through utilization.",
    "references": [
      {
        "label": "Miami-Dade County (2025), legislative item 250620, contract EVN0006686",
        "url": "https://www.miamidade.gov/govaction/matter.asp?file=true&matter=250620"
      }
    ],
    "checked": "2026-11-14"
  },
  {
    "id": "sodium-hypochlorite",
    "name": "Sodium hypochlorite · bulk, provisional",
    "price": 4.455701949774103,
    "mass": 74.442,
    "n": 2,
    "type": "Oxidizing agent",
    "note": "ClO⁻ + 2 H⁺ + 2 e⁻ → Cl⁻ + H₂O. Provisional: assumes 12.5 wt% NaOCl and density 1.20 kg/L.",
    "reference": "City of Grants Pass (13 March 2025), WTP bulk chemical bid results, HASA",
    "source": "https://grantspassoregon.gov/DocumentCenter/View/37464/Bid-Results---WTP-Bulk-Chemicals?bidId=",
    "reported": "2.53 USD/US gallon; nominal 12.5% bulk product",
    "period": "13 March 2025 bid",
    "region": "Grants Pass, Oregon, USA",
    "basis": "Bulk bid (provisional active basis)",
    "conversion": "2.53 / 3.785411784 / 1.20 / 0.125 = 4.45579 USD/kg active NaOCl. Provisional assumptions: density 1.20 kg/L and 12.5 wt% NaOCl. The bid summary does not resolve NaOCl mass fraction versus available-chlorine convention; verify before relying on this estimate. Concentration is already corrected.",
    "references": [
      {
        "label": "City of Grants Pass (13 March 2025), WTP bulk chemical bid results, HASA",
        "url": "https://grantspassoregon.gov/DocumentCenter/View/37464/Bid-Results---WTP-Bulk-Chemicals?bidId="
      }
    ],
    "checked": "2026-11-14"
  },
  {
    "id": "sodium-dithionite",
    "name": "Sodium dithionite · bulk supplier offer",
    "price": 1.0119949494949494,
    "mass": 174.107,
    "n": 2,
    "type": "Reducing agent",
    "note": "S₂O₄²⁻ + 2 H₂O → 2 SO₃²⁻ + 4 H⁺ + 2 e⁻. Uses the sulfite endpoint; price is on an active-dithionite basis.",
    "reference": "Jinhe, sodium hydrosulfite 88%/90% bulk supplier listing",
    "source": "https://www.jinhetec.com/sodium-hydrosulfite/68333865.html",
    "reported": "850–950 USD/tonne; 88–90% grades",
    "period": "Undated offer; accessed 2026-11-14",
    "region": "China supplier; minimum 22 tonnes",
    "basis": "Indicative supplier offer (active basis)",
    "conversion": "Active-cost envelope: 0.850 / 0.90 to 0.950 / 0.88 = 0.94444–1.07955 USD/kg. Preset is the envelope midpoint, 1.011995 USD/kg active Na₂S₂O₄, not a reported mean or a specific grade quotation. Do not correct concentration again through utilization.",
    "references": [
      {
        "label": "Jinhe, sodium hydrosulfite 88%/90% bulk supplier listing",
        "url": "https://www.jinhetec.com/sodium-hydrosulfite/68333865.html"
      }
    ],
    "checked": "2026-11-14"
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
    "id": "eu-industry",
    "name": "EU large industry · estimated tariff",
    "tariff": 0.11,
    "reported": "Approximately 110 USD/MWh (rounded chart reading)",
    "region": "European Union; energy-intensive industries, annual consumption above 150 GWh",
    "conversion": "Approximate visual reading of the 2025 bar, rounded to the nearest 10 USD/MWh: 110 / 1000 = 0.11 USD/kWh. Not an exact tabulated value. Includes EU-ETS electricity-price compensation where applicable, assuming an electricity-consumption benchmark of 0.8 and maximum eligible state aid. This large-industry estimate is not a general EU business tariff.",
    "reference": "IEA (2026), Electricity 2026, p. 114: estimated final electricity prices for large industrial customers",
    "source": "https://iea.blob.core.windows.net/assets/b73798cb-e452-42b9-9d8a-07542de7a041/Electricity_2026.pdf#page=114",
    "period": "2025 preliminary estimates; report 2026",
    "basis": "Estimated delivered industrial tariff",
    "references": [
      {
        "label": "IEA (2026), Electricity 2026, p. 114: estimated final electricity prices for large industrial customers",
        "url": "https://iea.blob.core.windows.net/assets/b73798cb-e452-42b9-9d8a-07542de7a041/Electricity_2026.pdf#page=114"
      },
      {
        "label": "IEA chart and methodological notes (updated 4 March 2026)",
        "url": "https://www.iea.org/data-and-statistics/charts/estimated-final-electricity-price-for-large-industrial-customers-in-energy-intensive-industries-2019-2025"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "china-industry",
    "name": "China large industry · estimated tariff",
    "tariff": 0.07,
    "reported": "Approximately 70 USD/MWh (rounded chart reading)",
    "region": "China; indicative large-industrial electricity prices",
    "conversion": "Approximate visual reading of the 2025 bar, rounded to the nearest 10 USD/MWh: 70 / 1000 = 0.07 USD/kWh. Not an exact tabulated value or a universal national tariff. IEA describes the estimate as indicative of reported prices; actual prices vary by province, consumption level and purchasing arrangements.",
    "reference": "IEA (2026), Electricity 2026, p. 114: estimated final electricity prices for large industrial customers",
    "source": "https://iea.blob.core.windows.net/assets/b73798cb-e452-42b9-9d8a-07542de7a041/Electricity_2026.pdf#page=114",
    "period": "2025 preliminary estimates; report 2026",
    "basis": "Estimated delivered industrial tariff",
    "references": [
      {
        "label": "IEA (2026), Electricity 2026, p. 114: estimated final electricity prices for large industrial customers",
        "url": "https://iea.blob.core.windows.net/assets/b73798cb-e452-42b9-9d8a-07542de7a041/Electricity_2026.pdf#page=114"
      },
      {
        "label": "IEA chart and methodological notes (updated 4 March 2026)",
        "url": "https://www.iea.org/data-and-statistics/charts/estimated-final-electricity-price-for-large-industrial-customers-in-energy-intensive-industries-2019-2025"
      }
    ],
    "checked": "2026-11-16"
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
    "id": "hydro",
    "name": "Hydropower · global LCOE",
    "tariff": 0.057,
    "reference": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4",
    "reported": "0.057 USD/kWh",
    "period": "2024 (2024 USD); report 2025",
    "region": "Global; newly commissioned hydropower",
    "basis": "Generation cost (LCOE)",
    "conversion": "Used directly: capacity-weighted global mean for projects commissioned in 2024, in 2024 USD. Same report and year as the solar PV and onshore wind presets. Generation cost only, not a delivered tariff; grid charges, taxes and additional storage or firming costs are not added.",
    "references": [
      {
        "label": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "geothermal",
    "name": "Geothermal · global LCOE",
    "tariff": 0.06,
    "reference": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4",
    "reported": "0.060 USD/kWh",
    "period": "2024 (2024 USD); report 2025",
    "region": "Global; newly commissioned geothermal",
    "basis": "Generation cost (LCOE)",
    "conversion": "Used directly: capacity-weighted global mean for projects commissioned in 2024, in 2024 USD. Same report and year as the solar PV and onshore wind presets. Generation cost only, not a delivered tariff; grid charges, taxes and additional storage or firming costs are not added.",
    "references": [
      {
        "label": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "wind-offshore",
    "name": "Offshore wind · global LCOE",
    "tariff": 0.079,
    "reference": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4",
    "reported": "0.079 USD/kWh",
    "period": "2024 (2024 USD); report 2025",
    "region": "Global; newly commissioned offshore wind",
    "basis": "Generation cost (LCOE)",
    "conversion": "Used directly: capacity-weighted global mean for projects commissioned in 2024, in 2024 USD. Same report and year as the solar PV and onshore wind presets. Generation cost only, not a delivered tariff; grid charges, taxes and additional storage or firming costs are not added.",
    "references": [
      {
        "label": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "bioenergy",
    "name": "Bioenergy · global LCOE",
    "tariff": 0.087,
    "reference": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4",
    "reported": "0.087 USD/kWh",
    "period": "2024 (2024 USD); report 2025",
    "region": "Global; newly commissioned bioenergy",
    "basis": "Generation cost (LCOE)",
    "conversion": "Used directly: capacity-weighted global mean for projects commissioned in 2024, in 2024 USD. Same report and year as the solar PV and onshore wind presets. Generation cost only, not a delivered tariff; grid charges, taxes and additional storage or firming costs are not added.",
    "references": [
      {
        "label": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "csp",
    "name": "Concentrated solar power (CSP) · global LCOE",
    "tariff": 0.092,
    "reference": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
    "source": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4",
    "reported": "0.092 USD/kWh",
    "period": "2024 (2024 USD); report 2025",
    "region": "Global; newly commissioned concentrated solar power (csp)",
    "basis": "Generation cost (LCOE)",
    "conversion": "Used directly: capacity-weighted global mean for projects commissioned in 2024, in 2024 USD. Same report and year as the solar PV and onshore wind presets. Generation cost only, not a delivered tariff; grid charges, taxes and additional storage or firming costs are not added.",
    "references": [
      {
        "label": "IRENA (2025), Renewable power generation costs in 2024, executive summary, Table S1 (p. 4)",
        "url": "https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf#page=4"
      }
    ],
    "checked": "2026-11-16"
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
    "name": "Nuclear new plant LCOE",
    "tariff": 0.104,
    "reference": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
    "source": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57",
    "reported": "≈104 USD/MWh (approximate chart reading)",
    "period": "2030 scenario (2020 USD); report 2022",
    "region": "European Union; new build",
    "basis": "Generation cost (LCOE)",
    "conversion": "104 / 1000 = 0.104 USD/kWh. Approximate reading from the EU chart on p. 57, not an exact tabulated value. Assumes 4,000 USD/kW new-build capital cost and 8% weighted average cost of capital (WACC). LCOE is a lifetime generation-cost benchmark, not a delivered electricity tariff. Alternative context only: Lazard (2025) reports 141–220 USD/MWh for US new nuclear (no paired VALCOE); this range is not used in this preset. No inflation adjustment from 2020 USD.",
    "references": [
      {
        "label": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
        "url": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57"
      },
      {
        "label": "Lazard (June 2025), LCOE+ v18, p. 8 — alternative US new-build benchmark",
        "url": "https://www.lazard.com/media/5tlbhyla/lazards-lcoeplus-june-2025-_vf.pdf#page=8"
      }
    ],
    "checked": "2026-11-13"
  },
  {
    "id": "nuclear-new-valcoe",
    "name": "Nuclear new plant VALCOE",
    "tariff": 0.109,
    "reference": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
    "source": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57",
    "reported": "≈109 USD/MWh (approximate chart reading)",
    "period": "2030 scenario (2020 USD); report 2022",
    "region": "European Union; new build",
    "basis": "System-value-adjusted cost (VALCOE; not a tariff)",
    "conversion": "109 / 1000 = 0.109 USD/kWh. Approximate reading from the EU chart on p. 57, not an exact tabulated value. Assumes 4,000 USD/kW new-build capital cost and 8% weighted average cost of capital (WACC). VALCOE adjusts LCOE for energy, capacity and flexibility value within the modelled power system; it is a competitiveness indicator, not a purchasable electricity tariff. Alternative context only: Lazard (2025) reports 141–220 USD/MWh for US new nuclear (no paired VALCOE); this range is not used in this preset. No inflation adjustment from 2020 USD.",
    "references": [
      {
        "label": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
        "url": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57"
      },
      {
        "label": "Lazard (June 2025), LCOE+ v18, p. 8 — alternative US new-build benchmark",
        "url": "https://www.lazard.com/media/5tlbhyla/lazards-lcoeplus-june-2025-_vf.pdf#page=8"
      }
    ],
    "checked": "2026-11-13"
  },
  {
    "id": "nuclear-old",
    "name": "Nuclear old plant LCOE",
    "tariff": 0.042,
    "reference": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
    "source": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57",
    "reported": "≈42 USD/MWh (approximate chart reading)",
    "period": "2030 scenario (2020 USD); report 2022",
    "region": "European Union; existing plant lifetime extension",
    "basis": "Generation cost (LCOE)",
    "conversion": "42 / 1000 = 0.042 USD/kWh. Approximate reading from the EU chart on p. 57, not an exact tabulated value. Assumes 1,100 USD/kW investment to extend an existing plant's lifetime and 8% weighted average cost of capital (WACC). Old plant includes refurbishment/lifetime-extension investment, not just ongoing operating costs. LCOE is a lifetime generation-cost benchmark, not a delivered electricity tariff. No inflation adjustment from 2020 USD.",
    "references": [
      {
        "label": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
        "url": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57"
      }
    ],
    "checked": "2026-11-13"
  },
  {
    "id": "nuclear-old-valcoe",
    "name": "Nuclear old plant VALCOE",
    "tariff": 0.047,
    "reference": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
    "source": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57",
    "reported": "≈47 USD/MWh (approximate chart reading)",
    "period": "2030 scenario (2020 USD); report 2022",
    "region": "European Union; existing plant lifetime extension",
    "basis": "System-value-adjusted cost (VALCOE; not a tariff)",
    "conversion": "47 / 1000 = 0.047 USD/kWh. Approximate reading from the EU chart on p. 57, not an exact tabulated value. Assumes 1,100 USD/kW investment to extend an existing plant's lifetime and 8% weighted average cost of capital (WACC). Old plant includes refurbishment/lifetime-extension investment, not just ongoing operating costs. VALCOE adjusts LCOE for energy, capacity and flexibility value within the modelled power system; it is a competitiveness indicator, not a purchasable electricity tariff. No inflation adjustment from 2020 USD.",
    "references": [
      {
        "label": "IEA (2022), Nuclear Power and Secure Energy Transitions, pp. 56–57, EU 2030 scenarios",
        "url": "https://iea.blob.core.windows.net/assets/0498c8b8-e17f-4346-9bde-dad2ad4458c4/NuclearPowerandSecureEnergyTransitions.pdf#page=57"
      }
    ],
    "checked": "2026-11-13"
  },
  {
    "id": "solar-eu2030-valcoe",
    "name": "Solar PV · EU 2030 VALCOE (IEA 2021)",
    "tariff": 0.07,
    "reference": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
    "source": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334",
    "reported": "70 USD/MWh (rounded table value)",
    "period": "2030 Stated Policies Scenario; report 2021",
    "region": "European Union; new build",
    "basis": "System-value-adjusted cost (VALCOE; not a tariff)",
    "conversion": "70 / 1000 = 0.070 USD/kWh. Matching LCOE in the same table: 40 USD/MWh. Historical IEA scenario, not a current quote or an adjustment to the global 2024 LCOE preset. No inflation harmonization. VALCOE reflects system energy, capacity and flexibility value; using it in the calculator is an illustrative cost-equivalent comparison, not a predicted electricity bill.",
    "references": [
      {
        "label": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
        "url": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "wind-eu2030-valcoe",
    "name": "Onshore wind · EU 2030 VALCOE (IEA 2021)",
    "tariff": 0.06,
    "reference": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
    "source": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334",
    "reported": "60 USD/MWh (rounded table value)",
    "period": "2030 Stated Policies Scenario; report 2021",
    "region": "European Union; new build",
    "basis": "System-value-adjusted cost (VALCOE; not a tariff)",
    "conversion": "60 / 1000 = 0.060 USD/kWh. Matching LCOE in the same table: 45 USD/MWh. Historical IEA scenario, not a current quote or an adjustment to the global 2024 LCOE preset. No inflation harmonization. VALCOE reflects system energy, capacity and flexibility value; using it in the calculator is an illustrative cost-equivalent comparison, not a predicted electricity bill.",
    "references": [
      {
        "label": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
        "url": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "wind-offshore-eu2030-valcoe",
    "name": "Offshore wind · EU 2030 VALCOE (IEA 2021)",
    "tariff": 0.05,
    "reference": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
    "source": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334",
    "reported": "50 USD/MWh (rounded table value)",
    "period": "2030 Stated Policies Scenario; report 2021",
    "region": "European Union; new build",
    "basis": "System-value-adjusted cost (VALCOE; not a tariff)",
    "conversion": "50 / 1000 = 0.050 USD/kWh. Matching LCOE in the same table: 45 USD/MWh. Historical IEA scenario, not a current quote or an adjustment to the global 2024 LCOE preset. No inflation harmonization. VALCOE reflects system energy, capacity and flexibility value; using it in the calculator is an illustrative cost-equivalent comparison, not a predicted electricity bill.",
    "references": [
      {
        "label": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
        "url": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "gas-eu2030-valcoe",
    "name": "Gas combined cycle · EU 2030 VALCOE (IEA 2021)",
    "tariff": 0.115,
    "reference": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
    "source": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334",
    "reported": "115 USD/MWh (rounded table value)",
    "period": "2030 Stated Policies Scenario; report 2021",
    "region": "European Union; new build",
    "basis": "System-value-adjusted cost (VALCOE; not a tariff)",
    "conversion": "115 / 1000 = 0.115 USD/kWh. Matching LCOE in the same table: 140 USD/MWh. Historical IEA scenario, not a current quote or an adjustment to the global 2024 LCOE preset. No inflation harmonization. VALCOE reflects system energy, capacity and flexibility value; using it in the calculator is an illustrative cost-equivalent comparison, not a predicted electricity bill.",
    "references": [
      {
        "label": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
        "url": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "coal-eu2030-valcoe",
    "name": "Coal · EU 2030 VALCOE (IEA 2021)",
    "tariff": 0.165,
    "reference": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
    "source": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334",
    "reported": "165 USD/MWh (rounded table value)",
    "period": "2030 Stated Policies Scenario; report 2021",
    "region": "European Union; new build",
    "basis": "System-value-adjusted cost (VALCOE; not a tariff)",
    "conversion": "165 / 1000 = 0.165 USD/kWh. Matching LCOE in the same table: 185 USD/MWh. Historical IEA scenario, not a current quote or an adjustment to the global 2024 LCOE preset. No inflation harmonization. VALCOE reflects system energy, capacity and flexibility value; using it in the calculator is an illustrative cost-equivalent comparison, not a predicted electricity bill.",
    "references": [
      {
        "label": "IEA (2021), World Energy Outlook 2021, Table B.4a, p. 333",
        "url": "https://iea.blob.core.windows.net/assets/4ed140c1-c3f3-4fd9-acae-789a4e14a23c/WorldEnergyOutlook2021.pdf#page=334"
      }
    ],
    "checked": "2026-11-16"
  },
  {
    "id": "custom",
    "name": "Custom electricity tariff",
    "tariff": 0.1
  }
];

// Keep source identity separate from the selected electricity cost metric.
const EnergyChoices = (() => {
  const pairs = {'solar':'solar-eu2030-valcoe','wind':'wind-eu2030-valcoe','wind-offshore':'wind-offshore-eu2030-valcoe','gas':'gas-eu2030-valcoe','coal':'coal-eu2030-valcoe','nuclear-new':'nuclear-new-valcoe','nuclear-old':'nuclear-old-valcoe'};
  const reverse = Object.fromEntries(Object.entries(pairs).map(([a,b])=>[b,a]));
  for(const e of ENERGY) e.name=e.name.replace(' · EU 2030 VALCOE (IEA 2021)','').replace(/ · (global|US) LCOE/,'').replace(/ (?:VALCOE|LCOE)$/,'');
  const metric = s => reverse[s.energy] ? 'valcoe' : s.energy==='custom' && s.energyMetric==='valcoe' ? 'valcoe' : 'lcoe';
  const list = mode => ENERGY.filter(e=>e.id==='custom'||(mode==='valcoe'?!!reverse[e.id]:!reverse[e.id]));
  function populate(select,mode,id){
    if(select._energyMode===mode){select.value=id;return;}
    select._energyMode=mode;
    select.replaceChildren();
    const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='choose an electricity source';placeholder.disabled=true;select.append(placeholder);
    for(const e of list(mode)){const option=document.createElement('option');option.value=e.id;option.textContent=e.name;select.append(option);}
    select.value=id;
  }
  function switchMetric(s,mode){
    const id=mode==='valcoe' ? pairs[s.energy] : reverse[s.energy];
    if(s.energy==='custom')return {...s,energyMetric:mode};
    const chosen=ENERGY.find(e=>e.id===(id||s.energy));
    if(list(mode).some(e=>e.id===chosen.id))return {...s,energy:chosen.id,tariff:chosen.tariff};
    const fallback=ENERGY.find(e=>e.id===pairs.solar);
    return {...s,energy:fallback.id,tariff:fallback.tariff};
  }
  function sync(s){
    const mode=metric(s);
    document.getElementById('valcoe').checked=mode==='valcoe';
    populate(document.getElementById('energy'),mode,s.energy);
    const note=document.getElementById('metric-note');
    if(note)note.textContent=mode==='valcoe'?'VALCOE: only sources with verified values are listed. EU 2030 scenarios; see Sources for each study.':'LCOE: generation-cost benchmarks. Grid-price entries remain delivered tariffs. See Sources for regions and years.';
  }
  return {metric,list,switchMetric,sync};
})();
