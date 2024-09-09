import axios from 'axios';
import { useEffect, useState } from 'react';

import apiRoot from '@/config/apiRoot';
import { Scenario } from '@/types/model/Scenario';

export const SCENARIO_MACROS = {
  TYPE_FLOW: 1,
  TYPE_UNSAT: 2,
  TYPE_LOAD: 3,
  TYPE_WELLTYPE: 4,
};

export interface ScenarioResponse {
  results: Scenario[];
}

/**
 * react hook that is used to get different scenario groups
 */
export const useScenarioGroups = () => {
  const [flowScenarios, setFlowScenarios] = useState<Scenario[]>([]);
  const [loadScenarios, setLoadScenarios] = useState<Scenario[]>([]);
  const [unsatScenarios, setUnsatScenarios] = useState<Scenario[]>([]);
  const [welltypeScenarios, setWelltypeScenarios] = useState<Scenario[]>([]);

  const getScenarios = (
    type: number,
    callback: (res: ScenarioResponse) => void,
  ) => {
    axios
      .get<ScenarioResponse, any>(`${apiRoot}/api/scenario/`, {
        params: {
          scenario_type: type,
        },
      })
      .then((res) => {
        callback(res.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getScenarios(SCENARIO_MACROS.TYPE_FLOW, (response: ScenarioResponse) =>
      setFlowScenarios(response.results),
    );
    getScenarios(SCENARIO_MACROS.TYPE_LOAD, (response: ScenarioResponse) =>
      setLoadScenarios(response.results),
    );
    getScenarios(SCENARIO_MACROS.TYPE_UNSAT, (response: ScenarioResponse) =>
      setUnsatScenarios(response.results),
    );
    getScenarios(SCENARIO_MACROS.TYPE_WELLTYPE, (response: ScenarioResponse) =>
      setWelltypeScenarios(response.results),
    );
  }, []);

  return {
    flowScenarios,
    loadScenarios,
    unsatScenarios,
    welltypeScenarios,
  };
};
