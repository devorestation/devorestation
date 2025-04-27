"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import BarChart from "./features/bar-chart/BarChart";
import BubbleChart, { MyComponent } from "./features/bubble-chart/BubbleChart";
import DataTable from "./features/data-table/DataTable";
import MyForceGraph from "./features/force-graph/MyForceGraph";
import Slider from "./features/Slider/Slider";
import { selectData, selectDME, setDME } from "@/lib/reforestation.slice";

export default function Home() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const dme = useAppSelector(selectDME);

  return (
    <div className="grid grid-cols-1 grid-rows-[10%_10%_20%_50%] p-5 size-full relative overflow-hidden">
      <div className="grid grid-cols-6 grid-rows-1">
        <div className="font-bold">Forest Parameters</div>
        <Slider
          name={"Area (ha)"}
          setter={() => {}}
          value={128}
          range={[0, 500]}
          step={10}
        />
        <Slider
          name={"Trees / ha"}
          setter={() => {}}
          value={0.375}
          range={[0, 5]}
          step={0.1}
        />
        <Slider
          name={"Natural mortality rate (percentage)"}
          setter={() => {}}
          value={0.01}
          range={[0, 1]}
          step={0.01}
        />
        <Slider
          name={"Harvest damage rate (percentage)"}
          setter={() => {}}
          value={0.01}
          range={[0, 1]}
          step={0.12}
        />
        <Slider
          name={"DME (cm)"}
          setter={(val: number) => {
            dispatch(setDME(val));
          }}
          value={dme}
          range={[10, 500]}
          step={10}
        />
      </div>
      <div className="grid grid-cols-6 grid-rows-1">
        <div className="font-bold">Baseline Parameters</div>
        <Slider
          name={"DBH increment (cm / a)"}
          setter={() => {}}
          value={0.4}
          range={[0, 1]}
          step={0.05}
        />
        <Slider
          name={"Duration of logging cycle (years)"}
          setter={() => {}}
          value={40}
          range={[0, 200]}
          step={5}
        />
        <Slider
          name={"Natural mortality rate (percentage)"}
          setter={() => {}}
          value={0.01}
          range={[0, 1]}
          step={0.01}
        />
        <Slider
          name={"Harvest damage rate (percentage)"}
          setter={() => {}}
          value={0.01}
          range={[0, 1]}
          step={0.12}
        />
        <Slider
          name={"DME (cm)"}
          setter={() => {}}
          value={70}
          range={[10, 500]}
          step={10}
        />
      </div>
      <div className="flex size-full">
        <DataTable data={data} />
      </div>
      <div className="grid size-full grid-cols-2 grid-rows-1">
        <BarChart data={data} />
        <BubbleChart data={data} />
      </div>
    </div>
  );
  //return <MyForceGraph />;
  // return <BubbleChart />;
}
