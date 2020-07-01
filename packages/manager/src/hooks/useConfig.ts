import { useCallback, useState, useEffect } from "react";
import { IConfig } from "../config";

const configsKey = "spaship-configs";

const useConfig = () => {
  const [configs, setConfigs] = useState<IConfig[]>((window as any).SPAship.configs);

  const setConfigsSyncWithLocalStorage = useCallback((newConfigs: IConfig[]) => {
    try {
      localStorage.setItem(configsKey, JSON.stringify(newConfigs));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const setSPAshipConfigs = useCallback(
    (newConfigs: IConfig[]) => {
      setConfigs(newConfigs);
      setConfigsSyncWithLocalStorage(newConfigs);
    },
    [setConfigs, setConfigsSyncWithLocalStorage]
  );

  const setSelectedName = useCallback(
    (configName: string) => {
      const selectedConfig = configs.find((conf) => conf.name === configName);
      if (selectedConfig) {
        selectedConfig.selected = true;
        const otherConfigs = configs
          .filter((conf) => conf.name !== configName)
          .map((conf) => ({ ...conf, selected: false }));
        const newConfigs = [...otherConfigs, selectedConfig];
        setSPAshipConfigs(newConfigs);
      }
    },
    [configs, setSPAshipConfigs]
  );

  useEffect(() => {
    try {
      const localStorageConfigs = localStorage.getItem(configsKey);
      if (localStorageConfigs !== null) {
        setConfigs(JSON.parse(localStorageConfigs));
      }
    } catch (err) {
      console.error(err);
    }
  }, [setConfigs]);

  useEffect(() => {});

  const selected = configs.find((conf) => conf.selected === true);

  return {
    configs,
    selected,
    setSPAshipConfigs,
    setSelectedName,
  };
};

export default useConfig;
