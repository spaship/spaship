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

  // useEffect(() => {
  //   se
  // }, [selected]);

  // useEffect(() => {
  //   setConfigs(presets);
  //   setSelected(undefined);
  // }, []);

  // const environments = selected?.en

  // const storedConfigs = localStorage.getItem(configsKey);
  // const selectedConfigName = localStorage.getItem(selectedKey);

  // const configs: IConfig[] = !!storedConfigs ? JSON.parse(storedConfigs) : [...presets];

  // const selectedConfig = useCallback(() => configs.find((conf) => conf.name === selectedConfigName), [
  //   selectedConfigName,
  // ]);
  // const environments = useCallback(() => {
  //   return selectedConfig()?.environments || [];
  // }, [selectedConfig]);

  // const setSelectedConfigName = useCallback((configName: string) => {
  //   localStorage.setItem(selectedKey, configName);
  // }, []);

  return {
    configs,
    selected,
    setSPAshipConfigs,
    setSelectedName,
  };
};

export default useConfig;
