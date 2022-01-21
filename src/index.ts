import { CID, create } from 'ipfs-http-client'
import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { addFolder, getData, hashCID } from './ipfs'

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // We apply our default config here. Any other kind of config resolution
    // or normalization should be placed here.
    //
    // `config` is the resolved config, which will be used during runtime and
    // you should modify.
    // `userConfig` is the config as provided by the user. You should not modify
    // it.
    //
    // If you extended the `HardhatConfig` type, you need to make sure that
    // executing this function ensures that the `config` object is in a valid
    // state for its type, including its extensions. For example, you may
    // need to apply a default value, like in this example.

    config.ipfs = {
      ...userConfig.ipfs,
      host: userConfig.ipfs?.host || 'ipfs.infura.io',
      protocol: userConfig.ipfs?.protocol || 'https',
      port: userConfig.ipfs?.port || 5001,

    }    
  }
);

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  hre.ipfs = {
    client: create(hre.config.ipfs),
    hashCID: hashCID,
    addFolder: async (path: string, pattern: string) => {
      return await addFolder(hre.ipfs.client, path, pattern)
    },
    getData: async (cid: string | CID) => {
      return await getData(hre.ipfs.client, cid)
    }
  }
});
