// example interfaces that can be use
// TIP: the types mentioned in the interfaces must be fulfilled in order to solve the problem.
interface TemperatureReading {
  time: Date
  temperature: number
  city: string
}
interface TemperatureSummary {
  first: number
  last: number
  high: number
  low: number
  average: number
}

interface DateTemperature {
  time: Date
  temperature: number[]
}

interface CityTemperatures {
  city: string;
  temperatureByDate: DateTemperature[];
}

let cityTemperatureDetail: CityTemperatures[];

function processReadings(readings: TemperatureReading[]): void {
  const cityNames = readings.reduce((prev: string[], nxt) => (prev.indexOf(nxt.city) === -1 ? [...prev, nxt.city] : prev as string[]), []);

  cityTemperatureDetail = cityNames.map((c: string) => {
    const cityFilter = readings.filter(reading => reading.city === c);
    const dates = cityFilter.reduce((acc: Date[], next) =>
      (acc.map(Number).indexOf(+next.time) === -1 ? [...acc, next.time] : acc), [] as Date[]);

    const temperatures: DateTemperature[] = dates.map(d => {
      return {
        time: d,
        temperature: cityFilter.reduce((acc: number[], next, index) =>
          ((+next.time) === (+d) ? [...acc, next.temperature] : acc), [] as number[])
      };
    });

    return { city: c, temperatureByDate: temperatures };
  });
}

function getTemperatureSummary(
  date: Date,
  city: string,
): TemperatureSummary | null {
  const cityResult = cityTemperatureDetail.find(cTemp => cTemp.city === city);
  if (!cityResult) {
    return null;
  }

  const tempByCity = cityResult.temperatureByDate.find(x => x.time.toString() === date.toString());
  if (!tempByCity)
    return null;

  const temperatures = tempByCity.temperature;
  const temperatureSummary: TemperatureSummary = {
    first: temperatures[0],
    last: temperatures[temperatures.length - 1],
    high: Math.max(...temperatures),
    low: Math.min(...temperatures),
    average: temperatures.reduce((acc, next) => acc + next) / temperatures.length,
  };
  return temperatureSummary;
}

const temp: TemperatureReading[] = [
  {
    time: new Date("1/1/2021"),
    temperature: 10,
    city: "Utah",
  },
  {
    time: new Date("1/1/2021"),
    temperature: 9,
    city: "Utah",
  },
  {
    time: new Date("1/1/2021"),
    temperature: 11,
    city: "Utah",
  },
  {
    time: new Date("1/1/2021"),
    temperature: 3,
    city: "New York",
  },
  {
    time: new Date("1/1/2021"),
    temperature: 2,
    city: "New York",
  },
  {
    time: new Date("1/1/2021"),
    temperature: 7,
    city: "New York",
  },
  {
    time: new Date("1/2/2021"),
    temperature: 27,
    city: "Utah",
  },
];

processReadings(temp);
getTemperatureSummary(new Date('1/2/2021'), 'Utah');
getTemperatureSummary(new Date('3/12/2021'), 'New York');

exports.processReadings = processReadings
exports.getTemperatureSummary = getTemperatureSummary
