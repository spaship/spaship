import { useCallback, useState, useEffect } from "react";
import { IConfig } from "../config";

const configsKey = "spaship-configs";

const useConfig = () => {
  const [environments, setEnvironments] = useState<IConfig[]>((window as any).SPAship.environments);

  const setConfigsSyncWithLocalStorage = useCallback((newConfigs: IConfig[]) => {
    try {
      localStorage.setItem(configsKey, JSON.stringify(newConfigs));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const setSPAshipConfigs = useCallback(
    (newConfigs: IConfig[]) => {
      setEnvironments(newConfigs);
      setConfigsSyncWithLocalStorage(newConfigs);
    },
    [setEnvironments, setConfigsSyncWithLocalStorage]
  );

  const setSelectedName = useCallback(
    (configName: string) => {
      const selectedConfig = environments.find((conf) => conf.name === configName);
      if (selectedConfig) {
        selectedConfig.selected = true;
        const otherConfigs = environments
          .filter((conf) => conf.name !== configName)
          .map((conf) => ({ ...conf, selected: false }));
        const newConfigs = [...otherConfigs, selectedConfig];
        setSPAshipConfigs(newConfigs);
      }
    },
    [environments, setSPAshipConfigs]
  );

  useEffect(() => {
    try {
      const localStorageConfigs = localStorage.getItem(configsKey);
      if (localStorageConfigs !== null) {
        setEnvironments(JSON.parse(localStorageConfigs));
      }
    } catch (err) {
      console.error(err);
    }
  }, [setEnvironments]);

  useEffect(() => {});

  const selected = environments.find((conf) => conf.selected === true);

  return {
    configs: environments,
    selected,
    setSPAshipConfigs,
    setSelectedName,
  };
};

export default useConfig;
