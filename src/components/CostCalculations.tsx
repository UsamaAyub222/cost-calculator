import { Form, Button, Col, Row, Select, Input } from "antd";
import { useEffect, useState } from "react";
import baselineFLH_Json from "../data/flh.json";
import bdgSummary from "../data/recs-bdg-summary.json";
import loadReduction from "../data/load-reduction.json";
import baselineFuelJson from "../data/baseline-fuel.json";
import gasUtilityJson from "../data/gas-utility.json";
import propaneLevelJson from "../data/propane-leve.json";
import baselineEfficiencyJson from "../data/baseline-efficiency.json";
import acEfficiencyJson from "../data/ac-efficiency.json";
import emissionIntensityJson from "../data/emission-intensity.json";
import ashpCalculationsJson from "../data/ashp-calculation.json";
import costImage from "../header-img.jpeg";
import downIcon from "../assets/feather-arrow-down.svg";
import upIcon from "../assets/feather-arrow-up.svg";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Text,
  ComposedChart,
} from "recharts";

interface StringByString {
  [key: string]: number;
}
interface StringByString_FLH {
  [key: string]: { [key: string]: number };
}
const loadReductionJson: StringByString = loadReduction;
const baselineFLH: StringByString_FLH = baselineFLH_Json;
export default function CostCalculations() {
  const [user, setUser] = useState<String>("Homeowner");
  const [loadCalculation, setLoadCalculation] = useState<String>("Yes");
  const [homeType, setHomeType] = useState("Single_Family");
  const [homeBuilt, setHomeBuilt] = useState<String>("1961-1990");
  const [squareFootage, setSquareFootage] = useState<string>("");
  const [homeBuiltArray, setHomeBuiltArray] = useState<any>();
  const [squareFootageArray, setSquareFootageArray] = useState<any>();
  const [weatherized, setWeatherized] = useState<any>("No");
  const [weatherizedYesShow, setWeatherizedYesShow] = useState("none");
  const [weatherizedNoShow, setWeatherizedNoShow] = useState("block");
  const [heatingFuel, setHeatingFuel] = useState<String>("Natural_Gas");
  const [gasUtility, setGasUtility] = useState<String>("Peoples_Gas");
  const [heatingType, setHeatingType] = useState<String>("Fossil_Fuel_Furnace");
  const [heatingTypePropane, setHeatingTypePropane] = useState("acOptionHide");
  const [heatingTypeNatGas, setHeatingTypeNatGas] = useState("acOptionShow");
  const [heatingTypeElectric, setHeatingTypeElectric] =
    useState("acOptionHide");
  const [ducts, setDucts] = useState<String>("Yes");
  const [coolingType, setCoolingType] = useState<String>("Window_AC");
  const [coolingTypeNone, setCoolingTypeNone] = useState("acOptionHide");
  const [coolingTypeAC, setCoolingTypeAC] = useState("acOptionShow");
  const [ductwork, setDuctwork] = useState<String>("No");
  const [contractorBid, setContractorBid] = useState<String>("Yes");
  const [seerRating, setSeerRating] = useState<String>("No");
  const [rebatesTax, setRebatesTax] = useState<String>("No");
  const [rebatesTaxQualify, setRebatesTaxQualify] = useState<String>("Yes");
  const [replacingFurnace, setReplacingFurnace] = useState<String>("Yes");
  const [qualifyRebates, setQualifyRebates] = useState<String>("Yes");
  const [prevTotalPrice, setPrevTotalPrice] = useState<number>(10000);
  const [taxRebatsAndCreditsTotal, setTaxRebatsAndCreditsTotal] =
    useState<number>(1950);

  const [annualBillCost, setAnnualBillCost] = useState<String>("");
  const [monthlyBillCost, setMonthlyBillCost] = useState<String>("");
  const [annualElectricBillImpact, setAnnualElectricBillImpact] =
    useState<String>("");
  const [monthlyElectricBillImpact, setMonthlyElectricBillImpact] =
    useState<String>("");

  const [annualElectricFuelBillImpact, setAnnualElectricFuelBillImpact] =
    useState<String>("");
  const [monthlyElectricFuelBillImpact, setMonthlyElectricFuelBillImpact] =
    useState<String>("");

  const [simplePaybackElectric, setSimplePaybackElectric] =
    useState<String>("");
  const [simplePaybackFuel, setSimplePaybackFuel] = useState<String>("");
  const [lifeTimeEmissionElectric, setLifeTimeEmissionElectric] =
    useState<String>("");
  const [lifetimeEmissionFuel, setLifetimeEmissionFuel] = useState<String>("");
  const [lifetimeEmissionEquivalent, setLifetimeEmissionEquivalent] =
    useState<String>("");

  const [graphData, setGraphData] = useState<any>([]);
  const [formShow, setFormShow] = useState("block");
  const [outputShow, setOutputShow] = useState("none");

  const [avgHeatingCoolingCost, setAvgHeatingCoolingCost] = useState<number>();
  const [stackGraphData, setStackGraphData] = useState<any>([]);
  const [parallelGraphData, setParallelGraphData] = useState<any>([]);
  const [envGraphData, setEnvGraphData] = useState<any>([]);
  const [hideShowDetail, setHideShowDetail] = useState<string>("none");
  const [avgCoolingFrom, setAvgCoolingFrom] = useState<number>(0);
  const [avgCoolingTo, setAvgCoolingTo] = useState<number>(0);
  const [avgHeatFrom, setAvgHeatFrom] = useState<number>(0);
  const [avgHeatTo, setAvgHeatTo] = useState<number>(0);
  const [avgSummer, setAvgSummer] = useState<string>();
  const [avgWinter, setAvgWinter] = useState<string>();
  const [validateStackBar, setValidateStackBar] = useState<boolean>(false);

  const key = "updatable";
  const heatInput = 41900;
  const coolInput = 16619;
  const includeDeduction = "Yes";
  const lifeInYears = 20;
  const estimatedASHP_Cost = 9375;
  const AshpCost = contractorBid === "No" ? estimatedASHP_Cost : prevTotalPrice;
  const CAC_ReplacementCost = 5930;
  const defaultASHPRebate = 2000;
  let ASHP_Rebate: any;
  let measureCoolLoad: number;
  let adjustedSEER: number;
  let measureBackupEfficiencyGasPropane: any;
  let baselineHeatLoad: number;
  let baseAFUE: any;
  let baselineCoolLoad: number;
  let SEER_None: number;
  let fanEnergyBaseline: number;
  let measureElectricRateAllNaturalGas: number;
  let gasOrPropaneMMBTU: any;
  let measureElectricRateAllPropane: number;
  let baselineFuelEmissionIntensity: number;
  let heatWeightedLoadIntensityKgco2Electric: number;
  let emissionSavingConservative: number;
  let emissionSavingMedian: number;
  let emissionSavingOptimistic: number;
  let measureHeatLoad: number;
  const hourlyStandByPower = 0.1;
  let measureFlhHeating: any;
  let measureFlhCooling: any;
  let heatingCapacityBTU: any;
  const ductLoss = ductwork === "Yes" ? 0.25 : 0;
  // D73(bacupHeatBTU), C73(ASHP_HeatBTU), E73(loadWeightedCopConservative), K73(measureStandbyKwh), F73(loadWeightedCopMedian), G73(loadWeightedCopOptimistic)
  let measureCostOptimistic: number = 0;
  let measureCostMedian: number = 0;
  let measureCostConservative: number = 0;
  let bacupHeatBTU: number = 0;
  let ASHP_HeatBTU: number = 0;
  let sumOfBinHeating: number = 0;
  let measureCoolingCost: number = 0;
  // N73(backupElectricKwh)
  let backupElectricKwh: number = 0;
  // w73
  let coolWeightedLoadIntensityKgco2Electric: number = 0;
  // x73
  let measureCoolingEmissionKgco2: number = 0;
  // y73
  let emissionKgco2Conservative: number = 0;
  // Electri cost variables
  let electricBaslineCost: number = 0;
  let electricConservativeCost: number = 0;
  let electricMedianCost: number = 0;
  let electricOptimisticCost: number = 0;
  // Electri cost variables End...
  let sumOfCopConservativeIntoBinHeating: number = 0;
  let sumOfCopMedianIntoBinHeating: number = 0;
  let sumOfCopOptimisticIntoBinHeating: number = 0;
  let measureStandbyKwh: number = 0;
  let sumForCoolLoadIntensity: number = 0;
  let sumForHeatLoadIntensity: number = 0;
  let sumCoolLoadBTU: number = 0;
  let baselineGasPropaneMMBTU: number = 0;
  let baselineElectricHeatKWH: number = 0;
  let baselineCoolingKWH: number = 0;
  let baselineFanSavingsKWH: number = 0;
  let baselineCost: number = 0;
  const measureBackupEfficiencyAllElectric = 1;
  let measureElectricRateAllElectric: number = 0;
  let baselineFlhHeating: number = 0;
  let baselineFlhCooling: number = 0;

  let impactConservative: number = 0;
  let impactMedian: number = 0;
  let impactOptimistic: number = 0;

  const plotDataArray = ["AllElectric", 5, 30, 45];
  const xAxisLabelStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    fill: "red",
    textAnchor: "middle",
  };

  const staticData = [
    {
      Switchover: "AllElectric",
      Optimistic: "515.79",
      SwitchLabel: "All-Electric System",
    },
    {
      Switchover: 5,
      Optimistic: "510.40",
      SwitchLabel: "5° F",
    },
    {
      Switchover: 30,
      Optimistic: "344.79",
      SwitchLabel: "30° F",
    },
    {
      Switchover: 45,
      Optimistic: "219.69",
      SwitchLabel: "45° F",
    },
  ];
  const handleSubmit = () => {
    // setUser(value);
    if (user === "Homeowner") {
      // message.open({
      //   key,
      //   type: "loading",
      //   content: "Loading...",
      // });

      getGeneralValues();

      // BaseLine...........
      setBaselineValues();

      //Measue.........
      setMeasureValues();

      // Output.........
      getCost();

      // make dynamic table ashp calculation
      let ashpCalculationDynamic: any = ashpCalculationsJson;
      ashpCalculationDynamic = getAshpCalculationDynamic(
        ashpCalculationDynamic
      );
      // Dynamic Table Complete "ashpCalculationDynamic"

      const RebateInBid =
        contractorBid === "Yes" && rebatesTax === "Yes" ? "Yes" : "No";
      if (RebateInBid === "No") {
        if (includeDeduction === "Yes") {
          ASHP_Rebate = taxRebatsAndCreditsTotal;
        } else {
          ASHP_Rebate = defaultASHPRebate;
        }
      } else {
        ASHP_Rebate = 0;
      }
      // For All Electric

      getAllElectricValues(ashpCalculationDynamic);

      // For Dual Fuel
      let loadAshpDynamicTable: any = getLoadAshpDynamictable(
        ashpCalculationDynamic
      );
      // let currentAvgHeatingCoolingCost = Math.round(
      //   loadAshpDynamicTable[0].BaselineCost / 12
      // );
      // const avgPerMonth = Math.round(baselineCost / 12);
      // setAvgHeatingCoolingCost(avgPerMonth);

      let impactHeatingFuelDynamictable: any =
        getImpactHeatingFuelDynamicTable(loadAshpDynamicTable);

      setElectric_PaybackFuel_LiftimeEmission_Values(
        impactHeatingFuelDynamictable,
        emissionSavingConservative,
        emissionSavingMedian,
        emissionSavingOptimistic
      );

      getGraphData(impactHeatingFuelDynamictable);

      plotStackGraphData(loadAshpDynamicTable);
      plotParallelGraphData(loadAshpDynamicTable);
      plotEnvGraphData(impactHeatingFuelDynamictable);

      // Monthly Electric Cost
      //Average Summer Cooling:
      let avgSummerFromValue = Math.round(
        ((measureCoolLoad / (adjustedSEER / 3.412142) / 3412.142) *
          measureElectricRateAllPropane -
          baselineCoolingKWH * measureElectricRateAllNaturalGas) /
          4
      );
      setAvgCoolingFrom(avgSummerFromValue);
      let avgSummerToValue = Math.round(
        ((measureCoolLoad / (adjustedSEER / 3.412142) / 3412.142) *
          measureElectricRateAllElectric -
          baselineCoolingKWH * measureElectricRateAllNaturalGas) /
          4
      );
      setAvgCoolingTo(avgSummerToValue);

      if (heatingFuel === "Electricity") {
        setAvgSummer(
          `$${Math.abs(avgSummerToValue)} to $${Math.abs(avgSummerToValue)}`
        );
      } else {
        setAvgSummer(
          // Update made to show the value from the lowest to highest since these are negative numbers.
          `$${Math.abs(avgSummerToValue)} to $${Math.abs(avgSummerFromValue)}`
          // `$${Math.abs(avgSummerFromValue)} to $${Math.abs(avgSummerToValue)}`
        );
      }
      //Average Winter Heating:
      let avgWinterMin = 0;
      let avgWinterMax = 0;
      if (heatingFuel === "Electricity") {
        avgWinterMin = Math.round(
          (Math.min(impactConservative, impactMedian, impactOptimistic)) /
            8
        );
        avgWinterMax = Math.round(
          (Math.max(impactConservative, impactMedian, impactOptimistic)) /
            8
        );
        setAvgHeatFrom(avgWinterMin);
        setAvgHeatTo(avgWinterMax);
        setAvgWinter(
          `$${Math.abs(avgWinterMin)} to $${Math.abs(avgWinterMax)}`
        );
      } else {
        let avgWinterArray: any = [];
        avgWinterArray.push(
          impactConservative
        );
        avgWinterArray.push(impactMedian);
        avgWinterArray.push(impactOptimistic);

        for (let i = 0; i < impactHeatingFuelDynamictable.length; i++) {
          if (impactHeatingFuelDynamictable[i].Switchovers <= 45) {
            avgWinterArray.push(
              impactHeatingFuelDynamictable[i].ImpactConservative
            );
            avgWinterArray.push(
              impactHeatingFuelDynamictable[i].ImpactMedian
            );
            avgWinterArray.push(
              impactHeatingFuelDynamictable[i].ImpactOptimistic
            );
          }
        }

        avgWinterMin = Math.round(Math.min(...avgWinterArray) / 8);
        avgWinterMax = Math.round(Math.max(...avgWinterArray) / 8);
        setAvgHeatFrom(avgWinterMin);
        setAvgHeatTo(avgWinterMax);
        setAvgWinter(
          `$${Math.abs(avgWinterMin)} to $${Math.abs(avgWinterMax)}`
        );
      }

      window.scrollTo({
        top: 200,
        left: 0,
        behavior: "smooth",
      });
      setFormShow("none");
      setOutputShow("block");
    }
  };
  const getGeneralValues = () => {
    baselineFlhCooling = baselineFLH.Cool[homeType];
    baselineFlhHeating = baselineFLH.Heat[homeType];
    const measureFlhScalingFactor = 2.3;
    measureFlhCooling = baselineFlhCooling * measureFlhScalingFactor;
    measureFlhHeating = baselineFlhHeating * measureFlhScalingFactor;
    const heatLoadInputBTU = baselineFlhHeating * heatInput;
    const coolLoadInputBTU = baselineFlhCooling * coolInput;
    let heatLoadBTU: any;
    let coolLoadBTU: any;
    if (loadCalculation === "Yes" && user === "Contractor") {
      heatLoadBTU = heatLoadInputBTU;
      coolLoadBTU = coolLoadInputBTU;
    } else {
      const filterData: any = bdgSummary.filter((el: any) => {
        if (homeType === "Manufactured" && el.Unit_Type === homeType) {
          return el;
        }
        if (
          el.Unit_Type === homeType &&
          el.Age_Range === homeBuilt &&
          el.Sqft_Range === squareFootage
        ) {
          return el;
        }
      });
      heatLoadBTU = filterData[0].Heating_Load_Btu;
      coolLoadBTU = filterData[0].Cooling_Load_Btu;
    }
    const loadReductionPercentage = loadReductionJson[weatherized];
    baselineHeatLoad = heatLoadBTU * (1 - loadReductionPercentage);
    baselineCoolLoad = coolLoadBTU * (1 - loadReductionPercentage);
    measureHeatLoad = baselineHeatLoad;
    measureCoolLoad = baselineCoolLoad;
    const baslineHeatingFuel = heatingFuel;
    const propanePriceLevel = "Medium";

    const filterAllElectric = baselineFuelJson.Baseline_Electric_Rate.filter(
      (ele: any) => {
        return ele.Building_Type === homeType;
      }
    );
    measureElectricRateAllElectric = filterAllElectric[0].Electricity;
    //DualFuel
    measureElectricRateAllPropane = filterAllElectric[0].Propane;
    // BaselineElectric
    measureElectricRateAllNaturalGas = filterAllElectric[0].Natural_Gas;
    const filterAllElectricFixed =
      baselineFuelJson.Baseline_Electric_Fixed_Cost.filter((ele: any) => {
        return ele.Building_Type === homeType;
      });
    const measureFixedElectricRateAllElectric =
      filterAllElectricFixed[0].Electricity;
    const measureFixedElectricRateAllPropane =
      filterAllElectricFixed[0].Propane;
    const measureFixedElectricRateAllNaturalGas =
      filterAllElectricFixed[0].Natural_Gas;

    const filterGasUtility = gasUtilityJson.filter((ele: any) => {
      return ele.Gas_Utility === gasUtility;
    });
    const gasRate = filterGasUtility[0]["$/th"];

    const filterPropaneLevel = propaneLevelJson.filter((ele: any) => {
      return ele.Propane_Level === propanePriceLevel;
    });
    const propaneRate = filterPropaneLevel[0]["$/gal"];

    if (heatingFuel === "Natural_Gas") {
      gasOrPropaneMMBTU = gasRate * 10;
    } else {
      if (heatingFuel === "Propane") {
        gasOrPropaneMMBTU = (propaneRate * 10 ** 6) / 91502;
      } else {
        gasOrPropaneMMBTU = 0;
      }
    }

    const filterBdgSummary: any = bdgSummary.filter((el: any) => {
      if (homeType === "Manufactured" && el.Unit_Type === homeType) {
        return el;
      }
      if (
        el.Unit_Type === homeType &&
        el.Age_Range === homeBuilt &&
        el.Sqft_Range === squareFootage
      ) {
        return el;
      }
    });
    const nonHvacElectricLoad = filterBdgSummary[0].Additonal_Electric_kWh;
  };
  const setBaselineValues = () => {
    const deratingCoolBase = 0;
    const deratingHeatBase = 0;

    const filterbaselineEfficiencyJson = baselineEfficiencyJson.filter(
      (ele: any) => {
        return ele.System === heatingType;
      }
    );
    baseAFUE =
      filterbaselineEfficiencyJson[0].Efficiency * (1 - deratingHeatBase);
    const filteracEfficiencyJson = acEfficiencyJson.filter((ele: any) => {
      return ele.System === coolingType;
    });

    const SEER =
      filteracEfficiencyJson.length > 0
        ? filteracEfficiencyJson[0].SEER * (1 - deratingCoolBase)
        : 0;
    SEER_None = coolingType === "None" ? 9999999999 : SEER;
    const EER =
      coolingType === "None" ? 99999999 : -0.02 * SEER ** 2 + 1.12 * SEER;
    fanEnergyBaseline = ducts === "Yes" ? 0.0251 : 0;

    const filterEmissionIntensityJson = emissionIntensityJson.filter(
      (ele: any) => {
        return ele.Fuel === heatingFuel;
      }
    );
    baselineFuelEmissionIntensity = filterEmissionIntensityJson[0]["kgCO2/Btu"];
  };
  const setMeasureValues = () => {
    const SEER_eeDefault = 20;
    const EER_ee = -0.02 * SEER_eeDefault ** 2 + 1.12 * SEER_eeDefault;
    const SEERadj = (0.805 * EER_ee) / SEER_eeDefault + 0.367;
    adjustedSEER = SEERadj * SEER_eeDefault;
    heatingCapacityBTU = measureHeatLoad / baselineFlhHeating;
    const coolingCapacityBTU = measureCoolLoad / baselineFlhCooling;

    measureBackupEfficiencyGasPropane =
      replacingFurnace === "Yes" && heatingType === "Fossil_Fuel_Furnace"
        ? 0.98
        : baseAFUE;
  };
  const getAllElectricValues = (ashpCalculationDynamic: any) => {
    for (let i = 0; i < ashpCalculationDynamic.length; i++) {
      if (ashpCalculationDynamic[i].OAT_Min_incl < 65) {
        bacupHeatBTU += ashpCalculationDynamic[i].Load_Deficit_BTU;
        ASHP_HeatBTU += ashpCalculationDynamic[i].Ashp_Load_BTU;

        sumOfCopConservativeIntoBinHeating +=
          ashpCalculationDynamic[i].Conservative_COP *
          ashpCalculationDynamic[i].Bin_Heating_Load_BTU;
        sumOfCopMedianIntoBinHeating +=
          ashpCalculationDynamic[i].Median_COP *
          ashpCalculationDynamic[i].Bin_Heating_Load_BTU;
        sumOfCopOptimisticIntoBinHeating +=
          ashpCalculationDynamic[i].Optimistic_COP *
          ashpCalculationDynamic[i].Bin_Heating_Load_BTU;
        sumOfBinHeating += ashpCalculationDynamic[i].Bin_Heating_Load_BTU;

        sumForHeatLoadIntensity +=
          ashpCalculationDynamic[i].NREL_CAMBIUM_CO2_Intensity *
          ashpCalculationDynamic[i].Bin_Heating_Load_BTU;
      }
      if (
        ashpCalculationDynamic[i].OAT_Min_incl >= 65 &&
        ashpCalculationDynamic[i].OAT_Min_incl < 90
      ) {
        sumForCoolLoadIntensity +=
          ashpCalculationDynamic[i].NREL_CAMBIUM_CO2_Intensity *
          ashpCalculationDynamic[i].Bin_Cooling_Load;
        sumCoolLoadBTU += ashpCalculationDynamic[i].Bin_Cooling_Load;
      }
      measureStandbyKwh += ashpCalculationDynamic[i].Standby_Energy_Kwh;
    }

    const loadWeightedCopConservative: number =
      sumOfCopConservativeIntoBinHeating / sumOfBinHeating;
    measureStandbyKwh = ducts === "No" ? 0 : measureStandbyKwh;
    const loadWeightedCopMedian: number =
      sumOfCopMedianIntoBinHeating / sumOfBinHeating;
    const loadWeightedCopOptimistic: number =
      sumOfCopOptimisticIntoBinHeating / sumOfBinHeating;

    //H73(ashpAnnualKwhConservative)
    const ashpAnnualKwhConservative =
      ASHP_HeatBTU / loadWeightedCopConservative / 3412.142 +
      measureCoolLoad / (adjustedSEER / 3.412142) / 3412.142;
    // I73(ashpAnnualKwhMedian)
    const ashpAnnualKwhMedian =
      ASHP_HeatBTU / loadWeightedCopMedian / 3412.142 +
      measureCoolLoad / (adjustedSEER / 3.412142) / 3412.142;

    // J73(ashpAnnualKwhOptimistic)
    const ashpAnnualKwhOptimistic =
      ASHP_HeatBTU / loadWeightedCopOptimistic / 3412.142 +
      measureCoolLoad / (adjustedSEER / 3.412142) / 3412.142;
    // N73(backupElectricKwh)
    backupElectricKwh =
      bacupHeatBTU / measureBackupEfficiencyAllElectric / 3412.142;
    // M73(backupGasPropaneMMBTU)
    const backupGasPropaneMMBTU = 0;

    // S73(measureCostConservative)
    measureCostConservative =
      (backupElectricKwh + ashpAnnualKwhConservative + measureStandbyKwh) *
        measureElectricRateAllElectric +
      backupGasPropaneMMBTU * gasOrPropaneMMBTU;

    // T73(measureCostMedian)
    measureCostMedian =
      (backupElectricKwh + measureStandbyKwh + ashpAnnualKwhMedian) *
        measureElectricRateAllElectric +
      backupGasPropaneMMBTU * gasOrPropaneMMBTU;

    // U73(measureCostOptimistic)
    measureCostOptimistic =
      (backupElectricKwh + ashpAnnualKwhOptimistic + measureStandbyKwh) *
        measureElectricRateAllElectric +
      backupGasPropaneMMBTU * gasOrPropaneMMBTU;
    // v73 (heatWeightedLoadIntensityKgco2Electric)
    heatWeightedLoadIntensityKgco2Electric =
      sumForHeatLoadIntensity / sumOfBinHeating;
    // w73 (coolWeightedLoadIntensityKgco2Electric)
    coolWeightedLoadIntensityKgco2Electric =
      sumForCoolLoadIntensity / sumCoolLoadBTU;
    // x73 (measureCoolingEmissionKgco2)
    measureCoolingEmissionKgco2 =
      (measureCoolLoad / (adjustedSEER / 3.412142)) *
      coolWeightedLoadIntensityKgco2Electric;

    // y73(emissionKgco2Conservative)
    emissionKgco2Conservative =
      (backupElectricKwh + ashpAnnualKwhConservative + measureStandbyKwh) *
        3412.142 *
        heatWeightedLoadIntensityKgco2Electric +
      backupGasPropaneMMBTU * baselineFuelEmissionIntensity * 10 ** 6 +
      measureCoolingEmissionKgco2;
    // z73(emissionKgco2Median)
    const emissionKgco2Median =
      (backupElectricKwh + ashpAnnualKwhMedian + measureStandbyKwh) *
        3412.142 *
        heatWeightedLoadIntensityKgco2Electric +
      backupGasPropaneMMBTU * baselineFuelEmissionIntensity * 10 ** 6 +
      measureCoolingEmissionKgco2;

    // Electric Only costs

    //(electricBaslineCost)
    electricBaslineCost =
      (baselineFanSavingsKWH + baselineElectricHeatKWH) *
      (heatingFuel === "Electricity"? measureElectricRateAllElectric:  measureElectricRateAllNaturalGas);
    // (electricConservativeCost)
    electricConservativeCost =
      ((backupElectricKwh + ashpAnnualKwhConservative + measureStandbyKwh) *
      measureElectricRateAllElectric)-measureCoolingCost;
    // sumForCoolLoadIntensity / sumCoolLoadBTU;
    // (electricMedianCost)
    electricMedianCost =
      ((backupElectricKwh + ashpAnnualKwhMedian + measureStandbyKwh) *
      measureElectricRateAllElectric)-measureCoolingCost;

    // (electricOptimisticCost)
    electricOptimisticCost =
      ((backupElectricKwh + ashpAnnualKwhOptimistic + measureStandbyKwh) *
      measureElectricRateAllElectric)-measureCoolingCost;

    // Electric only costs End-->

    // aa73(emissionKgco2Optimistic)
    const emissionKgco2Optimistic =
      (backupElectricKwh + ashpAnnualKwhOptimistic + measureStandbyKwh) *
        3412.142 *
        heatWeightedLoadIntensityKgco2Electric +
      backupGasPropaneMMBTU * baselineFuelEmissionIntensity * 10 ** 6 +
      measureCoolingEmissionKgco2;
    // ab73(emissionKgco2Baseline)
    const emissionKgco2Baseline =
      (baselineFanSavingsKWH + baselineElectricHeatKWH) *
        3412.142 *
        heatWeightedLoadIntensityKgco2Electric +
      baselineGasPropaneMMBTU * 10 ** 6 * baselineFuelEmissionIntensity +
      baselineCoolingKWH * 3412.142 * coolWeightedLoadIntensityKgco2Electric;
    //
    impactConservative = electricConservativeCost - electricBaslineCost;
    impactMedian = electricMedianCost - electricBaslineCost;
    impactOptimistic = electricOptimisticCost - electricBaslineCost;

    // Payback Electric
    let PaybackConservative: number;
    let PaybackMedian: number;
    let PaybackOptimistic: number;
    if (impactConservative === 0) {
      PaybackConservative = 0;
    } else {
      if (
        impactConservative < 0 &&
        (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -impactConservative <
          20
      ) {
        PaybackConservative =
          (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -impactConservative;
      } else {
        PaybackConservative = 0;
      }
    }

    if (impactMedian === 0) {
      PaybackMedian = 0;
    } else {
      if (
        impactMedian < 0 &&
        (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -impactMedian < 20
      ) {
        PaybackMedian =
          (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -impactMedian;
      } else {
        PaybackMedian = 0;
      }
    }

    if (impactOptimistic === 0) {
      PaybackOptimistic = 0;
    } else {
      if (
        impactOptimistic < 0 &&
        (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -impactOptimistic < 20
      ) {
        PaybackOptimistic =
          (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -impactOptimistic;
      } else {
        PaybackOptimistic = 0;
      }
    }
    let simpleMinPaybackElectric;
    if (
      Math.min(PaybackConservative, PaybackMedian, PaybackOptimistic) === 0 &&
      Math.max(PaybackConservative, PaybackMedian, PaybackOptimistic) === 0
    ) {
      simpleMinPaybackElectric = "No payback";
    } else {
      if (
        Math.round(
          Math.min(PaybackConservative, PaybackMedian, PaybackOptimistic)
        ) < 0 ||
        Math.round(
          Math.max(PaybackConservative, PaybackMedian, PaybackOptimistic)
        ) < 0
      ) {
        simpleMinPaybackElectric = "No payback";
      } else {
        simpleMinPaybackElectric = ` ${Math.round(
          Math.min(PaybackConservative, PaybackMedian, PaybackOptimistic)
        )} to ${
          Math.round(
            Math.max(PaybackConservative, PaybackMedian, PaybackOptimistic)
          ) === 0
            ? " > 20 years"
            : `${Math.round(
                Math.max(PaybackConservative, PaybackMedian, PaybackOptimistic)
              )} years`
        }`;
      }
    }
    setSimplePaybackElectric(simpleMinPaybackElectric);
    // h93 (emissionSavingConservative), i93(emissionSavingMedian), j93(emissionSavingOptimistic)
    emissionSavingConservative =
      (emissionKgco2Baseline - emissionKgco2Conservative) * lifeInYears;
    emissionSavingMedian =
      (emissionKgco2Baseline - emissionKgco2Median) * lifeInYears;
    emissionSavingOptimistic =
      (emissionKgco2Baseline - emissionKgco2Optimistic) * lifeInYears;

    const lifetimeEmissionElectric = `${(
      Math.round(
        Math.min(
          emissionSavingConservative,
          emissionSavingMedian,
          emissionSavingOptimistic
        ) / 100
      ) * 100
    ).toLocaleString("en-US")} to ${(
      Math.round(
        Math.max(
          emissionSavingConservative,
          emissionSavingMedian,
          emissionSavingOptimistic
        ) / 100
      ) * 100
    ).toLocaleString("en-US")} lbsCO2 avoided`;
    setLifeTimeEmissionElectric(lifetimeEmissionElectric);

    const Anually_AllElectricBillImpact = `$ ${
      Math.round(
        Math.max(impactConservative, impactMedian, impactOptimistic) / 10
      ) * 10
    } to $ ${
      Math.round(
        Math.min(impactConservative, impactMedian, impactOptimistic) / 10
      ) * 10
    } per year`;
    setAnnualElectricBillImpact(Anually_AllElectricBillImpact);
    const Monthly_AllElectricBillImpact = `$ ${
      Math.round(
        Math.max(impactConservative, impactMedian, impactOptimistic) / 12 / 10
      ) * 10
    } to $ ${
      Math.round(
        Math.min(impactConservative, impactMedian, impactOptimistic) / 12 / 10
      ) * 10
    } per month`;
    setMonthlyElectricBillImpact(Monthly_AllElectricBillImpact);
  };
  const getCost = () => {
    // O73
    baselineGasPropaneMMBTU =
      heatingFuel === "Electricity" ? 0 : baselineHeatLoad / baseAFUE / 10 ** 6;
    // P73
    baselineElectricHeatKWH =
      heatingFuel === "Electricity"
        ? baselineHeatLoad / baseAFUE / 3412.142
        : 0;
    // Q73
    baselineCoolingKWH = Math.round(baselineCoolLoad / (SEER_None / 3.412142)) / 3412.142;
    // L73
    baselineFanSavingsKWH =
      ((baselineGasPropaneMMBTU * 10 ** 6 +
        baselineElectricHeatKWH * 3412.142) *
        fanEnergyBaseline) /
      3412.142;
    // R73(baselineCost)

    measureCoolingCost = (measureCoolLoad / (adjustedSEER/3.412142))/ 3412.142 * measureElectricRateAllElectric;

    baselineCost =
      heatingFuel === "Electricity"
        ? (baselineFanSavingsKWH +
            baselineCoolingKWH +
            baselineElectricHeatKWH) *
            measureElectricRateAllElectric +
          baselineGasPropaneMMBTU * gasOrPropaneMMBTU
        : (baselineFanSavingsKWH +
            baselineCoolingKWH +
            baselineElectricHeatKWH) *
            measureElectricRateAllNaturalGas +
          baselineGasPropaneMMBTU * gasOrPropaneMMBTU;
    // current cost.....
    const Anually_currentCost = ` $ ${
      Math.round(baselineCost / 10) * 10
    } per year`;
    setAnnualBillCost(Anually_currentCost);
    const Monthly_currentCost = ` $ ${
      Math.round(baselineCost / 12 / 5) * 5
    } per month`;
    setMonthlyBillCost(Monthly_currentCost);
  };
  const getAshpCalculationDynamic = (ashpCalculationDynamic: any) => {
    for (let index = 0; index < ashpCalculationDynamic.length; index++) {
      ashpCalculationDynamic[index]["Bin_Heating_Load_BTU"] =
        ashpCalculationDynamic[index].Heating_Load_Share_in_Bin *
        measureHeatLoad;
      ashpCalculationDynamic[index]["Bin_Cooling_Load"] =
        ashpCalculationDynamic[index].Cooling_Load_Share_in_Bin *
        measureCoolLoad;
      let sumOf_NoOfHours: number = 0;
      let sumOf_NoOfHoursAfter: number = 0;
      for (let i = 0; i < ashpCalculationDynamic.length; i++) {
        if (ashpCalculationDynamic[i].OAT_Min_incl <= 60) {
          sumOf_NoOfHours += ashpCalculationDynamic[i].No_of_Hours_per_OAT_bin;
        } else {
          sumOf_NoOfHoursAfter +=
            ashpCalculationDynamic[i].No_of_Hours_per_OAT_bin;
        }
      }
      ashpCalculationDynamic[index]["Standby_Energy_Kwh"] =
        ashpCalculationDynamic[index].OAT_Min_incl <= 60
          ? hourlyStandByPower *
            (ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin -
              (ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin /
                sumOf_NoOfHours) *
                measureFlhHeating)
          : hourlyStandByPower *
            (ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin -
              (ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin /
                sumOf_NoOfHoursAfter) *
                measureFlhCooling);

      ashpCalculationDynamic[index]["Avg_Capacity_BTU"] =
        ashpCalculationDynamic[index].OAT_Min_incl < 65
          ? ashpCalculationDynamic[index].Capacity_Retention *
            heatingCapacityBTU *
            (1 - ductLoss)
          : -ashpCalculationDynamic[index].Capacity_Retention *
            heatingCapacityBTU *
            (1 - ductLoss);

      ashpCalculationDynamic[index]["Avg_Load_BTU"] =
        ashpCalculationDynamic[index].OAT_Min_incl < 65
          ? ashpCalculationDynamic[index].Bin_Heating_Load_BTU /
            ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin
          : -ashpCalculationDynamic[index].Bin_Cooling_Load /
            ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin;

      if (
        ashpCalculationDynamic[index].OAT_Min_incl < 65 &&
        ashpCalculationDynamic[index]["Avg_Load_BTU"] >
          ashpCalculationDynamic[index]["Avg_Capacity_BTU"]
      ) {
        ashpCalculationDynamic[index]["Avg_Load_Deficit_BTU"] =
          ashpCalculationDynamic[index]["Avg_Load_BTU"] -
          ashpCalculationDynamic[index]["Avg_Capacity_BTU"];
      } else if (
        ashpCalculationDynamic[index].OAT_Min_incl > 65 &&
        ashpCalculationDynamic[index]["Avg_Load_BTU"] <
          ashpCalculationDynamic[index]["Avg_Capacity_BTU"]
      ) {
        ashpCalculationDynamic[index]["Avg_Load_Deficit_BTU"] =
          ashpCalculationDynamic[index]["Avg_Load_BTU"] -
          ashpCalculationDynamic[index]["Avg_Capacity_BTU"];
      } else {
        ashpCalculationDynamic[index]["Avg_Load_Deficit_BTU"] = 0;
      }

      ashpCalculationDynamic[index]["Ashp_Load_BTU"] =
        (ashpCalculationDynamic[index]["Avg_Load_BTU"] -
          ashpCalculationDynamic[index]["Avg_Load_Deficit_BTU"]) *
        ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin;

      ashpCalculationDynamic[index]["Load_Deficit_BTU"] =
        ashpCalculationDynamic[index]["Avg_Load_Deficit_BTU"] *
        ashpCalculationDynamic[index].No_of_Hours_per_OAT_bin;
    }
    return ashpCalculationDynamic;
  };
  const getLoadAshpDynamictable = (ashpCalculationDynamic: any) => {
    let loadAshpDynamicTable: any = [];
    let switchOvers = 0;
    const measureCoolingCostFuel = (measureCoolLoad / (adjustedSEER/3.412142))/ 3412.142 * measureElectricRateAllPropane;

    for (let index = 0; index < ashpCalculationDynamic.length; index++) {
      const element = ashpCalculationDynamic[index];
      switchOvers += 5;
      if (switchOvers < 65) {
        let c74: number = 0;
        let d74: number = 0;
        let e74: number = 0;
        let sumForConservative: number = 0;
        let f74: number = 0;
        let sumForMedian: number = 0;
        let g74: number = 0;
        let sumForOptmistic: number = 0;
        let k74: number = 0;
        let sumForHeatLoadIntensity: number = 0;
        let v74: number = 0;
        let sumForCoolLoadIntensity: number = 0;
        let w74: number = 0;
        let sumOfBinHeatingLoadBTU: number = 0;
        let sumCoolLoadBTU: number = 0;
        for (let index = 0; index < ashpCalculationDynamic.length; index++) {
          const elementInner = ashpCalculationDynamic[index];
          let checkLoadDeficit = ashpCalculationDynamic.filter((ele: any) => {
            return ele.OAT_Min_incl === switchOvers;
          });
          if (
            elementInner.OAT_Min_incl >= switchOvers &&
            elementInner.OAT_Min_incl < 65 &&
            checkLoadDeficit[0].Load_Deficit_BTU === 0
          ) {
            c74 += elementInner.Bin_Heating_Load_BTU;
          }
          if (
            elementInner.OAT_Min_incl >= switchOvers &&
            elementInner.OAT_Min_incl < 65
          ) {
            sumOfBinHeatingLoadBTU += elementInner.Bin_Heating_Load_BTU;
          }
          if (
            elementInner.OAT_Min_incl < switchOvers &&
            checkLoadDeficit[0].Load_Deficit_BTU === 0
          ) {
            d74 += elementInner.Bin_Heating_Load_BTU;
          }
          if (
            elementInner.OAT_Min_incl >= switchOvers &&
            elementInner.OAT_Min_incl < 65
          ) {
            sumForConservative +=
              elementInner.Conservative_COP * elementInner.Bin_Heating_Load_BTU;
            sumForMedian +=
              elementInner.Median_COP * elementInner.Bin_Heating_Load_BTU;
            sumForOptmistic +=
              elementInner.Optimistic_COP * elementInner.Bin_Heating_Load_BTU;
            sumForHeatLoadIntensity +=
              elementInner.NREL_CAMBIUM_CO2_Intensity *
              elementInner.Bin_Heating_Load_BTU;
          }
          if (
            elementInner.OAT_Min_incl >= 65 &&
            elementInner.OAT_Min_incl < 90
          ) {
            sumForCoolLoadIntensity +=
              elementInner.NREL_CAMBIUM_CO2_Intensity *
              elementInner.Bin_Cooling_Load;
            sumCoolLoadBTU += elementInner.Bin_Cooling_Load;
          }

          if (
            elementInner.OAT_Min_incl >= switchOvers &&
            elementInner.OAT_Min_incl < 90
          ) {
            k74 += elementInner.Standby_Energy_Kwh;
          }
        }
        e74 = sumForConservative / sumOfBinHeatingLoadBTU;

        f74 = sumForMedian / sumOfBinHeatingLoadBTU;
        g74 = sumForOptmistic / sumOfBinHeatingLoadBTU;
        // h74
        let AshpAnnualKwhConservative =
          c74 / e74 / 3412.142 +
          measureCoolLoad / (adjustedSEER / 3.412142) / 3412.42;
        // i74
        let AshpAnnualKwhMedian =
          c74 / f74 / 3412.142 +
          measureCoolLoad / (adjustedSEER / 3.412142) / 3412.42;
        // j74
        let AshpAnnualKwhOptimistc =
          c74 / g74 / 3412.142 +
          measureCoolLoad / (adjustedSEER / 3.412142) / 3412.42;
        let m74 = d74 / measureBackupEfficiencyGasPropane / 10 ** 6;
        let n74 = 0;
        let O74 =
          heatingFuel === "Electricity"
            ? 0
            : baselineHeatLoad / baseAFUE / 10 ** 6;
        let p74 = 0;
        let q74 = baselineCoolLoad / (SEER_None / 3.412142) / 3412.142;
        let l74 =
          ((O74 * 10 ** 6 + p74 * 3412.142) * fanEnergyBaseline) / 3412.142;
        let r74 =
          (l74 + q74 + p74) * measureElectricRateAllNaturalGas +
          O74 * gasOrPropaneMMBTU;
        let s74 =
          (n74 + AshpAnnualKwhConservative + k74) *
            measureElectricRateAllPropane +
          m74 * gasOrPropaneMMBTU;
        let t74 =
          (n74 + AshpAnnualKwhMedian + k74) * measureElectricRateAllPropane +
          m74 * gasOrPropaneMMBTU;
        let u74 =
          (n74 + AshpAnnualKwhOptimistc + k74) * measureElectricRateAllPropane +
          m74 * gasOrPropaneMMBTU;
        v74 = sumForHeatLoadIntensity / sumOfBinHeatingLoadBTU;
        w74 = sumForCoolLoadIntensity / sumCoolLoadBTU;
        let x74 = (measureCoolLoad / (adjustedSEER / 3.412142)) * w74;
        let y74 =
          (n74 + AshpAnnualKwhConservative + k74) * 3412.142 * v74 +
          m74 * baselineFuelEmissionIntensity * 10 ** 6 +
          x74;

        // Electric Cost only
        k74 = ducts === "No" ? 0 : k74;
        let electricBaslineCost =
          (l74 + p74) * measureElectricRateAllNaturalGas;
        let electricConservativeCost =
          ((n74 + AshpAnnualKwhConservative + k74) *
          measureElectricRateAllPropane)- measureCoolingCostFuel;
        let electricMedianCost =
          ((n74 + AshpAnnualKwhMedian + k74) * measureElectricRateAllPropane)-measureCoolingCostFuel;
        let electricOptimisticCost =
          ((n74 + AshpAnnualKwhOptimistc + k74) * measureElectricRateAllPropane)-measureCoolingCostFuel;

        // Electric Costs End....
        let z74 =
          (n74 + AshpAnnualKwhMedian + k74) * 3412.142 * v74 +
          m74 * baselineFuelEmissionIntensity * 10 ** 6 +
          x74;
        let aa74 =
          (n74 + AshpAnnualKwhOptimistc + k74) * 3412.142 * v74 +
          m74 * baselineFuelEmissionIntensity * 10 ** 6 +
          x74;
        let ab74 =
          (l74 + p74) * 3412.142 * heatWeightedLoadIntensityKgco2Electric +
          O74 * 10 ** 6 * baselineFuelEmissionIntensity +
          q74 * 3412.142 * w74;
        let dynamicData = {
          Switchovers: switchOvers,
          AshpHeatBTU: c74,
          BackupHeatBTU: d74,
          LoadWeightedCopConservative: e74,
          LoadWeightedCopMedian: f74,
          LoadWeightedCopOptimistic: g74,
          AshpAnnualKwhConservative,
          AshpAnnualKwhMedian,
          AshpAnnualKwhOptimistc,
          MeasureStandbyKwh: k74,
          BackupGasPropaneMMBTU: m74,
          BackupElectricKwh: n74,
          BaslineGasPropaneMMBTU: O74,
          BaselineElectricHeatKwh: p74,
          BaselineCoolingKwh: q74,
          BaselineFanSavingsKwh: l74,
          BaselineCost: r74,
          MeasureCostConservative: s74,
          MeasureCostMedian: t74,
          MeasureCostOptimistic: u74,
          HeatLoadWeightedIntensityKgco2BTU: v74,
          CoolLoadWeightedIntensityKgco2BTU: w74,
          MeasureCoolingEmissionKgco2: x74,
          EmissionKgco2Conservative: y74,
          EmissionKgco2Median: z74,
          EmissionKgco2Optimistic: aa74,
          EmissionKgco2Baseline: ab74,
          measureCoolingCost: measureCoolingCostFuel,
          electricBaslineCost,
          electricConservativeCost,
          electricMedianCost,
          electricOptimisticCost,
        };
        loadAshpDynamicTable.push(dynamicData);
      }
    }
    return loadAshpDynamicTable;
  };
  const getImpactHeatingFuelDynamicTable = (loadAshpDynamicTable: any) => {
    let impactHeatingFuelDynamictable: any = [];
    for (let index = 0; index < loadAshpDynamicTable.length; index++) {
      const element = loadAshpDynamicTable[index];
      const filterFromLoadAshp = loadAshpDynamicTable.filter((ele: any) => {
        return ele.Switchovers === element.Switchovers;
      });
      let emissionSavingConservative;
      let emissionSavingMedian;
      let emissionSavingOptimistic;

      if (filterFromLoadAshp.length > 0) {
        emissionSavingConservative =
          (filterFromLoadAshp[0].EmissionKgco2Baseline -
            filterFromLoadAshp[0].EmissionKgco2Conservative) *
          lifeInYears;
        emissionSavingMedian =
          (filterFromLoadAshp[0].EmissionKgco2Baseline -
            filterFromLoadAshp[0].EmissionKgco2Median) *
          lifeInYears;
        emissionSavingOptimistic =
          (filterFromLoadAshp[0].EmissionKgco2Baseline -
            filterFromLoadAshp[0].EmissionKgco2Optimistic) *
          lifeInYears;
      }
      let data = {
        Switchovers: element.Switchovers,
        ImpactConservative:
          heatingFuel === "Electricity"
            ? 0
            : -(element.electricBaslineCost - element.electricConservativeCost),
        ImpactMedian:
          heatingFuel === "Electricity"
            ? 0
            : // : (ducts === "Yes" &&
              //     ductwork === "Yes" &&
              //     element.Switchovers === 5) ||
              //   (ducts === "Yes" &&
              //     ductwork === "Yes" &&
              //     element.Switchovers === 10)
              // ? 0
              -(element.electricBaslineCost - element.electricMedianCost),
        ImpactOptimistic:
          heatingFuel === "Electricity"
            ? 0
            : -(element.electricBaslineCost - element.electricOptimisticCost),
        PaybackConservative: 0,
        PaybackMedian: 0,
        PaybackOptimistic: 0,
        emissionSavingConservative,
        emissionSavingMedian,
        emissionSavingOptimistic,
      };
      let PaybackConservative: number;
      let PaybackMedian: number;
      let PaybackOptimistic: number;
      if (data.ImpactConservative === 0) {
        PaybackConservative = 0;
      } else {
        if (
          data.ImpactConservative < 0 &&
          (AshpCost - CAC_ReplacementCost - ASHP_Rebate) /
            -data.ImpactConservative <
            20
        ) {
          PaybackConservative =
            (AshpCost - CAC_ReplacementCost - ASHP_Rebate) /
            -data.ImpactConservative;
        } else {
          PaybackConservative = 0;
        }
      }
      data.PaybackConservative = PaybackConservative;

      if (data.ImpactMedian === 0) {
        PaybackMedian = 0;
      } else {
        if (
          data.ImpactMedian < 0 &&
          (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -data.ImpactMedian <
            20
        ) {
          PaybackMedian =
            (AshpCost - CAC_ReplacementCost - ASHP_Rebate) / -data.ImpactMedian;
        } else {
          PaybackMedian = 0;
        }
      }
      data.PaybackMedian = PaybackMedian;

      if (data.ImpactOptimistic === 0) {
        PaybackOptimistic = 0;
      } else {
        if (
          data.ImpactOptimistic < 0 &&
          (AshpCost - CAC_ReplacementCost - ASHP_Rebate) /
            -data.ImpactOptimistic <
            20
        ) {
          PaybackOptimistic =
            (AshpCost - CAC_ReplacementCost - ASHP_Rebate) /
            -data.ImpactOptimistic;
        } else {
          PaybackOptimistic = 0;
        }
      }
      data.PaybackOptimistic = PaybackOptimistic;

      impactHeatingFuelDynamictable.push(data);
    }
    return impactHeatingFuelDynamictable;
  };
  const setElectric_PaybackFuel_LiftimeEmission_Values = (
    impactHeatingFuelDynamictable: any,
    emissionSavingConservative: any,
    emissionSavingMedian: any,
    emissionSavingOptimistic: any
  ) => {
    let impactArray: any = [];
    let paybackArray: any = [];
    let savingsArray: any = [];
    let equivalentArray: any = [];

    for (let i = 0; i < impactHeatingFuelDynamictable.length; i++) {
      const ele = impactHeatingFuelDynamictable[i];
      if (ele.Switchovers <= 45) {
        impactArray.push(
          ele.ImpactConservative,
          ele.ImpactMedian,
          ele.ImpactOptimistic
        );
        if (ele.PaybackConservative !== 0) {
          paybackArray.push(ele.PaybackConservative);
        }
        if (ele.PaybackMedian !== 0) {
          paybackArray.push(ele.PaybackMedian);
        }
        if (ele.PaybackOptimistic !== 0) {
          paybackArray.push(ele.PaybackOptimistic);
        }
        savingsArray.push(
          ele.emissionSavingConservative,
          ele.emissionSavingMedian,
          ele.emissionSavingOptimistic
        );
      }
    }
    equivalentArray = savingsArray;
    // impactHeatingFuelDynamictable - Table

    const findAnnualMaxImpactFuel =
      Math.round(Math.max(...impactArray) / 10) * 10;
    const findAnnualMinImpactFuel =
      Math.round(Math.min(...impactArray) / 10) * 10;

    const findMonthlyMaxImpactFuel =
      Math.round(Math.max(...impactArray) / 12 / 10) * 10;
    const findMonthlyMinImpactFuel =
      Math.round(Math.min(...impactArray) / 12 / 10) * 10;
    const annualyDualFuelImpact = `$ ${findAnnualMaxImpactFuel.toLocaleString(
      "en-US"
    )} to $ ${findAnnualMinImpactFuel.toLocaleString("en-US")} per year`;
    setAnnualElectricFuelBillImpact(annualyDualFuelImpact);
    const monthlyDualFuelImpact = `$ ${findMonthlyMaxImpactFuel.toLocaleString(
      "en-US"
    )} to $ ${findMonthlyMinImpactFuel.toLocaleString("en-US")} per month`;
    setMonthlyElectricFuelBillImpact(monthlyDualFuelImpact);

    let noPaybackFuel: any;
    if (heatingFuel === "Electricity") {
      noPaybackFuel = 0;
    } else {
      if (
        Math.round(Math.min(...paybackArray)) === 0 &&
        Math.round(Math.max(...paybackArray)) === 0
      ) {
        noPaybackFuel = "No payback";
      } else {
        if (
          paybackArray.length <= 0 ||
          Math.round(Math.min(...paybackArray)) < 0 ||
          Math.round(Math.max(...paybackArray)) < 0
        ) {
          noPaybackFuel = "No payback";
        } else {
          noPaybackFuel = ` ${Math.round(
            Math.min(...paybackArray)
          ).toLocaleString("en-US")} to ${
            Math.round(Math.max(...paybackArray)) === 0
              ? " > 20 years"
              : `${Math.round(Math.max(...paybackArray)).toLocaleString(
                  "en-US"
                )} years`
          }`;
        }
      }
    }
    setSimplePaybackFuel(noPaybackFuel);
    // setLifeTimeEmissionElectric(lifetimeEmissionElectric);
    let lifetimeEmissionDualFuel = `${
      heatingFuel === "Electricity"
        ? ""
        : `${(Math.round(Math.min(...savingsArray) / 100) * 100).toLocaleString(
            "en-US"
          )} to ${(
            Math.round(Math.max(...savingsArray) / 100) * 100
          ).toLocaleString("en-US")} lbsCO2 avoided`
    }`;
    setLifetimeEmissionFuel(lifetimeEmissionDualFuel);

    equivalentArray.push(
      emissionSavingConservative,
      emissionSavingMedian,
      emissionSavingOptimistic
    );
    const lifetimeEquivalant = `${(
      Math.round(Math.max(...equivalentArray) / 100) * 100
    ).toLocaleString("en-US")} lbsCO2 is equivalent to about ${(
      Math.round(
        (((Math.round(Math.max(...equivalentArray) / 10) * 10 * 1000) / 8887) *
          22) /
          2.20462 /
          100
      ) * 100
    ).toLocaleString("en-US")} miles driven`;
    setLifetimeEmissionEquivalent(lifetimeEquivalant);
  };
  const getGraphData = (impactHeatingFuelDynamictable: any) => {
    const graphArray: any = [];
    let tempSwitch = 5;
    for (let index = 0; index < impactHeatingFuelDynamictable.length; index++) {
      const element = impactHeatingFuelDynamictable.filter((ele: any) => {
        return ele.Switchovers === tempSwitch;
      });
      if (element.length > 0 && element[0].Switchovers <= 45) {
        const data = {
          Switchover: tempSwitch + "° F",
          Bill_Impacts_Annual: element[0].ImpactMedian,
          Bill_Impacts_Monthly: 0,
          SwitchLabel: tempSwitch + "° F",
        };
        data.Bill_Impacts_Monthly = data.Bill_Impacts_Annual / 12;
        data.Bill_Impacts_Monthly = Number(
          data.Bill_Impacts_Monthly.toFixed(2)
        );
        data.Bill_Impacts_Annual = Number(data.Bill_Impacts_Annual.toFixed(2));

        graphArray.push(data);
        tempSwitch += 10;
      }
    }
    setGraphData(graphArray);
  };
  const getDynamicOptionsArray = () => {
    let data: any = [];
    let year: any = [];
    if (homeType === "Manufactured") {
      setSquareFootage("Any");
      setHomeBuilt("Any");
      setDucts("No");
      setDuctwork("No");
      return;
    } else {
      for (let index = 0; index < bdgSummary.length; index++) {
        const element = bdgSummary[index];

        if (element.Unit_Type === homeType) {
          let find = data.find(
            (Item: any) => Item.value === element.Sqft_Range
          );
          let findYear = year.find(
            (Item: any) => Item.value === element.Age_Range
          );
          if (!find) {
            data.push({
              value: element.Sqft_Range,
              label: element.Sqft_Range,
            });
          }
          if (!findYear) {
            year.push({
              value: element.Age_Range,
              label: element.Age_Range,
            });
          }
        }
      }
      let tempSqFootageArray: any = [];
      const fiterSqFootage = bdgSummary.filter((obj: any) => {
        if (obj.Unit_Type === homeType && obj.Age_Range === homeBuilt) {
          tempSqFootageArray.push({
            value: obj.Sqft_Range,
            label: obj.Sqft_Range,
          });
        }
      });
      setSquareFootageArray(tempSqFootageArray);
      setSquareFootage(tempSqFootageArray[0].value);
      setHomeBuilt(year[0].value);
      setHomeBuiltArray(year);
    }
  };

  const getFootageDynamic = () => {
    let tempSqFootageArray: any = [];
    const fiterSqFootage = bdgSummary.filter((obj: any) => {
      if (obj.Unit_Type === homeType && obj.Age_Range === homeBuilt) {
        tempSqFootageArray.push({
          value: obj.Sqft_Range,
          label: obj.Sqft_Range,
        });
      }
    });
    setSquareFootageArray(tempSqFootageArray);
  };
  const plotStackGraphData = (loadAshpDynamicTable: any) => {
    let dataArray: any = [];
    let optimisticArray: any = [];
    let stackGraphArray: any = [];
    for (let i = 0; i < plotDataArray.length; i++) {
      let data = {};
      if (plotDataArray[i] === "AllElectric") {
        let median = measureCostMedian - measureCostOptimistic;
        data = {
          Switchover: plotDataArray[i],
          Optimistic: parseInt(measureCostOptimistic.toFixed(2)),
          Median: parseInt(median.toFixed(2)),
          Conservative: parseInt(
            (measureCostConservative - median - measureCostOptimistic).toFixed(
              2
            )
          ),
          CurrentCosts: parseInt(baselineCost.toFixed(2)),
          SwitchLabel: "All-Electric System",
        };
        optimisticArray.push(measureCostOptimistic.toFixed(2))
        dataArray.push(data);
        stackGraphArray.push(data);
        setStackGraphData((prevData: any) => [...prevData, data]);
      } else {
        if (heatingFuel === "Electricity") {
          data = {
            Switchover: plotDataArray[i],
            Optimistic: 0,
            Median: 0,
            Conservative: 0,
            CurrentCosts: parseInt(baselineCost.toFixed(2)),
            SwitchLabel: plotDataArray[i] + "° F",
          };
          // optimisticArray.push(0)
          stackGraphArray.push(data);
          dataArray.push(data);
        } else {
          const filterData = loadAshpDynamicTable.filter((obj: any) => {
            return plotDataArray[i] === obj.Switchovers;
          });
          if (
            ductwork === "Yes" &&
            // heatingType === "Fossil_Fuel_Furnace" &&
            // ducts === "Yes" &&
            plotDataArray[i] === 5
          ) {
            let median =
              filterData[0].MeasureCostMedian -
              filterData[0].MeasureCostOptimistic;
            data = {
              Switchover: plotDataArray[i],
              Optimistic: 0,
              Median: 0,
              Conservative: 0,
              CurrentCosts: parseInt(baselineCost.toFixed(2)),
              SwitchLabel: plotDataArray[i] + "° F",
            };
            // optimisticArray.push(
            //   filterData[0].MeasureCostOptimistic.toFixed(2)
            // )
            const stackData = {
              Switchover: plotDataArray[i],
              Optimistic: parseInt(
                filterData[0].MeasureCostOptimistic.toFixed(2)
              ),
              Median: parseInt(median.toFixed(2)),
              Conservative: parseInt(
                (
                  filterData[0].MeasureCostConservative -
                  median -
                  filterData[0].MeasureCostOptimistic
                ).toFixed(2)
              ),
              CurrentCosts: parseInt(baselineCost.toFixed(2)),
              SwitchLabel: plotDataArray[i] + "° F",
            };
            dataArray.push(data);
            stackGraphArray.push(stackData);
          } else {
            let median =
              filterData[0].MeasureCostMedian -
              filterData[0].MeasureCostOptimistic;
            data = {
              Switchover: plotDataArray[i],
              Optimistic: parseInt(
                filterData[0].MeasureCostOptimistic.toFixed(2)
              ),
              Median: parseInt(median.toFixed(2)),
              Conservative: parseInt(
                (
                  filterData[0].MeasureCostConservative -
                  median -
                  filterData[0].MeasureCostOptimistic
                ).toFixed(2)
              ),
              CurrentCosts: parseInt(baselineCost.toFixed(2)),
              SwitchLabel: plotDataArray[i] + "° F",
            };
            optimisticArray.push(filterData[0].MeasureCostOptimistic.toFixed(2))
            dataArray.push(data);
            stackGraphArray.push(data);
          }
        }
      }
    }
    const isFind = stackGraphArray.filter((element: any) => {
      // let max = element.Median + element.Optimistic + element.Conservative;
      if (ductwork === "Yes" && element.Switchover === 5)
        return false;
      else
        return element.Optimistic < element.CurrentCosts;
    });
    let avgPerMonth = Math.round(baselineCost - Math.min(...optimisticArray));
    setAvgHeatingCoolingCost(avgPerMonth);
    setValidateStackBar(isFind.length > 0 ? true: false);
    setStackGraphData(dataArray);
  };

  const plotParallelGraphData = (loadAshpDynamicTable: any) => {
    let dataArray: any = [];
    for (let i = 0; i < plotDataArray.length; i++) {
      let data = {};
      if (plotDataArray[i] === "AllElectric") {
        data = {
          Switchover: plotDataArray[i],
          Optimistic: measureCostOptimistic.toFixed(2),
          Median: measureCostMedian.toFixed(2),
          Conservative: measureCostConservative.toFixed(2),
          CurrentCosts: baselineCost.toFixed(2),
          SwitchLabel: "All-Electric System",
        };
        dataArray.push(data);
      } else {
        if (heatingFuel === "Electricity") {
          data = {
            Switchover: plotDataArray[i],
            Optimistic: 0,
            Median: 0,
            Conservative: 0,
            CurrentCosts: baselineCost.toFixed(2),
            SwitchLabel: plotDataArray[i] + "° F",
          };
          dataArray.push(data);
        } else {
          const filterData = loadAshpDynamicTable.filter((obj: any) => {
            return plotDataArray[i] === obj.Switchovers;
          });
          data = {
            Switchover: plotDataArray[i],
            Optimistic: filterData[0].MeasureCostOptimistic.toFixed(2),
            Median: filterData[0].MeasureCostMedian.toFixed(2),
            Conservative: filterData[0].MeasureCostConservative.toFixed(2),
            CurrentCosts: baselineCost.toFixed(2),
            SwitchLabel: plotDataArray[i] + "° F",
          };
          dataArray.push(data);
        }
      }
    }
    setParallelGraphData(dataArray);
  };

  const plotEnvGraphData = (impactHeatingFuelDynamictable: any) => {
    let dataArray: any = [];
    for (let i = 0; i < plotDataArray.length; i++) {
      let data = {};
      if (plotDataArray[i] === "AllElectric") {
        data = {
          Switchover: plotDataArray[i],
          Optimistic: parseInt((emissionSavingOptimistic / 133.333).toFixed(2)),
          SwitchLabel: "All-Electric System",
        };
        dataArray.push(data);
      } else {
        if (heatingFuel === "Electricity") {
          data = {
            Switchover: plotDataArray[i],
            Optimistic: 0,
            SwitchLabel: plotDataArray[i] + "° F",
          };
          dataArray.push(data);
        } else {
          if (
            ductwork === "Yes" &&
            // heatingType === "Fossil_Fuel_Furnace" &&
            // ducts === "Yes" &&
            plotDataArray[i] === 5
          ) {
            data = {
              Switchover: plotDataArray[i],
              Optimistic: 0,
              SwitchLabel: plotDataArray[i] + "° F",
            };
            dataArray.push(data);
          } else {
            const filterData = impactHeatingFuelDynamictable.filter(
              (obj: any) => {
                return plotDataArray[i] === obj.Switchovers;
              }
            );
            data = {
              Switchover: plotDataArray[i],
              Optimistic: parseInt(
                (filterData[0].emissionSavingOptimistic / 133.333).toFixed(2)
              ),
              // X-axis label for Estimated Lifetime Environmental Impacts
              SwitchLabel: plotDataArray[i] + "° F",
            };
            dataArray.push(data);
          }
        }
      }
    }
    setEnvGraphData(dataArray);
  };
  const CustomTooltip = ({ active, payload, label }: any) => {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-text">
          {label === "All-Electric System"
            ? label
            : label + " Switchover Temperature"}{" "}
          <br />
          <span style={{ color: "#000000" }}>
            Up to {Math.round(payload[0]?.value / 5) * 5} trees
          </span>
        </p>
      </div>
    );
  };
  // const CustomLineGraphTooltip = ({ active, payload, label }: any) => {
  //   if (active && payload && payload.length) {
  //     return (
  //       <div className="line-custom-tooltip">
  //         <p className="tooltip-text">
  //           These colors represent high, median and low estimates. See below for
  //           more detail.
  //         </p>
  //       </div>
  //     );
  //   }

  //   return null;
  // };
  const validateDucts = () => {
    if (
      heatingType === "Fossil_Fuel_Furnace" &&
      (coolingType === "Central_AC" ||
        coolingType === "Window_AC" ||
        coolingType === "None")
    ) {
      setDucts("Yes");
    } else if (heatingFuel === "Electricity") {
      setDucts("Yes");
      setReplacingFurnace("No");
    } else if (
      heatingType === "Fossil_Fuel_Boiler" &&
      coolingType === "Central_AC"
    ) {
      setDucts("Yes");
      setDuctwork("No");
      setReplacingFurnace("No");
    } else {
      setDucts("No");
      setDuctwork("No");
      setReplacingFurnace("No");
    }
  };
  const ShowForm = () => {
    window.scrollTo({
      top: 200,
      left: 0,
      behavior: "smooth",
    });
    setFormShow("block");
    setOutputShow("none");
  };
  useEffect(() => {
    getDynamicOptionsArray();
  }, [homeType]);
  useEffect(() => {
    getFootageDynamic();
  }, [homeBuilt]);

  useEffect(() => {
    validateDucts();
  }, [heatingType, coolingType]);

  const seeMore = () => {
    if (hideShowDetail === "none") setHideShowDetail("block");
    else setHideShowDetail("none");
  };
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fontSize={10} textAnchor="end">
          ${payload.value}
        </text>
      </g>
    );
  };
  return (
    <>
      <h1 className="cost-heading" style={{ display: formShow }}>
        Savings Calculator
      </h1>
      <h1 className="cost-heading" style={{ display: outputShow }}>
        Savings Calculator
      </h1>
      <div
        className="mastheadContainer"
        style={{ backgroundImage: `url(${costImage})` }}
      >
        <img src={costImage} alt="ComEd An Exelon Company" />
      </div>

      {outputShow === "none" && (
        <>
          <p>
            This calculator estimates how a heat pump might impact your heating
            and cooling bills. The results show estimated ranges of:
          </p>
          <ul className="results-page-list">
            <li>Your current heating and cooling costs</li>
            <li>Annual and monthly bill changes</li>
            {/* <li>Payback period</li> */}
            <li>Environmental impact</li>
          </ul>
          <p>
            Completing the calculator survey takes about 10 minutes or less.
          </p>
        </>
      )}

      <Form
        layout={"vertical"}
        style={{ padding: "20px 0px", display: formShow }}
      >
        <Row>
          <Col span={24}>
            <Form.Item label="User" hidden={true}>
              <Select
                placeholder="Select a User"
                // value={user}
                defaultValue={user}
                options={[
                  { value: "Homeowner", label: "Homeowner" },
                  { value: "Contractor", label: "Contractor" },
                ]}
                onChange={(value: String) => {
                  setUser(value);
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Do you have a load calculation?" hidden={true}>
              <Select
                placeholder="Select"
                defaultValue={loadCalculation}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                onChange={(value: String) => {
                  setLoadCalculation(value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="What is your home type?"
              style={{ margin: "0px" }}
            >
              <Select
                defaultValue={homeType}
                options={[
                  { value: "Manufactured", label: "Manufactured" },
                  {
                    value: "Single_Family",
                    label: "Single Family",
                  },
                  {
                    value: "Townhome_or_Rowhouse",
                    label: "Townhome or Rowhouse",
                  },
                  {
                    value: "Apartment_or_Condo",
                    label: "Apartment or Condo (2-4 Unit Building)",
                  },
                ]}
                placeholder="Select Home Type"
                onChange={(value) => {
                  setHomeType(value);
                }}
              />
            </Form.Item>
            <p
              style={{
                color: "gray",
                marginTop: "0px",
                fontSize: "12px",
              }}
            >
              This calculator currently does not accommodate buildings with more
              than 4 units.
            </p>
          </Col>
          {homeType !== "Manufactured" && (
            <Col span={24}>
              <Form.Item label="When was your home built?">
                <Select
                  defaultValue={homeBuilt}
                  value={homeBuilt}
                  options={homeBuiltArray}
                  placeholder="Select Home Built"
                  onChange={(value: String) => {
                    setHomeBuilt(value);
                  }}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row>
          {homeType !== "Manufactured" && (
            <Col span={24}>
              <Form.Item
                label="What is your home's estimated square footage?"
                style={{ margin: "0px" }}
              >
                <Select
                  defaultValue={squareFootage}
                  value={squareFootage}
                  options={squareFootageArray}
                  placeholder="Select Home Built"
                  onChange={(value: string) => {
                    setSquareFootage(value);
                  }}
                />
              </Form.Item>
              <p
                style={{
                  color: "gray",
                  marginTop: "0px",
                  fontSize: "12px",
                }}
              >
                Include finished and unfinished square footage.
              </p>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              label="Is your home weatherized?"
              style={{ margin: "0px" }}
            >
              <Select
                defaultValue={weatherized}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                  { value: "I Don't Know", label: "I Don't Know" },
                ]}
                placeholder="Select Home Weatherized"
                onChange={(value) => {
                  setWeatherized(value);
                  if (value === "Yes") {
                    setWeatherizedYesShow("block");
                    setWeatherizedNoShow("none");
                  }
                  if (value === "No" || value === "I Don't Know") {
                    setWeatherizedYesShow("none");
                    setWeatherizedNoShow("block");
                  }
                }}
              />
            </Form.Item>
            <p
              style={{
                color: "gray",
                marginTop: "0px",
                fontSize: "12px",
              }}
            >
              A weatherized home has insulation and air sealing (when cracks,
              gaps and open seams that leak air have been sealed). Insulation
              and air sealing is particularly effective in the walls and attic.
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="What is your current heating fuel?"
              style={{ margin: "0px" }}
            >
              <Select
                defaultValue={heatingFuel}
                options={[
                  {
                    value: "Natural_Gas",
                    label: "Natural Gas",
                  },
                  {
                    value: "Propane",
                    label: "Propane",
                  },
                  {
                    value: "Electricity",
                    label: "Electric Heating",
                  },
                ]}
                placeholder="Select Heating Fuel"
                onChange={(value: String) => {
                  setHeatingFuel(value);
                  if (value === "Propane") {
                    setHeatingTypePropane("acOptionShow");
                    setHeatingTypeNatGas("acOptionHide");
                    setHeatingTypeElectric("acOptionHide");
                  }
                  if (value === "Natural Gas") {
                    setHeatingTypePropane("acOptionHide");
                    setHeatingTypeNatGas("acOptionShow");
                    setHeatingTypeElectric("acOptionHide");
                  }
                  if (value === "Electricity") {
                    setHeatingType("Electricity");
                    setDucts("Yes");
                    setHeatingTypePropane("acOptionHide");
                    setHeatingTypeNatGas("acOptionHide");
                    setHeatingTypeElectric("acOptionShow");
                  } else {
                    setHeatingType("Fossil_Fuel_Furnace");
                  }
                }}
              />
            </Form.Item>
            <p
              style={{
                color: "gray",
                marginTop: "0px",
                fontSize: "12px",
              }}
            >
              If your home has multiple heating sources like a furnace and
              in-floor electric heat, choose the fuel for your most used source.
              The calculator currently does not accommodate other heating fuel
              types.
            </p>
          </Col>
          {heatingFuel !== "Electricity" && heatingFuel !== "Propane" && (
            <Col span={24}>
              <Form.Item label="What is your gas utility?">
                <Select
                  defaultValue={gasUtility}
                  options={[
                    { value: "North_Shore_Gas", label: "North Shore Gas" },
                    { value: "Nicor_Gas", label: "Nicor Gas" },
                    { value: "Peoples_Gas", label: "Peoples Gas" },
                    { value: "Ameren_Illinois", label: "Ameren Illinois" },
                  ]}
                  placeholder="Select Gas Utility"
                  onChange={(value: String) => {
                    setGasUtility(value);
                  }}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row>
          {heatingFuel !== "Electricity" && (
            <Col span={24}>
              <Form.Item label="What do you mainly use for heating?">
                <Select
                  defaultValue={heatingType}
                  value={heatingType}
                  options={[
                    {
                      value: "Fossil_Fuel_Furnace",
                      label: "Fossil Fuel Furnace",
                    },
                    {
                      value: "Fossil_Fuel_Boiler",
                      label: "Fossil Fuel Boiler",
                    },
                    // {
                    //   value: "Electric_Heating",
                    //   label: "Electric Heating",
                    // },
                  ]}
                  placeholder="Select Heating Type"
                  onChange={(value: String) => {
                    setHeatingType(value);
                  }}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item label="What do you mainly use for cooling?">
              <Select
                defaultValue={coolingType}
                options={[
                  { value: "Central_AC", label: "Central AC" },
                  { value: "Window_AC", label: "Window AC" },
                  { value: "None", label: "None" },
                ]}
                placeholder="Select Cooling Type"
                onChange={(value: String) => {
                  setCoolingType(value);
                  if (value === "None") {
                    setCoolingTypeNone("acOptionShow");
                    setCoolingTypeAC("acOptionHide");
                  }
                  if (value === "Central_AC" || value === "Window_AC") {
                    setCoolingTypeNone("acOptionHide");
                    setCoolingTypeAC("acOptionShow");
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={24}
            style={{
              display:
                (coolingType === "Window_AC" || coolingType === "None") &&
                heatingFuel === "Electricity"
                  ? ""
                  : "none",
            }}
          >
            <Form.Item label="Do you have ductwork?" style={{ margin: "0px" }}>
              <Select
                defaultValue={ducts}
                value={ducts}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                placeholder="Ducts"
                onChange={(value: String) => {
                  setDucts(value);
                  if (value === "No") {
                    setDuctwork("No");
                  }
                }}
              />
            </Form.Item>
            <p
              style={{
                color: "gray",
                marginTop: "0px",
                fontSize: "12px",
              }}
            >
              Ductwork delivers conditioned air through your home. If you see
              air grates in rooms, you have ductwork.
            </p>
          </Col>
          {ducts === "Yes" && (
            <Col span={24}>
              <Form.Item
                label="Does your ductwork run through an unconditioned attic or crawlspace?"
                style={{ margin: "0px" }}
              >
                <Select
                  defaultValue={ductwork}
                  value={ductwork}
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                    { value: "I Don't Know", label: "I Don't Know" },
                  ]}
                  placeholder="Ductwork"
                  onChange={(value: String) => {
                    setDuctwork(value);
                  }}
                />
              </Form.Item>
              <p
                style={{
                  color: "gray",
                  marginTop: "0px",
                  fontSize: "12px",
                }}
              >
                Unconditioned spaces are not directly heated or cooled. Their
                temperature may be significantly higher or lower than the living
                areas of your home depending on the season.
              </p>
            </Col>
          )}
        </Row>
        <Row>
          {heatingType === "Fossil_Fuel_Furnace" && (
            <Col span={24}>
              <Form.Item label="Are you replacing your furnace?">
                <Select
                  defaultValue={replacingFurnace}
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                  placeholder="Replacing furnace"
                  onChange={(value: String) => {
                    setReplacingFurnace(value);
                  }}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={24} style={{ display: "none" }}>
            <Form.Item label="Do you have a contractor bid?">
              <Select
                defaultValue={contractorBid}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                placeholder="Contractor bid"
                onChange={(value: String) => {
                  setContractorBid(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ display: "none" }}>
            <Form.Item label="Do you know the SEER rating of the quoted heat pump?">
              <Select
                defaultValue={seerRating}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                placeholder="SEER rating"
                onChange={(value: String) => {
                  setSeerRating(value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        {contractorBid === "Yes" && (
          <>
            <Row>
              <Col span={24} style={{ display: "none" }}>
                <Form.Item
                  label="What was the total price of the bid?"
                  style={{ margin: "0px" }}
                >
                  <Input
                    placeholder="Total price of bid."
                    value={prevTotalPrice}
                    onChange={(e: any) => {
                      setPrevTotalPrice(e.target.value);
                    }}
                  />
                </Form.Item>
                <p
                  style={{
                    color: "gray",
                    marginTop: "0px",
                    fontSize: "12px",
                  }}
                >
                  The bid amount should be the final cost that includes parts
                  and labor. If you had multiple equipment options quoted,
                  choose one for the calculator.
                </p>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ display: "none" }}>
                <Form.Item
                  label="Does the bid include any deductions from rebates or tax credits?"
                  style={{ margin: "0px" }}
                >
                  <Select
                    defaultValue={rebatesTax}
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    placeholder="Rebates deduction tax"
                    onChange={(value: String) => {
                      setRebatesTax(value);
                    }}
                  />
                </Form.Item>
                <p
                  style={{
                    color: "gray",
                    marginTop: "0px",
                    fontSize: "12px",
                  }}
                >
                  Rebates could be from the heat pump manufacturer or the
                  federal Inflation Reduction Act. Tax credits could be from the
                  federal 25C tax credit.
                </p>
              </Col>
            </Row>
          </>
        )}
        {rebatesTax === "No" && (
          <>
            <Row>
              <Col span={24} style={{ display: "none" }}>
                <Form.Item
                  label="Do you know of state or federal rebates or tax credits you qualify for, even if they were not written in a bid?"
                  style={{ margin: "0px" }}
                >
                  <Select
                    defaultValue={rebatesTaxQualify}
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                    placeholder="Rebates tax"
                    onChange={(value: String) => {
                      setRebatesTaxQualify(value);
                    }}
                  />
                </Form.Item>
                <p
                  style={{
                    color: "gray",
                    marginTop: "0px",
                    fontSize: "12px",
                  }}
                >
                  Rebates through the federal Inflation Reduction Act are income
                  qualified. Households earning more than 150% of the Area
                  Median Income are not eligible for these rebates. The 25C tax
                  credit is available for all taxpayers. There may be additional
                  local or state rebates you may qualify for.
                </p>
              </Col>
            </Row>
            {rebatesTaxQualify === "Yes" && (
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Enter the total rebate and tax credit amount."
                    style={{ margin: "0px", display: "none" }}
                  >
                    <Input
                      placeholder="Total price of bid."
                      value={taxRebatsAndCreditsTotal}
                      onChange={(e: any) => {
                        setTaxRebatsAndCreditsTotal(e.target.value);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </>
        )}

        <Row>
          <Col span={24}>
            <Form.Item
              className="qualityForRebates"
              label="Qualify for rebates?"
            >
              <Select
                defaultValue={qualifyRebates}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                placeholder="Qualify rebates"
                onChange={(value: String) => {
                  setQualifyRebates(value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ marginTop: "20px" }}>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      {annualBillCost && (
        <div
          className="output-data"
          style={{ display: outputShow, margin: "20px" }}
        >
          <h2 className="outputResultHeading">Results</h2>

          {validateStackBar && (
            <div>
              <p>
              Based on your inputs, you could save up to:
            </p>

            <h2 className="averageCost">${avgHeatingCoolingCost} per year</h2>
            </div>
          )}

          {!validateStackBar && (
            <>
              <p>
                <em>
                  We estimate you will not save at this time on your heating and
                  cooling costs by installing a heat pump.
                </em>
              </p>
              <p>Please keep these considerations in mind:​ </p>
              <ul className="results-page-list">
                <li>
                  <strong>Heat pumps offer environmental benefits</strong>,
                  including reduced CO2 emissions. Refer to the Estimated
                  Lifetime Environmental Impacts graph for more information.
                </li>
                <li>
                  <strong>Weatherization is strongly recommended</strong> prior
                  to switching to a heat pump. Weatherization helps to reduce
                  energy waste by up to 15%<sup>†</sup>, and can also help lower your energy
                  bill as a result. Scroll to the bottom of this page to learn
                  more.
                </li>
                <li>
                  <strong>
                    Reach out to the ComEd Energy Efficiency Program team
                  </strong>{" "}
                  to learn more about why your energy costs are expected to
                  increase, and if there are options available to lower these
                  costs. Click{" "}
                  <a
                    target="_blank"
                    href=" https://www.comed.com/WaystoSave/ToolsResources/Pages/EnergyDoctor.aspx?utm_source=Res&utm_medium=Website&utm_campaign=EnergyDoctor&utm_content=VanityURL%22%20\t%20%22_blank"
                  >
                    here
                  </a>{" "}
                  to contact the program team or call 855-433-2700 to speak with
                  a representative.
                </li>
                <li>
                  <strong>Remember to check back again in 6 months</strong>, as
                  energy prices and other factors may change over time.
                </li>
                <li>
                  <strong>Save energy and money</strong> by taking advantage of
                  ComEd's other offerings and tools for your home. Click{" "}
                  <a
                    target="_blank"
                    href="https://www.comed.com/WaysToSave/ForYourHome/"
                  >
                    here{" "}
                  </a>
                  for more information or call 855-433-2700 to speak with a
                  representative.
                </li>
              </ul>
            </>
          )}

          <p>
            The following graphs show the estimated change on the heating and
            cooling portion of your bill and the environmental impact that you
            could make after installing a heat pump. This calculator compares
            your total current heating and cooling costs to your heating and
            cooling costs after a heat pump installation.
          </p>
          <p>
            Depending on the type of heat pump you choose and its setup, your
            total annual heating and cooling costs are estimated below. In
            addition, the environmental impacts of making the change from your
            existing system to the new heat pump system for the lifetime of that
            system is also provided.{" "}
          </p>

          <Row className="outputRow">
            <Col className="outputColumn" span={12}>
              <h2 className="page-heading">
                Estimated Annual Heating and Cooling Costs
              </h2>

              <>
                <div>
                  <div className="bar-chart-wrapper">
                    <ComposedChart
                      width={500}
                      height={300}
                      data={stackGraphData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="SwitchLabel" tick={{ fontSize: 10 }} />
                      <YAxis
                        label={<AnnualLabelB />}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(tick) => `$${tick}`}
                      />
                      {/* <Tooltip content={<CustomLineGraphTooltip />} /> */}
                      <Legend />

                      <Bar
                        dataKey="Optimistic"
                        stackId="a"
                        fill="#6e07c1"
                        barSize={45}
                      />
                      <Bar
                        dataKey="Median"
                        stackId="a"
                        fill="#3a5cff"
                        barSize={45}
                      />
                      <Bar
                        dataKey="Conservative"
                        stackId="a"
                        fill="#170d67"
                        barSize={45}
                      />

                      <Line
                        type="monotone"
                        dataKey="CurrentCosts"
                        stroke="#ffc51c"
                        fill="#ffc51c"
                        strokeWidth={4}
                      />
                    </ComposedChart>
                    <p className="graph-x-axis">
                      Dual-Fuel System Switchover Temperature
                    </p>
                  </div>
                </div>
              </>

              {/* <p className="graphDetailHeading" onClick={seeMore}>
                See More Details
              </p> */}
              <ul
                className="graphDetailLists"
                // style={{ display: hideShowDetail }}
              >
                <li className="liYellow">
                  <span>Current annual costs</span>
                </li>
                <li className="liBlack">
                  <span>
                    Conservative: 20% of customers in a similar home may see
                    bills like this or higher.{" "}
                  </span>
                </li>
                <li className="liBlue">
                  <span>
                    Median: 50% of customers in a similar home may see bills in
                    this range.{" "}
                  </span>
                </li>
                <li className="liPurple">
                  <span>
                    Optimistic: 20% of customers in a similar home may see bills
                    like this or lower.{" "}
                  </span>
                </li>
              </ul>
              <p className="graphDisclaimer">
              The three colors represent a range of system performance estimates, and the yellow line represents your current energy costs. A system that is appropriately sized and properly installed in a well-sealed and weatherized home will have lower energy costs.
              </p>
            </Col>
            <Col className="outputColumn" span={12}>
              <h2 className="page-heading">
                Estimated Lifetime Environmental Impacts
              </h2>

              <>
                <div>
                  <div className="bar-chart-wrapper">
                    <BarChart
                      width={500}
                      height={300}
                      data={envGraphData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="SwitchLabel" tick={{ fontSize: 10 }} />
                      <YAxis
                        dataKey={"Optimistic"}
                        label={<MonthlyLabelB />}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <Legend />
                      <Bar dataKey="Optimistic" fill="#00E4A5" barSize={45} />
                    </BarChart>
                    <p className="graph-x-axis">
                      Dual-Fuel System Switchover Temperature
                    </p>
                  </div>
                </div>
              </>
            </Col>
          </Row>
          <p>
            Every home is unique, and your actual results may vary depending on:{" "}
          </p>
          <ul className="results-page-list ">
            <li>The heat pump model you select </li>
            <li>System design and installation </li>
            <li>
              The switchover temperature (if installing a dual-fuel heat pump
              system){" "}
            </li>
            <li>Your gas and electric utility rates </li>
            <li>Available incentives (local, state, federal and utility)</li>
          </ul>
          <p>
            Energy prices fluctuate and as the price of fossil fuels rises, the
            cost savings of a heat pump can increase. If you're not seeing the
            results you want, keep checking back to see how a heat pump system
            may work for you in the future. In addition, a qualified ComEd
            Energy Efficiency Service Provider (EESP) can help you determine the
            most likely scenario for your home and how you can improve your
            system performance to lower your future bills.
          </p>
          <p>
            Click{" "}
            <a
              target="_blank"
              href="https://comed2.my.salesforce-sites.com/HHC"
            >
              here
            </a>{" "}
            to find an EESP near you!
          </p>
          {/* <p>
            Energy prices fluctuate and as the price of fossil fuels rise, the
            cost savings of a heat pump can increase. If you're not seeing the
            results you want, keep checking back to see how a heat pump system
            may work for you in the future.
          </p>
          <p>
            These graphs show the estimated* change on the{" "}
            <strong>heating and cooling portion of your bill</strong> and the
            environmental impact that you could make after installing a heat
            pump. This calculator compares your total current heating and
            cooling costs to your heating and cooling costs after a heat pump
            installation.{" "}
          </p> */}
          {/* <p>
            Every home is unique, and your actual results may vary depending on:
          </p>
          <p>
            A qualified ComEd Energy Efficiency Service Provider (EESP) can help
            select the best system for your home and goals.{" "}
          </p> */}

          <h2 className="page-heading">About Your Results</h2>
          <p>
            These results are an estimate of the potential changes to the
            heating and cooling portion of your energy bills after installing a
            heat pump. Actual results may vary.
          </p>

          <Row style={{ margin: "10px 0px" }}>
            <Col span={11}>
              <div className="simple-payback-info">
                <h3 className="page-heading">All-Electric Heat Pump Option</h3>
                <p>
                  An all-electric system is a heat pump-only solution. No fossil
                  fuel system is involved.{" "}
                </p>
                <p>
                  If you already have an electric heating system and upgrade to
                  a heat pump, your electricity costs will likely decrease. If
                  you switch from a fossil fuel system to an all-electric heat
                  pump system, your gas heating costs will be eliminated while
                  your electric bill will increase. This is because you are
                  increasing your use of electricity to provide all your heating
                  and cooling needs.
                </p>
              </div>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <div className="simple-payback-info">
                <h3 className="page-heading">Dual-Fuel Heat Pump Option</h3>
                <p>
                  A dual-fuel heat pump system involves a heat pump paired with
                  a fossil fuel back-up heating system.{" "}
                </p>
                <p>
                  If you select a dual-fuel heat pump system, your gas bill will
                  likely decrease while your electric bill will likely increase.
                  This is due to decreasing how much of your heating is provided
                  by gas and increasing how much is provided through
                  electricity.
                </p>
                <p>
                  The chart above shows your total heating and cooling costs
                  based on the temperature at which you switch from the heat
                  pump to the fossil fuel system (the switchover temperature).{" "}
                </p>
              </div>
            </Col>
          </Row>

          <h2 className="page-heading">
            Monthly Electric Heating and Cooling Costs
          </h2>
          <p>
            Depending on the type of heat pump system you choose, your monthly
            electric heating and cooling cost changes are estimated below.
          </p>
          <Row style={{ margin: "10px 0px" }}>
            <Col span={11}>
              <div className="average-month">
                <h3 className="page-heading">Average Summer Cooling Month</h3>
                <p className="avg-parent">
                  <span className="avg-values">
                    <img
                      className="downImage"
                      src={avgCoolingFrom < 0 ? downIcon : upIcon}
                      alt="Icon Image"
                    />{" "}
                    {avgSummer}{" "}
                    <img
                      className="downImage"
                      src={avgCoolingTo < 0 ? downIcon : upIcon}
                      alt="Icon Image"
                    />
                  </span>
                </p>

                <p className={coolingTypeAC}>
                  You'll likely save on cooling because heat pumps are more
                  efficient than your current system.
                </p>
                <p className={coolingTypeNone}>
                  Heat pumps provide the option to cool, allowing you to be more
                  comfortable in the summer. If you regularly use your heat pump
                  for cooling, we estimate your electric cooling costs will
                  increase about this much.
                </p>
              </div>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <div className="average-month">
                <h3 className="page-heading">Average Winter Heating Month</h3>
                <p className="avg-parent">
                  <span className="avg-values">
                    <img
                      className="downImage"
                      src={avgHeatFrom < 0 ? downIcon : upIcon}
                      alt="Icon Image"
                    />{" "}
                    {avgWinter}{" "}
                    <img
                      className="downImage"
                      src={avgHeatTo < 0 ? downIcon : upIcon}
                      alt="Icon Image"
                    />
                  </span>
                </p>
                <p className={heatingTypeNatGas}>
                  Depending on your switchover temperature, your electric
                  heating costs may increase.
                </p>
                <p className={heatingTypePropane}>
                  Depending on your switchover temperature, your electric
                  heating costs may increase.
                </p>
                <p className={heatingTypeElectric}>
                  You’ll likely save on heating because heat pumps are more
                  efficient than your current system.
                </p>
              </div>
            </Col>
          </Row>

          <h2 className="page-heading">Weatherization</h2>
          <div style={{ display: weatherizedYesShow }}>
            <p>
              Congratulations! You've already taken an important step in
              improving your home's comfort and reducing your energy costs by
              weatherizing your home. Switching to a heat pump HVAC system can
              be a great next step to reducing your energy use even more.{" "}
            </p>
          </div>

          <div style={{ display: weatherizedNoShow }}>
            <p>
              Weatherizing your home is a great first step to increase your
              comfort and reduce your energy costs before installing a more
              efficient heat pump system. Weatherization typically includes
              insulating and air sealing your attic and walls and sealing air
              leaks in your ducts. This can enhance your home comfort, keeping
              your home cooler in the summer and warmer in the winter. It will
              reduce the size required for a new heat pump, which will save you
              money, and it can also reduce energy waste by up to 15%<sup>†</sup>, which can
              further lower your energy costs and save you money.{" "}
            </p>
            <p>
              A qualifying Energy Efficiency Service Provider (EESP) can help
              you take the most effective weatherization steps for your home.
              Click{" "}
              <a href="https://comed2.my.salesforce-sites.com/HHC">here</a> to
              find an EESP near you!{" "}
            </p>
          </div>
          <br />
          <Button type="primary" onClick={ShowForm} style={{ margin: "10px" }}>
            Back to Calculator
          </Button>

          <p className="foot">
            <sup>†</sup>
            <a href=" https://www.energystar.gov/saveathome/seal_insulate/methodology">
              Methodology for Estimated Energy Savings from Cost-Effective Air
              Sealing and Insulating
            </a>
          </p>
        </div>
      )}
    </>
  );
}

const AnnualLabelB = () => {
  return (
    <Text
      x={15}
      y={-20}
      dx={-300}
      dy={40}
      textAnchor="start"
      width={280}
      transform="rotate(-90)"
      className="graph-y-axis"
      fontSize={8}
      fontWeight={600}
      fill="#555"
    >
      Estimated Heating and Cooling Costs
    </Text>
  );
};

const MonthlyLabelB = () => {
  return (
    <Text
      x={0}
      y={-20}
      dx={-300}
      dy={52}
      textAnchor="start"
      width={300}
      transform="rotate(-90)"
      className="graph-y-axis"
      fontSize={8}
      fontWeight={600}
      fill="#555"
    >
      Number of Trees Planted and Grown for 10 Years (CO2 Reduction Equivalent)
    </Text>
  );
};
