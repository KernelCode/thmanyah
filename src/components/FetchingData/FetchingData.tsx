import { JSX } from "react";

interface FetchingDataProps {
  children: (data: unknown) => JSX.Element;
  apiPromies: () => Promise<unknown>;
}

export async function FetchingData({ children, apiPromies }: FetchingDataProps) {
  const data = await apiPromies();

  // Call the children function with the fetched data
  return children(data);
}
