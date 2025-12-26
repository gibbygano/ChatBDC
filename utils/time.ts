const ms_in_minute = 60000;
const ms_in_second = 1000;

const now = () => new Date();

const minutes_to_ms = (minutes: number) => minutes * ms_in_minute;

const remaining = (timestamp: Date) => ({
  minutes: (timestamp.getTime() - now().getTime()) / ms_in_minute,
  seconds: (timestamp.getTime() - now().getTime()) / ms_in_second,
});

const remaining_to_string = (remaining: { minutes: number; seconds: number }) =>
  remaining.minutes < 1
    ? `${Math.round(remaining.seconds)} second(s)`
    : `${Math.round(remaining.minutes)} minute(s)`;

const add_minutes = (timestamp: Date, timespan_in_minutes: number) =>
  new Date(timestamp.getTime() + timespan_in_minutes * ms_in_minute);

export {
  add_minutes,
  minutes_to_ms,
  ms_in_minute,
  ms_in_second,
  now,
  remaining,
  remaining_to_string,
};
