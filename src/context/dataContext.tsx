import React, { createContext, useState } from "react";
export interface Criteria {
  name: string;
  weight: number;
}
type DataContextType = [
  criteria?: Criteria[],
  setCriteria?: React.Dispatch<
    React.SetStateAction<{ name: string; weight: number }[]>
  >
];
export const dataContext = createContext<DataContextType>([]);
type DataContextProviderProps = {
  children: React.ReactNode;
};

export default function DataContextProvider({
  children,
}: DataContextProviderProps) {
  const [critaria, setCrtaria] = useState<Criteria[]>([
    {
      name: "price",
      weight: 0,
    },
    {
      name: "comfort",
      weight: 0,
    },
    {
      name: "seats",
      weight: 0,
    },
    {
      name: "color",
      weight: 0,
    },
  ]);
  return (
    <dataContext.Provider value={[critaria, setCrtaria]}>
      {children}
    </dataContext.Provider>
  );
}
