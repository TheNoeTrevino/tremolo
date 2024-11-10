import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  SxProps,
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
const now = new Date();
const data = getDaysInMonth(now.getMonth() + 1, now.getFullYear());

// TODO: make this reusable, input datam etc
interface ThreeLinedGraphProps {
  lineOne: number[];
  lineTwo: number[];
  lineThree: number[];
  sx: SxProps;
}

const ThreeLinedGraph = ({
  sx,
  lineOne,
  lineTwo,
  lineThree,
}: ThreeLinedGraphProps) => {
  return (
    <Card variant="outlined" sx={sx}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Note Game Sessions
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
            <Chip size="small" color="success" label="+35% from last month" />
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
              data: lineOne,
            },
            {
              id: "referral",
              label: "Referral",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: lineTwo,
            },
            {
              id: "organic",
              label: "Accuracy",
              showMark: false,
              curve: "linear",
              stack: "total",
              stackOrder: "ascending",
              data: lineThree,
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
