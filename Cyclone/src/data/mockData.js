export const activeCyclones = [
  {
    id: "CYC-2026-01",
    name: "Cyclone Amphan II",
    classification: "Super Cyclonic Storm",
    windSpeed: 240, // km/h
    pressure: 920, // hPa
    destructiveScale: 5,
    surgeEstimate: 4.5, // meters
    pastPath: [
      [15.2, 87.1], [16.5, 86.8], [17.8, 86.5], [19.1, 86.9]
    ],
    futurePath: [
      [19.1, 86.9], [20.5, 87.3], [22.1, 88.0]
    ]
  }
];

export const historicalData = [
  { name: "Phailin (2013)", region: "Odisha Coast", maxWind: 215, damage: "High" },
  { name: "Fani (2019)", region: "Odisha Coast", maxWind: 250, damage: "Severe" }
];