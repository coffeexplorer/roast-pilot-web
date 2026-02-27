/**
 * 차트 렌더링용 다운샘플. 원본은 JSON 다운로드 등에 그대로 사용.
 * 스트라이드 샘플링으로 최대 maxPoints개로 줄임.
 */
const DEFAULT_MAX_POINTS = 2000;

export function downsampleTimeseries(
  time: number[],
  channels: Record<string, number[]>,
  maxPoints: number = DEFAULT_MAX_POINTS
): { time: number[]; channels: Record<string, number[]> } {
  if (time.length <= maxPoints) {
    return { time: [...time], channels: { ...channels } };
  }
  const stride = Math.ceil(time.length / maxPoints);
  const indices: number[] = [];
  for (let i = 0; i < time.length; i += stride) {
    indices.push(i);
  }
  if (indices[indices.length - 1] !== time.length - 1) {
    indices.push(time.length - 1);
  }
  const outTime = indices.map((i) => time[i]);
  const outCh: Record<string, number[]> = {};
  for (const [name, arr] of Object.entries(channels)) {
    outCh[name] = indices.map((i) => arr[i]);
  }
  return { time: outTime, channels: outCh };
}

/** 차트용: time + 여러 시리즈 values를 stride로 줄임. (compare 오버레이 등) */
export function downsampleForChart(
  time: number[],
  seriesValues: (number | null)[][],
  maxPoints: number = DEFAULT_MAX_POINTS
): { time: number[]; seriesValues: (number | null)[][] } {
  if (time.length <= maxPoints) {
    return { time: [...time], seriesValues: seriesValues.map((v) => [...v]) };
  }
  const stride = Math.ceil(time.length / maxPoints);
  const indices: number[] = [];
  for (let i = 0; i < time.length; i += stride) indices.push(i);
  if (indices[indices.length - 1] !== time.length - 1) indices.push(time.length - 1);
  return {
    time: indices.map((i) => time[i]),
    seriesValues: seriesValues.map((vals) => indices.map((i) => vals[i] ?? null)),
  };
}
