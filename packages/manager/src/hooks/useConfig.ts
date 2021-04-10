import { useState, useEffect } from "react";
import { IConfig } from "../config";

const configsKey = "spaship-configs";
const selectedKey = "spaship-selected-config";

const useConfig = () => {
  const [configs, setConfigs] = useState<IConfig[]>((window as any).SPAship.configs);
  const [selected, setSelected] = useState<IConfig>();

  const saveStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error(err);
    }
  };

  const saveConfigs = (newConfigs: IConfig[]) => {
    try {
      localStorage.setItem(configsKey, JSON.stringify(newConfigs));
    } catch (err) {
      console.error(err);
    }
  };

  const addConfig = (conf: IConfig) => {
    const newConfigs = [...configs, conf];
    saveStorage(configsKey, JSON.stringify(newConfigs));
    setConfigs(newConfigs);
  };

  const removeConfig = (name: string) => {
    const newConfigs = configs.filter((conf) => conf.name !== name);
    saveConfigs(newConfigs);
    setConfigs(newConfigs);
  };

  const setSelectedConfig = (conf: IConfig) => {
    setSelected(conf);
    saveStorage(selectedKey, conf.name);
  };

  useEffect(() => {
    const localConfigsJSON = localStorage.getItem(configsKey);
    if (localConfigsJSON !== null) {
      const all = [...configs];
      const localConfigs: IConfig[] = JSON.parse(localConfigsJSON);

      localConfigs.forEach((conf) => {
        if (configs.find((c) => c.name === conf.name)) {
        } else {
          all.push(conf);
        }
      });
      setConfigs(all);
    }
  }, [configs]);

  useEffect(() => {
    const selectedName = localStorage.getItem(selectedKey);
    const selectedConfig = configs.find((conf) => conf.name === selectedName);
    setSelected(selectedConfig);
  }, [configs]);

  return {
    configs,
    selected,
    setSelectedConfig,
    addConfig,
    removeConfig,
  };
};

export default useConfig;
