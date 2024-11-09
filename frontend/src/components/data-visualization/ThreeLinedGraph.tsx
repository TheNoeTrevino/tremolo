import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  SxProps,
  ThemeVars,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}
const data = getDaysInMonth(4, 2024);

// TODO: make this reusable, input datam etc
interface ThreeLinedGraphProps {
  sx: SxProps;
}

const ThreeLinedGraph = ({ sx }: ThreeLinedGraphProps) => {
  return (
    <Card variant="outlined" sx={sx}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Sessions
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              13,277
            </Typography>
            <Chip size="small" color="success" label="+35%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Sessions per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          // todo: this needs to come from the api
          series={[
            {
              id: "direct",
              label: "Notes Per Minute",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: [
                300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800,
                3300, 3600, 3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800,
                5700, 6000, 6300, 6600, 6900, 7200, 7500, 7800, 8100,
              ],
            },
            {
              id: "referral",
              label: "Referral",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: [
                500, 900, 700, 1400, 1100, 1700, 2300, 2000, 2600, 2900, 2300,
                3200, 3500, 3800, 4100, 4400, 2900, 4700, 5000, 5300, 5600,
                5900, 6200, 6500, 5600, 6800, 7100, 7400, 7700, 8000,
              ],
            },
            {
              id: "organic",
              label: "Accuracy",
              showMark: false,
              curve: "linear",
              stack: "total",
              stackOrder: "ascending",
              data: [
                1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800,
                2500, 3000, 3400, 3700, 3200, 3900, 4100, 3500, 4300, 4500,
                4000, 4700, 5000, 5200, 4800, 5400, 5600, 5900, 6100, 6300,
              ],
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-organic": {
              fill: "url('#organic')",
            },
            "& .MuiAreaElement-series-referral": {
              fill: "url('#referral')",
            },
            "& .MuiAreaElement-series-direct": {
              fill: "url('#direct')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={"black"} id="organic" />
          <AreaGradient color={"gray"} id="referral" />
          <AreaGradient color={"blue"} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default ThreeLinedGraph;
