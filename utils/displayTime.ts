const displayTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const displaySeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${displayMinutes}:${displaySeconds}`;
};

export default displayTime;
